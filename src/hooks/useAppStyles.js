import { useMemo } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { createUi } from '../styles/ui';
import { createGlobalStyles } from '../styles/globalStyles';

export function useAppStyles(createStyles) {
  const { colors } = useTheme();
  return useMemo(() => ({
    cores: colors,
    styles: createStyles ? createStyles(colors) : {},
    ui: createUi(colors),
    estilos: createGlobalStyles(colors),
  }), [colors, createStyles]);
}
