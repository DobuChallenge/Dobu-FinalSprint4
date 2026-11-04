import { NavigationContainer, DarkTheme, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import QueryProvider from './src/providers/QueryProvider';
import AuthProvider from './src/providers/AuthProvider';

import AppNavigator from './src/navigation/AppNavigator';
import { cores } from './src/styles/tema';
import ThemeProvider, { useTheme } from './src/providers/ThemeProvider';
import NotificationProvider from './src/providers/NotificationProvider';
import useNotificationNavigation from './src/hooks/useNotificationNavigation';

const navigationRef = createNavigationContainerRef();

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider><SafeAreaProvider>
          <NotificationProvider><ThemedNavigation /></NotificationProvider>
        </SafeAreaProvider></ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

function ThemedNavigation() {
  const [ready, setReady] = useState(false);
  useNotificationNavigation(navigationRef, ready);
  const { mode, colors } = useTheme();
  const base = mode === 'dark' ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, background: colors.fundo, card: colors.fundoClaro, text: colors.texto, primary: colors.principal } };
  return <NavigationContainer ref={navigationRef} onReady={() => setReady(true)} theme={theme}>
    <StatusBar style={mode === 'dark' ? 'light' : 'dark'} backgroundColor={colors.fundo} />
    <AppNavigator />
  </NavigationContainer>;
}
