import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Battle from '@/components/Battle'
import Challenge from '@/components/Challenge'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/Battle',
      name: 'Battle',
      component: Battle
    },
    {
      path: '/Challenge',
      name: 'Challenge',
      component: Challenge
    }
  ]
})
