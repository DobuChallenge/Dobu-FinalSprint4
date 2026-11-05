import { Text, View } from 'react-native';
import Button from './Button';
import { useNotifications } from '../providers/NotificationProvider';
import { useAppStyles } from '../hooks/useAppStyles';

export default function NotificationSettings() {
  const { ui } = useAppStyles();
  const { enabled, busy, error, toggle, delivery } = useNotifications();
  return <View style={ui.actions}>
    <Text style={ui.title}>Alertas no celular</Text>
    <Text style={ui.body}>Receba um aviso no horário da consulta. Depois de uma alteração ou cancelamento, abra o app para atualizar seus lembretes.</Text>
    <Button title={busy ? 'Aguarde...' : enabled ? 'Desativar notificações' : 'Ativar notificações'} disabled={busy} onPress={toggle} />
    {enabled && delivery && <Text style={ui.caption}>{delivery.count ? `${delivery.count === 1 ? '1 lembrete programado' : `${delivery.count} lembretes programados`}. Próximo aviso: ${new Date(delivery.nextAt).toLocaleString('pt-BR')}.` : 'Você ainda não tem consultas futuras com lembrete.'}</Text>}
    {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}
  </View>;
}
