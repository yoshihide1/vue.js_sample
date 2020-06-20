import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import MyPage from '../components/MyPage'
import Sign from '../components/sign'
import firebase from 'firebase'



Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
      //metaフィールド認証されてないと入れない
    },
    {
      path: '/mypage',
      name: 'MyPage',
      component: MyPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/sign',
      name: 'Sign',
      component: Sign
    },
    {
      path: '*',
      redirect: '/sign'
    },
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
