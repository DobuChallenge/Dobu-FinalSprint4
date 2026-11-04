import { useRef, useState } from 'react';
import { useTheme } from '../providers/ThemeProvider';

export function useThemeToggle() {
  const { mode, colors, setPreference } = useTheme();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const locked = useRef(false);
  async function toggle() {
    if (locked.current) return;
    locked.current = true;
    setSaving(true); setError('');
    try { await setPreference(mode === 'dark' ? 'light' : 'dark'); }
    catch { setError('Não foi possível mudar o tema. Tente novamente.'); }
    finally { locked.current = false; setSaving(false); }
  }
  return { mode, colors, saving, error, toggle };
}
