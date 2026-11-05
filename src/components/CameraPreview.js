import { createElement } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, View } from 'react-native';

export default function CameraPreview({ colors, imageUri, streamUri, imageReady, message, areas, handlers, onLayout, onLoad, onError }) {
  return (
    <View
      accessibilityLabel="Quadro da câmera externa"
      style={{ width: '100%', height: 220, flexShrink: 0, backgroundColor: '#292724', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}
      onLayout={onLayout}
      {...handlers}
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {Platform.OS === 'web' && !!streamUri && createElement('img', {
          src: streamUri, alt: 'Câmera ao vivo', draggable: false,
          onError: () => onError?.(imageUri),
          style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', display: 'block', pointerEvents: 'none' },
        })}
        {!!imageUri && <Image accessibilityLabel="Imagem da câmera externa" source={{ uri: imageUri }} style={[StyleSheet.absoluteFill, Platform.OS === 'web' && streamUri ? { opacity: 0 } : null]} resizeMode="stretch" onLoad={() => onLoad?.(imageUri)} onError={() => onError?.(imageUri)} />}
        {!imageReady && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 12 }}>
            <ActivityIndicator size="large" color={colors.principal || '#FFB84D'} />
            <Text style={{ color: '#FFFFFF', fontSize: 15, lineHeight: 22, textAlign: 'center' }}>{message}</Text>
          </View>
        )}
        {imageReady && ['food', 'water'].map(kind => areas[kind] && (
          <View key={kind} style={{ position: 'absolute', left: `${areas[kind].x * 100}%`, top: `${areas[kind].y * 100}%`, width: `${areas[kind].width * 100}%`, height: `${areas[kind].height * 100}%`, borderWidth: 2, borderColor: kind === 'food' ? '#FF8C28' : '#55A5D9' }}>
            <Text numberOfLines={1} style={{ position: 'absolute', top: -17, left: 0, width: 64, fontSize: 11, color: '#FFFFFF', backgroundColor: '#333333' }}>{kind === 'food' ? 'COMIDA' : 'ÁGUA'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
