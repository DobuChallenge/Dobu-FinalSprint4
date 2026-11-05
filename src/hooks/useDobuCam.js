import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { useAuth } from './useAuth';
import { cameraConfig } from '../api/config';
import { dobuCamApi } from '../api/dobuCam';
import { cameraUrls, cameraReading, externalCameraUrl } from '../services/camera';

const defaultEndpoint = cameraConfig.baseUrl || (Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000');

export function useDobuCam(cameraId = 'principal') {
  const { user } = useAuth();
  const settingsKey = user?.id ? `dobu:camera:${user.id}:${cameraId}` : null;
  const [endpoint, setEndpoint] = useState(defaultEndpoint);
  const [urls, setUrls] = useState(null);
  const [reading, setReading] = useState(null);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(Date.now());
  const [events, setEvents] = useState([]);
  const [externalUrl, setExternalUrl] = useState('');
  const [sourceBusy, setSourceBusy] = useState(false);
  const [settingsReady, setSettingsReady] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [imageReady, setImageReady] = useState(false);
  const [imageError, setImageError] = useState('');
  const [loadedFrame, setLoadedFrame] = useState('');
  const [sourceActive, setSourceActive] = useState(false);
  const locked = useRef(false);
  const generation = useRef(0);
  const imageRequestPending = useRef(false);

  useEffect(() => {
    let active = true;
    generation.current += 1;
    setUrls(null); setReading(null); setEvents([]); setError('');
    setImageReady(false); setImageError(''); setLoadedFrame(''); setSourceActive(false);
    imageRequestPending.current = false;
    setSettingsReady(false); setSettingsError('');
    setEndpoint(defaultEndpoint);
    setExternalUrl('');
    if (!settingsKey) return () => { active = false; generation.current += 1; };
    AsyncStorage.getItem(settingsKey).then(value => {
      if (!active || !value) return;
      const saved = JSON.parse(value);
      if (typeof saved.endpoint === 'string') setEndpoint(saved.endpoint);
      if (typeof saved.externalUrl === 'string') setExternalUrl(saved.externalUrl);
    }).catch(() => {
      if (active) setSettingsError('Não foi possível recuperar o endereço salvo. Digite o IP novamente.');
    }).finally(() => { if (active) setSettingsReady(true); });
    return () => { active = false; generation.current += 1; };
  }, [settingsKey]);

  function parar() {
    generation.current += 1;
    setUrls(null); setReading(null); setEvents([]); setError('');
    setImageReady(false); setImageError(''); setLoadedFrame(''); setSourceActive(false);
    imageRequestPending.current = false;
  }

  async function conectarFonte(source) {
    if (locked.current || !settingsReady) return;
    locked.current = true;
    const attempt = ++generation.current;
    setSourceBusy(true); setError(''); setUrls(null); setReading(null); setEvents([]);
    setImageReady(false); setImageError(''); setLoadedFrame(''); setSourceActive(false);
    imageRequestPending.current = false;
    try {
      const nextUrls = cameraUrls(endpoint);
      const external = source === 'celular' ? externalCameraUrl(externalUrl) : externalUrl;
      const connectedAt = Date.now();
      const base = nextUrls.status.replace(/\/status$/, '');
      const response = source === 'celular' ? await dobuCamApi.conectarExterna(base, external) : await dobuCamApi.conectarWebcam(base);
      if (generation.current === attempt) {
        if (source === 'celular') setExternalUrl(external);
        setSourceActive(true);
        imageRequestPending.current = true;
        setTick(Date.now());
        setUrls({ ...nextUrls, base, connectedAt, serverConnectedAt: Date.parse(response?.started_at) || connectedAt, source });
        setSettingsError('');
        try { await AsyncStorage.setItem(settingsKey, JSON.stringify({ endpoint: endpoint.trim(), externalUrl: external })); }
        catch { if (generation.current === attempt) setSettingsError('A conexão foi solicitada, mas não foi possível salvar o endereço neste aparelho.'); }
      }
    } catch (err) {
      if (generation.current === attempt) setError(err.message || 'Não foi possível conectar a câmera.');
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
        const [sourceResult, statusResult] = await Promise.allSettled([
          dobuCamApi.consultarFonte(urls.base),
          dobuCamApi.lerStatus(urls.status),
        ]);
        if (!active) return;
        if (sourceResult.status === 'rejected') throw sourceResult.reason;
        if (sourceResult.value?.source !== urls.source || sourceResult.value?.running !== true) {
          setReading(null); setEvents([]); setSourceActive(false);
          setImageReady(false); setLoadedFrame(''); imageRequestPending.current = false;
          setError('A fonte de imagem não está ativa. Conecte novamente para continuar.');
          return;
        }
        setSourceActive(true);
        if (statusResult.status === 'fulfilled') {
          const status = statusResult.value;
          const current = cameraReading(status);
          if (Date.parse(status.last_frame_at) < urls.serverConnectedAt) current.online = current.presente = current.movimento = current.descanso = false;
          setReading(current);
          setEvents((status.events || []).filter(event => Date.parse(event.timestamp) >= urls.serverConnectedAt));
          setError(!current.online && Date.now() - urls.connectedAt > 20000
            ? urls.source === 'webcam' ? 'Confira se a webcam está disponível e se outro programa está usando a câmera.' : 'Confira o IP e se a transmissão da câmera externa está aberta.' : '');
        } else {
          setReading(null); setEvents([]);
          setError('Não foi possível atualizar a leitura do animal. A imagem continua sendo consultada.');
        }
        if (!imageRequestPending.current) { imageRequestPending.current = true; setTick(Date.now()); }
      } catch (err) { if (active) { setError(err.message); setReading(null); setEvents([]); setSourceActive(false); setImageReady(false); imageRequestPending.current = false; } }
      finally { if (active) timer = setTimeout(update, 1000); }
    }
    update();
    return () => { active = false; clearTimeout(timer); };
  }, [urls]);

  const frame = urls && sourceActive ? `${urls.frame}?t=${tick}` : '';
  return { endpoint, setEndpoint, externalUrl, setExternalUrl, conectar: () => conectarFonte('celular'), conectarWebcam: () => conectarFonte('webcam'), reading, error, urls, events, sourceBusy, pararCaptura, settingsReady, settingsError, imageReady, imageError, loadedFrame,
    frame,
    atualizarImagem: () => { imageRequestPending.current = true; setImageError(''); setTick(Date.now()); },
    imagemCarregada: (uri) => { if (urls && uri === frame) { imageRequestPending.current = false; setImageReady(true); setImageError(''); setLoadedFrame(uri); } },
    imagemFalhou: (uri) => { if (urls && uri === frame) { imageRequestPending.current = false; setImageReady(false); setImageError('A imagem não carregou. Confira a câmera selecionada e tente atualizar.'); } },
    parar,
  };
}
