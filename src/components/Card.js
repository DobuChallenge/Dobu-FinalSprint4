import { useAppStyles } from '../hooks/useAppStyles';
import { StyleSheet, View } from 'react-native';

export default function Card({ children, style }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  return <View style={[styles.cartao, style]}>{children}</View>;
}

const createStyles = (cores) => StyleSheet.create({
  cartao: {
    backgroundColor: cores.fundoClaro,
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
