import { createApp, createSSRApp } from 'vue'
import App from './App.vue'
import './style.css'

const root = document.getElementById('app')
const hasPrerenderedContent = Boolean(root.querySelector('[data-page]'))
;(hasPrerenderedContent ? createSSRApp(App) : createApp(App)).mount(root)
