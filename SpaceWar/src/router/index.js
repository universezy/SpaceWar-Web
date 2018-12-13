import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import battle from '@/components/battle'
import solo from '@/components/solo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/battle',
      name: 'battle',
      component: battle
    },
    {
      path: '/solo',
      name: 'solo',
      component: solo
    }
  ]
})
