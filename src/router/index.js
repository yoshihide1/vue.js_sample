import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Gnavi from '../components/Gnavi'
import Weather from '../components/Weather'
import Travel from '../components/Travel'
import Sightseeing from '../components/Sightseeing'
import MyPage from '../components/MyPage'
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
      path: '/mypage',
      name: 'MyPage',
      component: MyPage,
      meta: { requiresAuth: true}
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
      path: '/travel',
      name: 'Travel',
      component: Travel,
      meta: { requiresAuth: true}
    },
    {
      path: '/sightseeing',
      name: 'Sightseeing',
      component: Sightseeing,
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
