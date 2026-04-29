# Especificación Técnica - App de IA On-Device

## Modelo Elegido: TensorFlow.js + COCO-SSD

**Modelo**: COCO-SSD (Common Objects in Context - Single Shot MultiBox Detector)

**Peso del modelo**: Aproximadamente 8-10 MB (versión cuantizada para móviles)

**Por qué es ideal para móviles**:
- Diseñado para dispositivos con recursos limitados
- Detecta 80+ clases de objetos comunes (personas, coches, bicicletas, etc.)
- No requiere conexión a internet tras la carga inicial
- Optimizado para inferencia en tiempo real en CPU/GPU móvil
- Forma parte de TensorFlow.js, permitiendo ejecución nativa en el navegador/dispositivo

## Flujo de la Cámara

La captura de video se realizará mediante:

1. **Capacitor Camera API** (`@capacitor/camera`): Para acceso nativo a la cámara en dispositivos móviles (iOS/Android)
2. **HTML5 Video Tag**: Elemento `<video>` para renderizar el stream de la cámara
3. **Configuración**:
   - Usar cámara trasera por defecto (environment)
   - Resolución optimizada para detección (1280x720 o similar)
   - Sin almacenamiento de imágenes (stream en tiempo real)

```html
<video id="camera-feed" autoplay playsinline muted></video>
```

## Feedback al Usuario

El sistema de detección mostrará resultados mediante un **Canvas Overlay**:

1. **Canvas superpuesto**: Elemento `<canvas>` posicionado absolutamente sobre el `<video>`
2. **Bounding Boxes**: Rectángulos dibujados sobre los objetos detectados
3. **Información mostrada**:
   - Caja delimitadora (bounding box) con color distintivo por clase
   - Etiqueta de clase (ej. "person", "car", "bottle")
   - Porcentaje de confianza (ej. "85%")

```javascript
// Ejemplo de dibujado
ctx.strokeRect(x, y, width, height);
ctx.fillText(`${label} ${confidence.toFixed(0)}%`, x, y - 5);
```

## Arquitectura de Detección

```
[Video Stream] → [TensorFlow.js] → [COCO-SSD Model] → [Detections] → [Canvas Overlay]
```

**Frecuencia de detección**: 5-10 FPS para balancear rendimiento y fluidez
