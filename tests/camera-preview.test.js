import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const { transformSync } = require('@babel/core');
const source = readFileSync(new URL('../src/components/CameraPreview.js', import.meta.url), 'utf8');
const compiled = transformSync(source, {
  configFile: false, babelrc: false,
  presets: [[require.resolve('@babel/preset-react'), { runtime: 'automatic' }]],
  plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
}).code;
const loaded = { exports: {} };
new Function('require', 'module', 'exports', compiled)(name => require(name === 'react-native' ? 'react-native-web' : name), loaded, loaded.exports);
const CameraPreview = loaded.exports.default;
const colors = { campo: '#333333', texto: '#FFFFFF' };

test('quadro permanece visivel quando a camera esta desconectada', () => {
  const html = renderToStaticMarkup(React.createElement(CameraPreview, { colors, imageUri: '', imageReady: false, message: 'Conecte a câmera externa para ver a imagem aqui.', areas: {} }));
  assert.match(html, /Quadro da câmera externa/);
  assert.match(html, /Conecte a câmera externa/);
  assert.doesNotMatch(html, /COMIDA|ÁGUA/);
});

test('imagem pausada e marcacoes continuam visiveis sem depender da leitura do animal', () => {
  const html = renderToStaticMarkup(React.createElement(CameraPreview, { colors, imageUri: 'http://camera.invalid/frame.jpg', imageReady: true, areas: { food: { x: 0.1, y: 0.1, width: 0.2, height: 0.2 } } }));
  assert.match(html, /Quadro da câmera externa/);
  assert.match(html, /Imagem da câmera externa/);
  assert.match(html, /COMIDA/);
});

test('transmissão web usa o stream original sem substituir a imagem pausada', () => {
  const html = renderToStaticMarkup(React.createElement(CameraPreview, { colors, imageUri: 'http://camera.invalid/camera-frame', streamUri: 'http://camera.invalid/camera-stream?session=1', imageReady: true, areas: {} }));
  assert.match(html, /camera-stream\?session=1/);
  const paused = renderToStaticMarkup(React.createElement(CameraPreview, { colors, imageUri: 'http://camera.invalid/frozen.jpg', imageReady: true, areas: {} }));
  assert.doesNotMatch(paused, /camera-stream/);
});
