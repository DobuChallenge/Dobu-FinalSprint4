import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

export async function requestPermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('agenda', { name: 'Agendamentos', importance: Notifications.AndroidImportance.HIGH });
  }
  const permission = await Notifications.requestPermissionsAsync();
  return permission.granted;
}

export async function reconcileNotifications(plan) {
  const current = (await Notifications.getAllScheduledNotificationsAsync()).filter(item => item.content.data?.kind === 'agendamento');
  for (const item of current) {
    const expected = plan.find(entry => entry.identifier === item.identifier);
    if (!expected || expected.content.data.scheduledFor !== item.content.data.scheduledFor) {
      await Notifications.cancelScheduledNotificationAsync(item.identifier);
    }
  }
  for (const item of plan) {
    if (current.some(existing => existing.identifier === item.identifier && existing.content.data.scheduledFor === item.content.data.scheduledFor)) continue;
    await Notifications.scheduleNotificationAsync({ ...item, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(item.content.data.scheduledFor), channelId: 'agenda' } });
  }
}

export function listenForNotification(open) {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => open(response.notification.request.content.data));
  Notifications.getLastNotificationResponseAsync().then(response => {
    if (response) open(response.notification.request.content.data);
  }).catch(() => {});
  return () => subscription.remove();
}

export const clearResponse = () => Notifications.clearLastNotificationResponseAsync();
