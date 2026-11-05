import test from 'node:test';
import assert from 'node:assert/strict';
import { syncAppointmentNotifications } from '../src/services/notificationSync.js';
import { notificationPlan, notificationTargets } from '../src/services/notificationPlan.js';

function device(initial = [], granted = true) {
  const scheduled = new Map(initial.map(item => [item.identifier, item]));
  const calls = [];
  return { scheduled, calls, SchedulableTriggerInputTypes: { DATE: 'date' },
    getPermissionsAsync: async () => ({ granted }),
    getAllScheduledNotificationsAsync: async () => [...scheduled.values()],
    cancelScheduledNotificationAsync: async id => { calls.push(['cancel', id]); scheduled.delete(id); },
    scheduleNotificationAsync: async item => { calls.push(['schedule', item.identifier]); scheduled.set(item.identifier, structuredClone(item)); },
  };
}
const date = '2030-05-10T15:30:00.000Z';
const appointment = { id: 'consulta', status: 'Agendado', dataAgendamento: date, petNome: 'Lua' };
const plan = () => notificationPlan([appointment], 'tutor', new Date('2030-05-10T10:00:00Z').getTime());

test('consulta real gera alerta com data nativa e destino da consulta, sem duplicar no refetch', async () => {
  const api = device();
  const result = await syncAppointmentNotifications(api, plan());
  assert.equal(result.count, 1);
  const saved = [...api.scheduled.values()][0];
  assert.equal(saved.trigger.type, 'date');
  assert.equal(saved.trigger.date.toISOString(), date);
  assert.equal(saved.trigger.channelId, 'agenda');
  assert.deepEqual(saved.content.data, { kind: 'agendamento', ownerId: 'tutor', id: 'consulta', scheduledFor: date });
  await syncAppointmentNotifications(api, plan());
  assert.equal(api.calls.length, 1);
});

test('edicao de conteudo e horario reprograma; cancelar ou sair remove so alertas da agenda', async () => {
  const api = device([{ identifier: 'outro', content: { data: { kind: 'outro' } } }]);
  await syncAppointmentNotifications(api, plan());
  const edited = plan();
  edited[0].content.body = 'Consulta atualizada';
  await syncAppointmentNotifications(api, edited);
  assert.equal(api.calls.filter(call => call[0] === 'schedule').length, 2);
  edited[0].content.data.scheduledFor = '2030-05-10T16:30:00.000Z';
  await syncAppointmentNotifications(api, edited);
  assert.equal([...api.scheduled.values()].find(item => item.content.data.kind === 'agendamento').trigger.date.toISOString(), '2030-05-10T16:30:00.000Z');
  await syncAppointmentNotifications(api, []);
  assert.deepEqual([...api.scheduled.keys()], ['outro']);
});

test('permissao revogada remove pendencias e informa que os alertas estao bloqueados', async () => {
  const api = device(plan(), false);
  await assert.rejects(syncAppointmentNotifications(api, plan()), /bloqueadas/);
  assert.equal(api.scheduled.size, 0);
});

test('atualizar a agenda depois do horário não cancela um aviso que o Android ainda vai entregar', async () => {
  const api = device();
  await syncAppointmentNotifications(api, plan());
  const future = notificationPlan([appointment], 'tutor', Date.parse('2030-05-10T15:30:30Z'));
  assert.equal(future.length, 0);
  const result = await syncAppointmentNotifications(api, future, notificationTargets([appointment], 'tutor'));
  assert.equal(result.count, 1);
  assert.equal(api.calls.filter(call => call[0] === 'cancel').length, 0);
  api.scheduled.clear();
  await syncAppointmentNotifications(api, future, notificationTargets([appointment], 'tutor'));
  assert.equal(api.calls.filter(call => call[0] === 'schedule').length, 1);
});
