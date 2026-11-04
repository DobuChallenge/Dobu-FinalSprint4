import { Image, Text, View } from 'react-native';

export default function CameraPreview({ colors, imageUri, imageReady, message, areas, handlers, onLayout, onLoad, onError }) {
  return (
    <View
      accessibilityLabel="Quadro da câmera externa"
      style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.campo, borderRadius: 16, overflow: 'hidden' }}
      onLayout={onLayout}
      {...handlers}
    >
      <View pointerEvents="none" style={{ flex: 1 }}>
        {!!imageUri && <Image accessibilityLabel="Imagem da câmera externa" source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="stretch" onLoad={onLoad} onError={onError} />}
        {!imageReady && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <Text style={{ color: colors.texto, fontSize: 15, lineHeight: 22, textAlign: 'center' }}>{message}</Text>
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
