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

<style scoped lang="scss" src="@/assets/styles/organisms/seat-map.scss"></style>
