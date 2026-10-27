import type { Movie } from '@/types/ticketing'

export const seedMovies: Movie[] = [
  {
    id: 1,
    title: 'Agar Awan Berlalu',
    genre: 'Drama',
    rating: '13+',
    duration: 112,
    studio: 'Studio 1',
    poster: '☁️',
    color: '#5b8def',
    showtimes: [
      { id: 'mv1-1', time: '13:00', price: 40_000 },
      { id: 'mv1-2', time: '16:30', price: 40_000 },
      { id: 'mv1-3', time: '20:00', price: 50_000 },
    ],
  },
  {
    id: 2,
    title: 'Petualangan Si Kancil',
    genre: 'Animasi, Keluarga',
    rating: 'SU',
    duration: 96,
    studio: 'Studio 2',
    poster: '🦌',
    color: '#f59e0b',
    showtimes: [
      { id: 'mv2-1', time: '10:30', price: 35_000 },
      { id: 'mv2-2', time: '14:00', price: 35_000 },
    ],
  },
  {
    id: 3,
    title: 'Nebula Rising',
    genre: 'Sci-Fi, Aksi',
    rating: '17+',
    duration: 141,
    studio: 'Studio 3 (IMAX)',
    poster: '🚀',
    color: '#8b5cf6',
    showtimes: [
      { id: 'mv3-1', time: '15:00', price: 75_000 },
      { id: 'mv3-2', time: '18:45', price: 85_000 },
      { id: 'mv3-3', time: '21:30', price: 85_000 },
    ],
  },
  {
    id: 4,
    title: 'Cinta di Ujung Senja',
    genre: 'Romance',
    rating: '13+',
    duration: 104,
    studio: 'Studio 4',
    poster: '🌇',
    color: '#ec4899',
    showtimes: [
      { id: 'mv4-1', time: '12:15', price: 40_000 },
      { id: 'mv4-2', time: '19:00', price: 50_000 },
    ],
  },
]
