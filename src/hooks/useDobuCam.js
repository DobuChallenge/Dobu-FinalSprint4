import { useEffect, useState } from 'react';
import { cameraConfig } from '../api/config';
import { dobuCamApi } from '../api/dobuCam';
import { cameraUrls, cameraReading } from '../services/camera';

export function useDobuCam() {
  const [endpoint, setEndpoint] = useState(cameraConfig.baseUrl || '');
  const [urls, setUrls] = useState(null);
  const [reading, setReading] = useState(null);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(Date.now());
  const [connecting, setConnecting] = useState(false);
  function conectar() {
    try { setUrls(cameraUrls(endpoint)); setReading(null); setError(''); setConnecting(true); }
    catch { setError('Informe o endereço da Dobu-Cam, com http:// ou https://.'); }
  }
  useEffect(() => {
    if (!urls) return;
    let active = true;
    let timer;
    async function update() {
      try {
        const status = await dobuCamApi.lerStatus(urls.status);
        if (active) { setReading(cameraReading(status)); setError(''); setTick(Date.now()); }
      } catch (err) { if (active) { setError(err.message); setReading(null); } }
      finally { if (active) { setConnecting(false); timer = setTimeout(update, 1000); } }
    }
    update();
    return () => { active = false; clearTimeout(timer); };
  }, [urls]);
  return { endpoint, setEndpoint, conectar, reading, error, connecting, urls,
    frame: urls ? `${urls.frame}?t=${tick}` : '',
    parar: () => { setUrls(null); setReading(null); setError(''); },
  };
}
