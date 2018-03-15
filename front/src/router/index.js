import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Workspace from '@/components/Workspace'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Workspace',
      component: Workspace
    }
  ]
})
