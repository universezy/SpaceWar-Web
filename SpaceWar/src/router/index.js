import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import battle from '@/components/battle'
import challenge from '@/components/challenge'

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
      path: '/challenge',
      name: 'challenge',
      component: challenge
    }
  ]
})
