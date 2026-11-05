import test from 'node:test';
import assert from 'node:assert/strict';
import { appointmentTimeOptions, formatTimeInput } from '../src/utils/appointmentTimes.js';

test('agenda oferece horários durante a madrugada e no final do dia', () => {
  const options = appointmentTimeOptions();
  for (const time of ['00:00', '02:25', '08:00', '18:05', '23:55']) assert.ok(options.some(item => item.value === time));
  assert.equal(new Set(options.map(item => item.value)).size, options.length);
});

test('edição preserva horário exato fora dos intervalos e a digitação aceita minutos livres', () => {
  const options = appointmentTimeOptions('02:23');
  assert.ok(options.some(item => item.value === '02:23'));
  assert.equal(formatTimeInput('0223'), '02:23');
  assert.equal(formatTimeInput('02:23'), '02:23');
  assert.equal(formatTimeInput('02'), '02');
});
