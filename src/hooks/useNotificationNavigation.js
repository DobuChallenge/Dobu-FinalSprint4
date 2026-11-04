import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { clearResponse, listenForNotification } from '../services/notifications';

export default function useNotificationNavigation(navigationRef, ready) {
  const { user, restoring } = useAuth();
  const [pending, setPending] = useState(null);
  useEffect(() => listenForNotification(setPending), []);
  useEffect(() => {
    if (!pending || restoring || !user || !ready || !navigationRef.isReady()) return;
    if (pending.kind === 'agendamento' && String(pending.ownerId) === String(user.id) && pending.id) {
      navigationRef.navigate('AdicionarAgendamento', { id: pending.id });
    }
    setPending(null);
    clearResponse().catch(() => {});
  }, [pending, user, restoring, ready, navigationRef]);
}
