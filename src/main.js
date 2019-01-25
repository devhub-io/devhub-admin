import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
// import './mock' // simulation data

// Socket.io
import io from 'socket.io-client'
const socket = io(process.env.SOCKET_URL, {
  query: {
    room: 'default',
    userId: `client_${Math.random()}`
  },
  transaction: ['websocket']
})
Vue.prototype.$socket = socket
socket.on('connect', () => {
  const id = socket.id
  console.log('#connect,', id, socket)
  socket.emit('ping', 'hi')
  socket.on(id, msg => {
    console.log('#receive,', msg)
  })
})
socket.on('online', msg => {
  console.log('#online,', msg)
})
socket.on('disconnect', msg => {
  console.log('#disconnect', msg)
})

socket.on('disconnecting', () => {
  console.log('#disconnecting')
})

socket.on('error', () => {
  console.log('#error')
})

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
