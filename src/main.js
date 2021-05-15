import Vue from 'vue'
import App from './App.vue'
// ui库
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
Vue.use(MuseUI);
// FastClick
import FastClick from 'fastclick'
FastClick.attach(document.body)
// flexible
import '../public/js/flexible.js'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
