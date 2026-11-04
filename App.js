import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import QueryProvider from './src/providers/QueryProvider';
import AuthProvider from './src/providers/AuthProvider';

import AppNavigator from './src/navigation/AppNavigator';
import { cores } from './src/styles/tema';
import ThemeProvider, { useTheme } from './src/providers/ThemeProvider';

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider><SafeAreaProvider>
          <ThemedNavigation />
        </SafeAreaProvider></ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

function ThemedNavigation() {
  const { mode, colors } = useTheme();
  const base = mode === 'dark' ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, background: colors.fundo, card: colors.fundoClaro, text: colors.texto, primary: colors.principal } };
  return <NavigationContainer theme={theme}>
    <StatusBar style={mode === 'dark' ? 'light' : 'dark'} backgroundColor={colors.fundo} />
    <AppNavigator />
  </NavigationContainer>;
}
