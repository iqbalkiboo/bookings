<script setup lang="ts">
import { useBallotStore } from '@/stores/ballot'
import { formatIDR } from '@/utils/format'
import BaseButton from '@/components/atoms/BaseButton.vue'
import FormField from '@/components/molecules/FormField.vue'

const ballotStore = useBallotStore()
</script>

<template>
  <form class="ballot-form" @submit.prevent="ballotStore.register()">
    <h3 class="ballot-form-title">Formulir Pendaftaran</h3>

    <FormField label="Nama Lengkap">
      <input
        v-model="ballotStore.form.name"
        class="form-control"
        type="text"
        placeholder="Nama sesuai ID"
        required
      />
    </FormField>

    <FormField label="Email">
      <input
        v-model="ballotStore.form.email"
        class="form-control"
        type="email"
        placeholder="nama@email.com"
        required
      />
    </FormField>

    <FormField label="Kategori Tiket">
      <select v-model="ballotStore.form.categoryId" class="form-control">
        <option v-for="cat in ballotStore.categories" :key="cat.id" :value="cat.id">
          {{ cat.name }} — {{ formatIDR(cat.price) }}
        </option>
      </select>
    </FormField>

    <div class="ballot-summary">
      <span>Kategori dipilih</span>
      <strong>{{ ballotStore.selectedCategory?.name }}</strong>
    </div>

    <BaseButton type="submit" block size="lg">Daftar Ballot</BaseButton>
  </form>
</template>

<style scoped lang="scss" src="@/assets/styles/organisms/ballot-form.scss"></style>

