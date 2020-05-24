import Vue from 'vue'
// import Vuex from 'Vuex'
import App from './App.vue'
import router from './router'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore"
Vue.use(BootstrapVue)
Vue.config.productionTip = false
// Vue.use(Vuex)

  const firebaseConfig = {
    apiKey: process.env.VUE_APP_apiKey,
    authDomain: process.env.VUE_APP_authDomain,
    databaseURL: process.env.VUE_APP_databaseURL,
    projectId: process.env.VUE_APP_projectId,
    storageBucket: process.env.VUE_APP_storageBucket,
    messagingSenderId: process.env.VUE_APP_messagingSenderId,
    appId: process.env.VUE_APP_appId,
    measurementId: process.env.VUE_APP_measurementId
  };
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

// const store = new Vuex.store({})
new Vue({
  // store,
  router,
  render: h => h(App)
}).$mount('#app')
