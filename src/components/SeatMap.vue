<script setup lang="ts">
import { useMovieStore } from '@/stores/movie'
import { formatIDR } from '@/utils/format'

const store = useMovieStore()
</script>

<template>
  <div>
    <!-- Screen indicator -->
    <div class="screen-wrap">
      <div class="screen-label">LAYAR</div>
      <div class="screen-bar"></div>
    </div>

    <div class="seat-grid">
      <div v-for="row in store.seatMap" :key="row.row" class="seat-row">
        <span class="row-label">{{ row.row }}</span>
        <button
          v-for="seat in row.seats"
          :key="seat.id"
          type="button"
          class="seat"
          :class="{
            occupied: seat.occupied,
            selected: store.selectedSeats.includes(seat.id),
          }"
          :disabled="seat.occupied"
          :title="seat.occupied ? 'Sudah terisi' : `Kursi ${seat.id}`"
          @click="store.toggleSeat(seat.id, seat.occupied)"
        >
          {{ seat.id.replace(row.row, '') }}
        </button>
      </div>
    </div>

    <!-- Legend -->
    <div class="seat-legend">
      <span class="legend-item">
        <i class="legend-dot"></i> Tersedia
      </span>
      <span class="legend-item">
        <i class="legend-dot legend-dot--selected"></i> Dipilih
      </span>
      <span class="legend-item">
        <i class="legend-dot legend-dot--occupied"></i> Terisi
      </span>
    </div>

    <!-- Summary -->
    <div v-if="store.selectedSeats.length" class="seat-summary">
      <p>
        <strong style="color:var(--color-heading);">{{ store.selectedSeats.length }}</strong>
        kursi: <span style="color:var(--color-accent);">{{ store.selectedSeats.join(', ') }}</span>
      </p>
      <p class="seat-total">Total: <strong>{{ formatIDR(store.totalPrice) }}</strong></p>
    </div>
  </div>
</template>

<style scoped>
/* ── Screen ── */
.screen-wrap {
  text-align: center;
  margin-bottom: 1.5rem;
}
.screen-label {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.35em;
  color: var(--color-muted);
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}
.screen-bar {
  height: 4px;
  width: 70%;
  margin: 0 auto;
  border-radius: 999px 999px 0 0;
  background: linear-gradient(90deg, transparent, rgba(0,212,255,0.6), var(--color-accent), rgba(0,212,255,0.6), transparent);
  box-shadow: 0 0 14px rgba(0,212,255,0.4);
}

/* ── Grid ── */
.seat-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.seat-row {
  display: flex;
  align-items: center;
  gap: 5px;
}
.row-label {
  width: 20px;
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--color-muted);
  text-align: center;
}

/* ── Seat ── */
.seat {
  width: 32px;
  height: 32px;
  font-size: 0.65rem;
  font-weight: 700;
  cursor: pointer;
  border-radius: 6px 6px 3px 3px;
  transition: all 0.15s ease;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-line);
  color: var(--color-muted);
  position: relative;
}
.seat:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-heading);
  box-shadow: 0 0 8px rgba(227,0,27,0.3);
  transform: translateY(-1px);
}
.seat.selected {
  background: linear-gradient(135deg, #e3001b, #a80014);
  border-color: var(--color-primary);
  color: #fff;
  font-weight: 800;
  box-shadow: 0 0 12px rgba(227,0,27,0.5);
}
.seat.occupied {
  background: var(--color-surface);
  border-color: rgba(44,48,69,0.5);
  color: rgba(122,132,154,0.3);
  cursor: not-allowed;
}

/* ── Legend ── */
.seat-legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.25rem;
  font-size: 0.72rem;
  color: var(--color-muted);
  font-weight: 700;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.legend-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-line);
}
.legend-dot--selected {
  background: linear-gradient(135deg, #e3001b, #a80014);
  border-color: var(--color-primary);
  box-shadow: 0 0 6px rgba(227,0,27,0.4);
}
.legend-dot--occupied {
  background: var(--color-surface);
  border-color: rgba(44,48,69,0.5);
}

/* ── Summary ── */
.seat-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding: 0.85rem 1rem;
  background: var(--color-surface-alt);
  border-radius: 10px;
  border: 1px solid var(--color-line);
  font-size: 0.85rem;
  color: var(--color-muted);
  font-weight: 600;
}
.seat-total {
  font-size: 1rem;
  color: var(--color-heading);
}
.seat-total strong {
  color: var(--color-primary);
  text-shadow: 0 0 8px rgba(227,0,27,0.4);
}
</style>
