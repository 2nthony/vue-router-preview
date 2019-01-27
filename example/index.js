import Vue from 'vue'
import Router from 'vue-router'
import RouterPreview from '../lib'
import '../lib/preview.css'

Vue.use(Router)
Vue.use(RouterPreview)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('./views')
    },
    {
      path: '/foo',
      name: 'Foo',
      component: () => import('./views/foo')
    },
    {
      path: '/foo/hero',
      component: {
        render(h) {
          return h('div', 'foo-hero')
        }
      }
    },
    {
      path: '*',
      component: () => import('./views/404')
    }
  ]
})

new Vue({
  el: '#app',
  router,
  render: h => h('router-view')
})
