import { useEffect, useRef, useState } from 'react';
import { cameraConfig } from '../api/config';
import { dobuCamApi } from '../api/dobuCam';
import { validarArea } from '../services/camera';

export function useCameraAnalysis(urls, source, areas, saved) {
  const [result, setResult] = useState(null);
  const [kind, setKind] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const generation = useRef(0);
  const locked = useRef(false);
  useEffect(() => {
    generation.current += 1;
    setResult(null); setError(''); setKind(null);
    return () => { generation.current += 1; };
  }, [urls, source]);

  async function analisar(next) {
    if (locked.current) return;
    if (!urls || !saved || !validarArea(areas[next])) { setError('Marque e salve o pote correspondente antes de analisar.'); return; }
    const current = generation.current;
    locked.current = true; setBusy(true); setKind(next); setResult(null); setError('');
    try {
      let data;
      if (source === 'exemplo') {
        const base = urls.status.replace(/\/status$/, '');
        let job = await dobuCamApi.iniciarAnaliseExemplo(base);
        const deadline = Date.now() + 120000;
        while (job.status === 'running' && Date.now() < deadline && generation.current === current) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          job = await dobuCamApi.consultarAnaliseExemplo(base);
        }
        if (job.status !== 'done') throw new Error('A análise não terminou. Tente novamente em instantes.');
        data = job.result?.[next];
      } else {
        if (!cameraConfig.analysisUrl) throw new Error('Configure EXPO_PUBLIC_ANALYSIS_API_URL para consultar o serviço de análise.');
        data = await dobuCamApi.analisarConsumo(cameraConfig.analysisUrl.replace(/\/+$/, ''), areas[next], next);
      }
      if (!data) throw new Error('O serviço não retornou resultados.');
      if (generation.current === current) setResult(data);
    } catch (err) { if (generation.current === current) setError(err.message); }
    finally { locked.current = false; setBusy(false); }
  }
  return { analisar, result, kind, busy, error };
}
