import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue'
import CameraView from './components/CameraView.vue'

import '@ionic/vue/css/core.css'

const app = createApp(CameraView)
app.use(IonicVue)
app.mount('#app')
