import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEY = 'dobu.session';
const options = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

export const sessionStorage = {
  async read() {
    if (Platform.OS === 'web') {
      const value = window.localStorage.getItem(KEY);
      if (!value) return null;
      try { return JSON.parse(value); }
      catch { window.localStorage.removeItem(KEY); return null; }
    }
    const value = await SecureStore.getItemAsync(KEY, options);
    if (!value) return null;
    try { return JSON.parse(value); }
    catch { await SecureStore.deleteItemAsync(KEY, options); return null; }
  },
  write: async (session) => Platform.OS === 'web'
    ? window.localStorage.setItem(KEY, JSON.stringify(session))
    : SecureStore.setItemAsync(KEY, JSON.stringify(session), options),
  remove: async () => Platform.OS === 'web'
    ? window.localStorage.removeItem(KEY)
    : SecureStore.deleteItemAsync(KEY, options),
};
