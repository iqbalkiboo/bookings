<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getConcertById } from '@/data/concerts'
import { useTicketWarStore } from '@/stores/ticketwar'
import { useBallotStore } from '@/stores/ballot'
import BaseButton from '@/components/atoms/BaseButton.vue'
import SegmentedTabs from '@/components/molecules/SegmentedTabs.vue'
import ConcertHero from '@/components/organisms/ConcertHero.vue'
import WarPanel from '@/components/organisms/WarPanel.vue'
import BallotPanel from '@/components/organisms/BallotPanel.vue'

type Tab = 'war' | 'ballot'

const route = useRoute()
const warStore = useTicketWarStore()
const ballotStore = useBallotStore()

const concert = computed(() => getConcertById(route.params.id as string))

watch(
  concert,
  (value) => {
    if (value) {
      warStore.setEvent(value)
      ballotStore.setEvent(value)
    }
  },
  { immediate: true },
)

const showWar = computed(() => concert.value?.saleMode !== 'ballot')
const showBallot = computed(() => concert.value?.saleMode !== 'war')

const activeTab = ref<Tab>('war')
watch(
  showWar,
  (war) => {
    activeTab.value = war ? 'war' : 'ballot'
  },
  { immediate: true },
)

const tabs = [
  { value: 'war' as const, label: 'Ticket War', hint: 'first come, first served' },
  { value: 'ballot' as const, label: 'Ballot', hint: 'undian adil' },
]
</script>

<template>
  <template v-if="concert">
    <ConcertHero
      :concert="concert"
      :show-war="showWar"
      :show-ballot="showBallot"
      :online-users="warStore.onlineUsers"
      :stock="warStore.stock"
    />

    <SegmentedTabs v-if="showWar && showBallot" v-model="activeTab" :tabs="tabs" />

    <WarPanel
      v-if="activeTab === 'war' && showWar"
      :concert="concert"
      :show-ballot="showBallot"
      @go-ballot="activeTab = 'ballot'"
    />

    <BallotPanel v-if="activeTab === 'ballot' && showBallot" :concert="concert" />
  </template>

  <div v-else class="not-found">
    <p class="not-found-text">Konser tidak ditemukan.</p>
    <BaseButton to="/concerts">Kembali ke Daftar Konser</BaseButton>
  </div>
</template>

<style scoped lang="scss" src="@/assets/styles/pages/concert-detail.scss"></style>
