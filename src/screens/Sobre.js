import { Text } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import { useAppStyles } from '../hooks/useAppStyles';
import { buildInfo } from '../services/buildInfo';

export default function Sobre({ navigation }) {
  const { ui } = useAppStyles();
  return <Screen navigation={navigation} title="Sobre o Dobu" subtitle="Cuidado que acompanha" active="perfil">
    <Card>
      <Text style={ui.title}>Acompanhamento mesmo à distância</Text>
      <Text style={ui.body}>Vacinas, anotações, consultas e Dobu-Cam para acompanhar seu animal, mesmo de longe.</Text>
      <Text style={ui.caption}>O acompanhamento da câmera não substitui uma avaliação veterinária.</Text>
      <Text style={ui.label}>Versão</Text><Text selectable style={ui.body}>{buildInfo.version}</Text>
      <Text style={ui.label}>Commit de referência</Text><Text selectable style={ui.body}>{buildInfo.commit}</Text>
    </Card>
  </Screen>;
}
