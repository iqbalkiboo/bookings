import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('@/views/MoviesView.vue'),
    },
    {
      path: '/concerts',
      name: 'concerts',
      component: () => import('@/views/ConcertsView.vue'),
    },
    {
      path: '/concert/:id',
      name: 'concert-detail',
      component: () => import('@/views/ConcertDetailView.vue'),
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('@/views/TicketsView.vue'),
    },
  ],
})

export default router
