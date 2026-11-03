import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
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
]

