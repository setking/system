import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './plugins/element.js'
import '../static/css/theme-green/index.css'
import VueWave from 'vue-waves/dist/vue-waves'
import './style/style.css'
import axios from 'axios'
// import './config/axios'
import './config/rem'
import './assets/iconFont/iconfont.css'


Vue.config.productionTip = false
Vue.use(VueWave)
Vue.use(VueQuillEditor) 
new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')
