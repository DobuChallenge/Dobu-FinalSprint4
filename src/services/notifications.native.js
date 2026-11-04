import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { syncAppointmentNotifications } from './notificationSync';

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
  if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('agenda', { name: 'Agendamentos', importance: Notifications.AndroidImportance.HIGH });
  return syncAppointmentNotifications(Notifications, plan);
}

export function listenForNotification(open) {
  const handle = (response) => {
    open(response.notification.request.content.data);
    Notifications.dismissNotificationAsync(response.notification.request.identifier).catch(() => {});
  };
  const subscription = Notifications.addNotificationResponseReceivedListener(handle);
  Notifications.getLastNotificationResponseAsync().then(response => {
    if (response) handle(response);
  }).catch(() => {});
  return () => subscription.remove();
}

export const clearResponse = () => Notifications.clearLastNotificationResponseAsync();
