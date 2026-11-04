import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder } from 'react-native';
import { dobuCamApi } from '../api/dobuCam';
import { validarArea } from '../services/camera';

export function useBowlMarkers(urls) {
  const [areas, setAreas] = useState({ food: null, water: null });
  const [selected, setSelected] = useState(null);
  const [frozen, setFrozen] = useState('');
  const [size, setSize] = useState({ width: 1, height: 1 });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const start = useRef(null);
  useEffect(() => {
    let active = true;
    setAreas({ food: null, water: null }); setFrozen(''); setSelected(null);
    if (urls) dobuCamApi.lerConfiguracao(urls.config).then((value) => {
      if (active) setAreas({ food: validarArea(value.bowl_config?.food) ? value.bowl_config.food : null, water: validarArea(value.bowl_config?.water) ? value.bowl_config.water : null });
    }).catch(() => { if (active) setError('Não foi possível carregar as marcações.'); });
    return () => { active = false; };
  }, [urls]);
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => Boolean(selected),
    onMoveShouldSetPanResponder: () => Boolean(selected),
    onPanResponderGrant: (event) => { start.current = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY }; },
    onPanResponderRelease: (event, gesture) => {
      if (!start.current || !selected || size.width <= 1) return;
      const first = start.current;
      const endX = Math.max(0, Math.min(size.width, first.x + gesture.dx));
      const endY = Math.max(0, Math.min(size.height, first.y + gesture.dy));
      const area = { x: Math.min(first.x, endX) / size.width, y: Math.min(first.y, endY) / size.height, width: Math.abs(first.x - endX) / size.width, height: Math.abs(first.y - endY) / size.height };
      if (validarArea(area)) { setAreas((current) => ({ ...current, [selected]: area })); setSelected(null); }
      start.current = null;
    },
  }), [selected, size]);
  async function salvar() {
    if (!urls || saving) return;
    setSaving(true); setError('');
    try { await dobuCamApi.salvarConfiguracao(urls.config, areas); setFrozen(''); setSelected(null); }
    catch (err) { setError(err.message); } finally { setSaving(false); }
  }
  return { areas, frozen, selected, setSize, error, saving, salvar, handlers: responder.panHandlers,
    marcar: (kind, frame) => { if (frame) { setFrozen(frame); setSelected(kind); setError(''); } },
    retomar: () => { setFrozen(''); setSelected(null); },
  };
}
