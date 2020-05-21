import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '../App.vue'
import Gnavi from '../components/Gnavi.vue'
import Gmap from '../components/Gmap.vue'
Vue.use(VueRouter)

  const routes = [//link元App.vue
    {
      path: '/',
      name: 'App',
      component: App
    },
  {
    path: '/gnavi',
    name: 'Gnavi',
    component: Gnavi
  },
  {
    path: '/gmap',
    name: 'Gmap',
    component: Gmap
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
