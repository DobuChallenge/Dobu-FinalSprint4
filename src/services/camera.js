export function cameraUrls(base) {
  const url = new URL(String(base || '').trim());
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Informe uma URL HTTP válida para a Dobu-Cam.');
  const root = url.href.replace(/\/+$/, '');
  return { status: `${root}/status`, frame: `${root}/camera-frame`, config: `${root}/configuracao` };
}

export function cameraReading(data = {}, now = Date.now()) {
  const lastFrame = Date.parse(data.last_frame_at || '');
  const age = now - lastFrame;
  const online = data.camera_online === true && Number.isFinite(lastFrame) && age >= -5000 && age < 15000;
  return { online, presente: online && data.pet_detected === true, movimento: online && data.pet_detected === true && data.pet_moving === true,
    descanso: online && data.pet_detected === true && data.possible_rest === true,
    especie: data.species || '', confianca: Number(data.confidence || 0), lastFrame: data.last_frame_at,
    quietSeconds: Number(data.quiet_seconds || 0) };
}

export function fonteExternaAtiva(data) {
  return data?.source === 'celular' && data.running === true;
}

export function validarArea(area) {
  return Boolean(area && ['x', 'y', 'width', 'height'].every((key) => Number.isFinite(area[key])) && area.x >= 0 && area.y >= 0 && area.width > 0 && area.height > 0 && area.x + area.width <= 1.001 && area.y + area.height <= 1.001);
}
