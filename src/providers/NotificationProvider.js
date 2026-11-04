import { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../hooks/useAuth';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { notificationPlan } from '../services/notificationPlan';
import { requestPermission, reconcileNotifications } from '../services/notifications';

const Context = createContext(null);
export const useNotifications = () => useContext(Context);

export default function NotificationProvider({ children }) {
  const { user, restoring } = useAuth();
  const ownerId = user?.id;
  const query = useAgendamentos();
  const [preference, setPreference] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const queue = useRef(Promise.resolve());
  const currentOwner = useRef(ownerId);
  currentOwner.current = ownerId;
  const enabled = Boolean(ownerId && preference?.ownerId === ownerId && preference.enabled);

  useEffect(() => {
    let active = true;
    setPreference(null);
    setError('');
    if (ownerId) AsyncStorage.getItem(`dobu:notificacoes:${ownerId}`).then(value => {
      if (active) setPreference({ ownerId, enabled: value === 'true' });
    }).catch(() => { if (active) setError('Não foi possível carregar sua preferência.'); });
    return () => { active = false; };
  }, [ownerId]);

  useEffect(() => {
    if (restoring || (ownerId && preference?.ownerId !== ownerId) || (enabled && !query.isSuccess)) return;
    const plan = enabled ? notificationPlan(query.data, ownerId) : [];
    let active = true;
    queue.current = queue.current.catch(() => {}).then(() => reconcileNotifications(plan)).catch(() => {
      if (active) setError('Não foi possível atualizar os lembretes do celular. Tente ativar novamente.');
    });
    return () => { active = false; };
  }, [ownerId, restoring, enabled, preference, query.data, query.isSuccess]);

  async function toggle() {
    if (!ownerId || busy) return;
    const account = ownerId;
    setBusy(true);
    setError('');
    try {
      const next = !enabled;
      if (next && !(await requestPermission())) throw new Error('Permita as notificações nas configurações do celular. No navegador, use o APK para receber alertas.');
      await AsyncStorage.setItem(`dobu:notificacoes:${account}`, String(next));
      if (currentOwner.current === account) setPreference({ ownerId: account, enabled: next });
    } catch (err) {
      if (currentOwner.current === account) setError(err.message || 'Não foi possível salvar a preferência.');
    } finally { setBusy(false); }
  }

  return <Context.Provider value={{ enabled, busy, error, toggle }}>{children}</Context.Provider>;
}
