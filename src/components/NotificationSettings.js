import { Text, View } from 'react-native';
import Button from './Button';
import { useNotifications } from '../providers/NotificationProvider';
import { useAppStyles } from '../hooks/useAppStyles';

export default function NotificationSettings() {
  const { ui } = useAppStyles();
  const { enabled, busy, error, toggle, delivery } = useNotifications();
  return <View style={ui.actions}>
    <Text style={ui.title}>Alertas no celular</Text>
    <Text style={ui.body}>Receba um aviso no horário da consulta. Abra o app para manter os lembretes atualizados após alterações ou cancelamentos.</Text>
    <Button title={busy ? 'Aguarde...' : enabled ? 'Desativar notificações' : 'Ativar notificações'} disabled={busy} onPress={toggle} />
    {enabled && delivery && <Text style={ui.caption}>{delivery.count ? `${delivery.count} lembrete(s) programado(s) no aparelho. Próximo: ${new Date(delivery.nextAt).toLocaleString('pt-BR')}.` : 'Nenhuma consulta futura para lembrar.'}</Text>}
    {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}
  </View>;
}
