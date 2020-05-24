import Vue from 'vue'
import VueRouter from 'vue-router'
// import App from '../App.vue'
import Home from '../components/Home'
import Gnavi from '../components/Gnavi'
import Weather from '../components/Weather'
import Rakuten from '../components/Rakuten'
import Sign from '../components/Sign'
import firebase from 'firebase'

Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [//link元App.vue
    {
      path: '*',
      redirect: '/sign'
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true}
      //metaフィールド認証されてないと入れない
    },
    {
      path: '/gnavi',
      name: 'Gnavi',
      component: Gnavi,
      meta: { requiresAuth: true}
    },
    {
      path: '/weather',
      name: 'Weather',
      component: Weather,
      meta: { requiresAuth: true}
    },
    {
      path: '/rakuten',
      name: 'Rakuten',
      component: Rakuten,
      meta: { requiresAuth: true}
    },
    {
      path: '/sign',
      name: 'Sign',
      component: Sign
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {//userの認証確認
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        next()
      } else {
        next({
          path: '/sign',
          query: { redirect: to.fullPath }
        })
      }
    })
  } else {
    next()
  }
})



export default router
