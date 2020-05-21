import Vue from 'vue'
// import Vuex from 'Vuex'
import App from './App.vue'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'
Vue.use(BootstrapVue)
Vue.config.productionTip = false
console.log(process.env.GNAVI)
// Vue.use(Vuex)

// const store = new Vuex.store({})
new Vue({
  // store,
  router,
  render: h => h(App)
}).$mount('#app')
