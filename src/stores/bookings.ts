import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Ticket } from '@/types/ticketing'

const STORAGE_KEY = 'tix-bookings'

function load(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Ticket[]
  } catch {
    // abaikan data korup
  }
  return []
}

/** Pusat semua tiket yang dimiliki user (bioskop + konser) */
export const useBookingsStore = defineStore('bookings', () => {
  const tickets = ref<Ticket[]>(load())

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets.value))
  }

  function addTicket(ticket: Omit<Ticket, 'id' | 'createdAt'>): Ticket {
    const full: Ticket = {
      ...ticket,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    tickets.value.unshift(full)
    persist()
    return full
  }

  function removeTicket(id: string) {
    tickets.value = tickets.value.filter((t) => t.id !== id)
    persist()
  }

  return { tickets, addTicket, removeTicket }
})
