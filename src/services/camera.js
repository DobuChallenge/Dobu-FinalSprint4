export function cameraUrls(base) {
  const url = new URL(String(base || '').trim());
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Informe uma URL HTTP válida para a Dobu-Cam.');
  const root = url.href.replace(/\/+$/, '');
  return { status: `${root}/status`, frame: `${root}/camera-frame`, config: `${root}/configuracao` };
}

export function cameraReading(data) {
  const lastFrame = Date.parse(data.last_frame_at || '');
  const online = Boolean(data.camera_online) && Number.isFinite(lastFrame) && Date.now() - lastFrame < 15000;
  return { online, presente: online && Boolean(data.pet_detected), movimento: online && Boolean(data.pet_moving),
    especie: data.species || '', confianca: Number(data.confidence || 0), lastFrame: data.last_frame_at,
    exemplo: data.telemetry?.sensor === 'video-exemplo', quietSeconds: Number(data.quiet_seconds || 0) };
}

export function validarArea(area) {
  return Boolean(area && ['x', 'y', 'width', 'height'].every((key) => Number.isFinite(area[key])) && area.x >= 0 && area.y >= 0 && area.width > 0 && area.height > 0 && area.x + area.width <= 1.001 && area.y + area.height <= 1.001);
}
