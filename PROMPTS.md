# Configuración y Ajustes del Proyecto

Se utilizó la Inteligencia Artificial para llevar a cabo las siguientes tareas en este proyecto:

1. **Configuración de Capacitor**: Se añadió el soporte para Android (`@capacitor/android`) y se configuró el archivo `capacitor.config.json` apuntando el directorio web (`webDir`) a la carpeta `dist` para facilitar la generación del APK nativo.
2. **Integración de COCO-SSD**: Se integró el modelo de TensorFlow.js `coco-ssd` para la detección de objetos en tiempo real a través de la cámara del dispositivo.
3. **Resolución de Errores de Textura en WebGL**: Se solventó el error `Requested texture size [0x0] is invalid` en `src/components/CameraView.vue` añadiendo validaciones en el bucle de detección (`detectFrame`) que comprueban que las dimensiones y el estado del vídeo estén listos antes de pasárselo al modelo de TensorFlow.
4. **Gestión de Permisos de Cámara**: Configuración y gestión adecuada de permisos para acceder al stream de vídeo.
