<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="custom-toolbar">
        <ion-title>IA Vision Scanner</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="scanner-content">
      <div class="main-wrapper">
        <!-- Loading Overlay -->
        <div v-if="loading && !cameraError" class="loading-overlay">
          <div class="spinner"></div>
          <p>Cargando IA...</p>
        </div>

        <!-- Error Card -->
        <div v-if="cameraError" class="error-container">
          <ion-card class="error-card">
            <ion-card-content class="error-card-content">
              <ion-icon :icon="warningOutline" class="error-icon"></ion-icon>
              <h3>No se detectó ninguna cámara en este dispositivo</h3>
              <p>Por favor, asegúrate de que los permisos estén habilitados y que el dispositivo cuente con una cámara funcional.</p>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Camera Container -->
        <div v-if="!cameraError" class="camera-container">
          <video
            ref="videoRef"
            class="camera-feed"
            autoplay
            playsinline
            muted
          ></video>
          <canvas
            ref="canvasRef"
            class="detection-overlay"
          ></canvas>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon 
} from '@ionic/vue'
import { warningOutline } from 'ionicons/icons'
import '@tensorflow/tfjs'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

const videoRef = ref(null)
const canvasRef = ref(null)
const loading = ref(true)
const cameraError = ref(false)

let model = null
let stream = null
let animFrameId = null
let lastDetectionTime = 0
const detectionInterval = 150

const colors = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
  '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB'
]
const colorMap = {}

onMounted(async () => {
  await loadModel()
  await initCamera()
  startDetection()
})

onUnmounted(() => {
  cleanup()
})

async function loadModel() {
  try {
    loading.value = true
    model = await cocoSsd.load()
  } catch (error) {
    console.error('Error loading model:', error)
  } finally {
    loading.value = false
  }
}

async function initCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })
  } catch (envError) {
    console.warn('Environment camera not found, trying default webcam:', envError)
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true })
    } catch (defaultError) {
      console.error('Error accessing camera:', defaultError)
      if (defaultError.name === 'NotFoundError') {
        cameraError.value = true
      } else {
        cameraError.value = true
      }
      return
    }
  }
  if (videoRef.value) {
    videoRef.value.srcObject = stream
    videoRef.value.play()
    videoRef.value.onloadedmetadata = () => {
      if (canvasRef.value && videoRef.value) {
        canvasRef.value.width = videoRef.value.videoWidth
        canvasRef.value.height = videoRef.value.videoHeight
      }
    }
  }
}

function startDetection() {
  detectFrame()
}

function detectFrame(timestamp) {
  if (!model || !videoRef.value || !canvasRef.value) return

  const videoElement = videoRef.value
  if (videoElement.readyState >= 2 && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
    // Ensure canvas dimensions match video
    if (canvasRef.value.width !== videoElement.videoWidth || canvasRef.value.height !== videoElement.videoHeight) {
      canvasRef.value.width = videoElement.videoWidth
      canvasRef.value.height = videoElement.videoHeight
    }

    if (timestamp - lastDetectionTime >= detectionInterval) {
      lastDetectionTime = timestamp
      model.detect(videoElement).then(predictions => {
        drawDetections(predictions)
      }).catch(error => {
        console.error('Detection error:', error)
      })
    }
  }

  animFrameId = requestAnimationFrame(detectFrame)
}

function drawDetections(predictions) {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  predictions.forEach(pred => {
    const [x, y, width, height] = pred.bbox
    const label = pred.class
    const confidence = Math.round(pred.score * 100)

    if (!colorMap[label]) {
      colorMap[label] = colors[Object.keys(colorMap).length % colors.length]
    }
    const color = colorMap[label]

    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.strokeRect(x, y, width, height)

    ctx.fillStyle = color
    ctx.font = '18px Arial'
    ctx.fillText(`${label} ${confidence}%`, x, y > 20 ? y - 5 : y + 20)
  })
}

function cleanup() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}
</script>

<style scoped>
.scanner-content {
  --background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
}

.custom-toolbar {
  --background: #0f172a;
  --color: #f8fafc;
  --border-color: rgba(255, 255, 255, 0.1);
}

.main-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 20px;
}

.camera-container {
  position: relative;
  width: 100%;
  max-width: 640px;
  aspect-ratio: 4/3;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
  background-color: #000;
}

.camera-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(15, 23, 42, 0.9);
  z-index: 20;
  color: #f8fafc;
  border-radius: 24px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
}

.error-card {
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.error-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 20px;
}

.error-icon {
  font-size: 64px;
  color: #ef4444;
  margin-bottom: 16px;
}

.error-card h3 {
  color: #f8fafc;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.error-card p {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}
</style>
