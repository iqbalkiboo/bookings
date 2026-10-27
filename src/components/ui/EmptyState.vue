<script setup lang="ts">
withDefaults(
  defineProps<{
    message: string
    icon?: string
  }>(),
  { icon: '🤔' },
)
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon animate-float">{{ icon }}</div>
    <p class="empty-message">{{ message }}</p>
    <div class="flex flex-wrap justify-center gap-2">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-radius: 20px;
  border: 2px dashed var(--color-line);
  background: var(--color-surface);
  padding: 3.5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.empty-state::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(227,0,27,0.04) 0%, transparent 70%);
  pointer-events: none;
}
.empty-icon {
  font-size: 3.5rem;
  filter: drop-shadow(0 0 12px rgba(227,0,27,0.3));
}
.empty-message {
  color: var(--color-muted);
  font-size: 0.95rem;
  font-weight: 700;
  max-width: 320px;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}
</style>
