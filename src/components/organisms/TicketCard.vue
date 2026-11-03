<script setup lang="ts">
import type { Ticket } from '@/types/ticketing'
import { formatIDR } from '@/utils/format'
import BaseBadge from '@/components/atoms/BaseBadge.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const props = defineProps<{ ticket: Ticket }>()

defineEmits<{ remove: [] }>()

const TYPE_META: Record<Ticket['type'], { label: string; icon: string; tone: 'soft' | 'purple' | 'green'; glow: string }> = {
  movie:           { label: 'Bioskop',         icon: '🎬', tone: 'soft',   glow: 'rgba(227,0,27,0.2)' },
  'concert-war':   { label: 'Konser · War',    icon: '⚡', tone: 'purple', glow: 'rgba(167,139,250,0.2)' },
  'concert-ballot':{ label: 'Konser · Ballot', icon: '🎟️', tone: 'green',  glow: 'rgba(0,201,110,0.2)' },
}

const meta = TYPE_META[props.ticket.type]
</script>

<template>
  <article class="ticket-card" :style="{ '--t-glow': meta.glow }">
    <div class="ticket-left">
      <div class="ticket-icon">{{ meta.icon }}</div>
    </div>

    <!-- dashed separator -->
    <div class="ticket-sep">
      <div class="ticket-notch top"></div>
      <div class="ticket-dashes"></div>
      <div class="ticket-notch bottom"></div>
    </div>

    <div class="ticket-right">
      <div class="ticket-header">
        <BaseBadge :tone="meta.tone">{{ meta.label }}</BaseBadge>
        <BaseButton variant="ghost" size="sm" title="Hapus tiket" @click="$emit('remove')">Hapus</BaseButton>
      </div>
      <h3 class="ticket-title">{{ ticket.title }}</h3>
      <p class="ticket-sub">{{ ticket.subtitle }}</p>
      <p class="ticket-seat">
        {{ ticket.type === 'movie' ? `Kursi: ${ticket.seats.join(', ')}` : 'E-Tiket terkirim ke email' }}
        · Total: <strong style="color:var(--color-heading);">{{ formatIDR(ticket.total) }}</strong>
      </p>
      <div class="ticket-code">
        <span>{{ ticket.code }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss" src="@/assets/styles/organisms/ticket-card.scss"></style>
