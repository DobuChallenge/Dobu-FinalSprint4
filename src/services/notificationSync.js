export async function syncAppointmentNotifications(api, plan) {
  const current = (await api.getAllScheduledNotificationsAsync()).filter(item => item.content.data?.kind === 'agendamento');
  if (plan.length && !(await api.getPermissionsAsync()).granted) {
    for (const item of current) await api.cancelScheduledNotificationAsync(item.identifier);
    throw new Error('As notificações estão bloqueadas no aparelho. Libere a permissão nas configurações e ative os alertas novamente.');
  }
  const unchanged = (first, second) => first.identifier === second.identifier
    && first.content.title === second.content.title && first.content.body === second.content.body
    && first.content.data.scheduledFor === second.content.data.scheduledFor;
  for (const item of current) {
    if (!plan.some(expected => unchanged(expected, item))) await api.cancelScheduledNotificationAsync(item.identifier);
  }
  for (const item of plan) {
    if (current.some(existing => unchanged(item, existing))) continue;
    await api.scheduleNotificationAsync({ ...item, trigger: {
      type: api.SchedulableTriggerInputTypes.DATE,
      date: new Date(item.content.data.scheduledFor), channelId: 'agenda',
    } });
  }
  return { count: plan.length, nextAt: plan.map(item => item.content.data.scheduledFor).sort()[0] || null };
}
