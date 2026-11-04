import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paletas } from '../styles/tema';

const ThemeContext = createContext(null);
const storageKey = 'dobu:tema';
const choices = ['system', 'light', 'dark'];

export default function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState('system');
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey).then((saved) => {
      if (active && choices.includes(saved)) setPreference(saved);
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  const mode = preference === 'system' ? system === 'dark' ? 'dark' : 'light' : preference;
  const value = useMemo(() => ({
    mode, preference, colors: paletas[mode],
    async setPreference(next) {
      if (!choices.includes(next)) return;
      await AsyncStorage.setItem(storageKey, next);
      setPreference(next);
    },
  }), [mode, preference]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('ThemeProvider ausente.');
  return value;
}
