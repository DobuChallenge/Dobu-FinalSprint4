export function appointmentTimeOptions(current = '') {
  const values = Array.from({ length: 288 }, (_, index) => {
    const minutes = index * 5;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  });
  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(current) && !values.includes(current)) values.push(current);
  return values.sort().map(value => ({ value, label: value }));
}

export function formatTimeInput(value) {
  const digits = String(value).replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
}
