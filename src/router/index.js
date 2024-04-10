import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Chat from '../views/ChatView.vue'
import Draw from '../views/DrawView.vue'
import Video from '../views/VideoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    },
    {
      path: '/draw',
      name: 'draw',
      component: Draw
    },
    {
      path: '/video',
      name: 'video',
      component: Video
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
