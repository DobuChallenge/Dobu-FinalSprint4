export function notificationTargets(appointments, ownerId) {
  if (!ownerId) return [];
  return appointments.flatMap(item => {
    const status = String(item.status || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const date = new Date(item.dataAgendamento);
    if (!['agendado', 'confirmado'].includes(status) || !Number.isFinite(date.getTime()) || !item.id) return [];
    const scheduledFor = date.toISOString();
    return [{
      identifier: `dobu:agenda:${ownerId}:${item.id}`,
      content: {
        title: `Atendimento de ${item.petNome || 'seu animal'}`,
        body: `Seu agendamento está marcado para ${date.toLocaleString('pt-BR')}. Abra para consultar os detalhes.`,
        sound: 'default',
        data: { kind: 'agendamento', ownerId: String(ownerId), id: item.id, scheduledFor },
      },
    }];
  });
}

export function notificationPlan(appointments, ownerId, now = Date.now()) {
  return notificationTargets(appointments, ownerId).filter(item => Date.parse(item.content.data.scheduledFor) > now);
}
