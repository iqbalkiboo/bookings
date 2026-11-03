<script setup lang="ts">
import type { BallotCategory } from '@/types/ticketing'
import { formatIDR } from '@/utils/format'

defineProps<{
  categories: BallotCategory[]
  selectedId: string
  locked: boolean
}>()

defineEmits<{ pick: [id: string] }>()

function fill(cat: BallotCategory): number {
  return Math.min(100, Math.round((cat.registered / cat.quota) * 100))
}
</script>

<template>
  <div class="tiers">
    <button
      v-for="cat in categories"
      :key="cat.id"
      type="button"
      class="tier"
      :class="{ 'tier--on': selectedId === cat.id, 'tier--locked': locked }"
      @click="$emit('pick', cat.id)"
    >
      <span class="tier-main">
        <strong class="tier-name">{{ cat.name }}</strong>
        <span class="tier-count">{{ cat.registered }}/{{ cat.quota }} pendaftar</span>
        <span class="tier-meter">
          <i :style="{ width: fill(cat) + '%' }" :class="{ 'tier-hot': fill(cat) >= 80 }"></i>
        </span>
      </span>
      <span class="tier-side">
        <strong class="tier-price">{{ formatIDR(cat.price) }}</strong>
        <span class="tier-pct" :class="{ 'tier-pct--hot': fill(cat) >= 80 }">{{ fill(cat) }}%</span>
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss" src="@/assets/styles/organisms/ballot-tier-list.scss"></style>

