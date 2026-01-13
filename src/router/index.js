import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/loginView.vue'
import ProductsView from '../views/productsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
      { path: '/', component: LoginView },
      { path: '/products', component: ProductsView }
  ]
})

export default router