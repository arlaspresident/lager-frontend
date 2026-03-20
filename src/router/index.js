import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/loginView.vue'
import ProductsView from '../views/productsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LoginView },
    { path: '/products', component: ProductsView, meta: { requiresAuth: true } }
  ]
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/')
  } else {
    next()
  }
})

export default router
