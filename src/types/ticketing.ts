export interface Showtime {
  id: string
  time: string
  price: number
}

export interface Movie {
  id: number
  title: string
  genre: string
  rating: string
  duration: number
  studio: string
  poster: string
  color: string
  showtimes: Showtime[]
}

export type TicketType = 'movie' | 'concert-war' | 'concert-ballot'

export interface Ticket {
  id: string
  type: TicketType
  title: string
  subtitle: string
  seats: string[]
  total: number
  code: string
  createdAt: number
}

export type WarStatus = 'upcoming' | 'open' | 'soldout'

export interface BallotCategory {
  id: string
  name: string
  price: number
  quota: number
  registered: number
}

export interface BallotRegistration {
  name: string
  email: string
  categoryId: string
  number: string
}
