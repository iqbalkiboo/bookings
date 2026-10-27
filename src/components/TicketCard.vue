<script setup lang="ts">
import type { Ticket } from '@/types/ticketing'
import { formatIDR } from '@/utils/format'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps<{ ticket: Ticket }>()

defineEmits<{ remove: [] }>()

const TYPE_META: Record<Ticket['type'], { label: string; icon: string; tone: 'soft' | 'purple' | 'green'; glow: string }> = {
  movie:           { label: 'Bioskop',          icon: '🎬', tone: 'soft',   glow: 'rgba(227,0,27,0.2)' },
  'concert-war':   { label: 'Konser · War',      icon: '⚡', tone: 'purple', glow: 'rgba(167,139,250,0.2)' },
  'concert-ballot':{ label: 'Konser · Ballot',   icon: '🎟️', tone: 'green',  glow: 'rgba(0,201,110,0.2)' },
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
        <BaseButton variant="ghost" size="sm" title="Hapus tiket" @click="$emit('remove')">✕</BaseButton>
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

<style scoped>
.ticket-card {
  display: flex;
  border-radius: 16px;
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  overflow: hidden;
  transition: box-shadow 0.25s, transform 0.2s, border-color 0.2s;
  position: relative;
}
.ticket-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 20px var(--t-glow), 0 4px 20px rgba(0,0,0,0.4);
  transform: translateY(-2px);
}

.ticket-left {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-alt);
  padding: 1.25rem 1rem;
  min-width: 64px;
  border-right: 1px dashed var(--color-line);
}
.ticket-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 8px rgba(227,0,27,0.3));
}

.ticket-sep {
  position: relative;
  width: 0;
}
.ticket-notch {
  position: absolute;
  width: 16px;
  height: 16px;
  background: var(--color-canvas);
  border-radius: 50%;
  left: -8px;
  z-index: 1;
}
.ticket-notch.top    { top: -8px; }
.ticket-notch.bottom { bottom: -8px; }

.ticket-right {
  flex: 1;
  padding: 1rem 1rem 1rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.ticket-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ticket-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-heading);
  margin: 0;
}
.ticket-sub {
  font-size: 0.8rem;
  color: var(--color-muted);
  font-weight: 600;
}
.ticket-seat {
  font-size: 0.78rem;
  color: var(--color-muted);
  font-weight: 600;
}
.ticket-code {
  display: inline-flex;
  margin-top: 0.4rem;
}
.ticket-code span {
  background: var(--color-surface-alt);
  border: 1px dashed var(--color-line);
  border-radius: 8px;
  padding: 0.3rem 0.85rem;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px rgba(227,0,27,0.4);
}
</style>
