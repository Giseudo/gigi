import { createRouter, createWebHistory } from 'vue-router'
import Game from '../views/Game.vue'
import Village from '../views/scenes/Village.vue'

const routes = [
  {
    path: '/',
    name: 'Game',
    component: Game,
    children: [
      {
        path: '/',
        name: 'Village',
        component: Village
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
