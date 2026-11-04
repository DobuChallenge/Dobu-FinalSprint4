import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { notificationPlan } from '../src/services/notificationPlan.js';
import { cameraReading, cameraUrls, validarArea, fonteExternaAtiva, externalCameraUrl } from '../src/services/camera.js';
import { vacinaPayload } from '../src/services/vacinas.js';

const require = createRequire(import.meta.url);
const { parse } = require('@babel/parser');
const now = Date.parse('2026-11-03T12:00:00Z');

test('imagens usam extensoes compativeis com o formato exigido pelo Android', () => {
  const root = new URL('../assets/', import.meta.url);
  for (const name of readdirSync(root)) {
    const bytes = readFileSync(new URL(name, root));
    if (name.endsWith('.png')) assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${name}: assinatura PNG inválida`);
    if (name.endsWith('.webp')) {
      assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
      assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
    }
  }
});

test('alertas usam apenas consultas futuras abertas da conta atual', () => {
  const appointment = { id: 'consulta', status: 'Confirmado', dataAgendamento: '2026-11-03T15:00:00Z', petNome: 'Mia' };
  const plan = notificationPlan([appointment, { ...appointment, id: 'cancelada', status: 'Cancelado' }, { ...appointment, id: 'concluida', status: 'Concluído' }, { ...appointment, id: 'antiga', dataAgendamento: '2026-11-01T10:00:00Z' }], 'tutor', now);
  assert.equal(plan.length, 1);
  assert.equal(plan[0].content.data.ownerId, 'tutor');
  assert.equal(plan[0].content.data.id, 'consulta');
  assert.match(plan[0].content.title, /Mia/);
  assert.deepEqual(notificationPlan([appointment], null, now), []);
  const changed = notificationPlan([{ ...appointment, dataAgendamento: '2026-11-03T16:00:00Z' }], 'tutor', now);
  assert.equal(changed[0].identifier, plan[0].identifier);
  assert.notEqual(changed[0].content.data.scheduledFor, plan[0].content.data.scheduledFor);
});

test('camera sem frame recente nunca indica presenca ou descanso', () => {
  assert.equal(fonteExternaAtiva({ source: 'celular', running: true }), true);
  assert.equal(fonteExternaAtiva({ source: 'webcam', running: true }), false);
  assert.equal(fonteExternaAtiva({ source: 'exemplo', running: true }), false);
  assert.equal(fonteExternaAtiva({ source: 'celular', running: false }), false);
  assert.equal(fonteExternaAtiva(null), false);
  const frame = { camera_online: true, last_frame_at: '2026-11-03T11:59:59Z', pet_detected: true, pet_moving: false, possible_rest: true };
  assert.equal(cameraReading(frame, now).presente, true);
  assert.equal(cameraReading(frame, now).descanso, true);
  assert.equal(cameraReading({ ...frame, last_frame_at: '2026-11-03T11:00:00Z' }, now).presente, false);
  assert.equal(cameraReading({ ...frame, last_frame_at: '--' }, now).descanso, false);
  assert.equal(cameraReading({ ...frame, pet_detected: false, pet_moving: true }, now).movimento, false);
  assert.equal(cameraReading({ ...frame, pet_detected: 'false' }, now).presente, false);
});

test('marcacoes ficam dentro do quadro e URLs recusam credenciais', () => {
  assert.equal(externalCameraUrl('192.168.15.5:8080'), 'http://192.168.15.5:8080/video');
  assert.equal(externalCameraUrl('http://192.168.15.5:8080/video'), 'http://192.168.15.5:8080/video');
  assert.equal(externalCameraUrl('https://camera.local/stream'), 'https://camera.local/stream');
  assert.throws(() => externalCameraUrl(''));
  assert.throws(() => externalCameraUrl('file:///camera'));
  assert.equal(validarArea({ x: 0.1, y: 0.2, width: 0.2, height: 0.3 }), true);
  assert.equal(validarArea({ x: 0.9, y: 0, width: 0.3, height: 1 }), false);
  assert.equal(validarArea(null), false);
  assert.equal(cameraUrls('http://servidor:5000/').frame, 'http://servidor:5000/camera-frame');
  assert.throws(() => cameraUrls('http://usuario:senha@servidor:5000'));
  assert.throws(() => cameraUrls('file:///camera'));
});

test('vacina exige animal, calendario valido e reforco posterior', () => {
  const draft = { nome: 'Antirrábica', dataAplicacao: '03/11/2026', dataProximaDose: '03/11/2027' };
  assert.equal(vacinaPayload(draft, 'pet').dataProximaDose, '2027-11-03T00:00:00');
  assert.throws(() => vacinaPayload(draft, ''));
  assert.throws(() => vacinaPayload({ ...draft, dataAplicacao: '31/02/2026' }, 'pet'));
  assert.throws(() => vacinaPayload({ ...draft, dataProximaDose: '02/11/2026' }, 'pet'));
});

test('telas compilam e regras ficam fora da interface', () => {
  for (const directory of ['screens', 'components', 'hooks', 'providers', 'services']) {
    const root = new URL(`../src/${directory}/`, import.meta.url);
    for (const name of readdirSync(root).filter(name => name.endsWith('.js'))) {
      const code = readFileSync(new URL(name, root), 'utf8');
      const ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
      for (const node of ast.program.body) {
        if (node.type !== 'ImportDeclaration' || !['screens', 'components'].includes(directory)) continue;
        assert.notEqual(node.source.value, '@tanstack/react-query', `${name}: query deve ficar em hook`);
        if (node.source.value.startsWith('../api/')) assert.deepEqual(node.specifiers.map(specifier => specifier.imported?.name), ['ApiError'], `${name}: chamada da API deve ficar em hook ou serviço`);
      }
      if (directory === 'hooks') assert.doesNotMatch(code, /<Screen\b/, `${name}: interface deve ficar na tela`);
    }
  }
});
