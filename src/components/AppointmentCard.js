import { useAppStyles } from '../hooks/useAppStyles';
import { Text, View } from 'react-native';
import Card from './Card';
import Button from './Button';
import { formatAppointmentDate } from '../utils/agendamentoValidation';

export default function AppointmentCard({ item, onEdit, onDelete, onChat, pending }) {
  const { cores, ui, estilos, styles } = useAppStyles();
  return <Card>
    <Text style={ui.badge}>{item.status}</Text>
    <Text style={ui.title}>{item.petNome}</Text>
    <Text style={ui.body}>{formatAppointmentDate(item.dataAgendamento)}</Text>
    <Text style={ui.caption}>Veterinário: {item.veterinarioNome}</Text>
    <View style={ui.actions}>
      {onChat ? <Button title="Conversar e confirmar" icon="chatbubble-outline" onPress={onChat} disabled={pending} /> : null}
      {onEdit ? <Button title="Ver e editar agendamento" icon="create-outline" cor="cinzaEscuro" onPress={onEdit} disabled={pending} /> : null}
      {onDelete ? <Button title={pending ? 'Excluindo…' : 'Excluir agendamento'} cor="vermelho" onPress={onDelete} disabled={pending} /> : null}
    </View>
  </Card>;
}
