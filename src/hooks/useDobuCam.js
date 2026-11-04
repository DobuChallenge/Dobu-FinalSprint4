import { useEffect, useRef, useState } from 'react';
import { cameraConfig } from '../api/config';
import { dobuCamApi } from '../api/dobuCam';
import { cameraUrls, cameraReading, fonteExternaAtiva } from '../services/camera';

export function useDobuCam() {
  const [endpoint, setEndpoint] = useState(cameraConfig.baseUrl || '');
  const [urls, setUrls] = useState(null);
  const [reading, setReading] = useState(null);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(Date.now());
  const [events, setEvents] = useState([]);
  const [externalUrl, setExternalUrl] = useState('');
  const [sourceBusy, setSourceBusy] = useState(false);
  const locked = useRef(false);
  const generation = useRef(0);

  function parar() {
    generation.current += 1;
    setUrls(null); setReading(null); setEvents([]); setError('');
  }

  async function conectar() {
    if (locked.current) return;
    locked.current = true;
    const attempt = ++generation.current;
    setSourceBusy(true); setError(''); setUrls(null); setReading(null); setEvents([]);
    try {
      const nextUrls = cameraUrls(endpoint);
      const external = new URL(externalUrl.trim());
      if (!['http:', 'https:'].includes(external.protocol)) throw new Error('Informe a URL HTTP da câmera externa.');
      const connectedAt = Date.now();
      const base = nextUrls.status.replace(/\/status$/, '');
      await dobuCamApi.conectarExterna(base, external.href);
      if (generation.current === attempt) setUrls({ ...nextUrls, base, connectedAt });
    } catch (err) {
      if (generation.current === attempt) setError(err.message || 'Não foi possível conectar a câmera externa.');
    } finally { locked.current = false; setSourceBusy(false); }
  }

  async function pararCaptura() {
    if (locked.current) return;
    locked.current = true;
    setSourceBusy(true);
    parar();
    try { await dobuCamApi.pararCaptura(cameraUrls(endpoint).status.replace(/\/status$/, '')); }
    catch (err) { setError(err.message || 'Não foi possível parar a captura.'); }
    finally { locked.current = false; setSourceBusy(false); }
  }

  useEffect(() => {
    if (!urls) return;
    let active = true;
    let timer;
    async function update() {
      try {
        const [source, status] = await Promise.all([
          dobuCamApi.consultarFonte(urls.base),
          dobuCamApi.lerStatus(urls.status),
        ]);
        if (!active) return;
        if (!fonteExternaAtiva(source)) {
          setReading(null); setEvents([]); setUrls(null);
          setError('A câmera externa não está ativa. Conecte novamente para continuar.');
          return;
        }
        const current = cameraReading(status);
        if (Date.parse(status.last_frame_at) < urls.connectedAt) current.online = current.presente = current.movimento = current.descanso = false;
        setReading(current);
        setEvents((status.events || []).filter(event => Date.parse(event.timestamp) >= urls.connectedAt));
        setError(''); setTick(Date.now());
      } catch (err) { if (active) { setError(err.message); setReading(null); setEvents([]); } }
      finally { if (active) timer = setTimeout(update, 1000); }
    }
    update();
    return () => { active = false; clearTimeout(timer); };
  }, [urls]);

  return { endpoint, setEndpoint, conectar, reading, error, urls, events, externalUrl, setExternalUrl, sourceBusy, pararCaptura,
    frame: urls && reading?.online ? `${urls.frame}?t=${tick}` : '',
    parar,
  };
}
