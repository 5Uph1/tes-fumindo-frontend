<script setup lang="ts">
import { computed, ref } from 'vue'
import AssetTable from './components/AssetTable.vue'
import type { Asset } from './types/asset'

const mode = ref<'data' | 'loading' | 'empty' | 'search'>('data')
const selectedAction = ref('')
const examples: Asset[] = [
  { asset_id: 3, asset_name: 'Laptop Operasional', stock_quantity: 5, category: 'Non-Consumable' },
  { asset_id: 2, asset_name: 'Kertas A4', stock_quantity: 0, category: 'Consumable' },
  { asset_id: 1, asset_name: 'Pulpen', stock_quantity: 50, category: 'Consumable' },
]
const assets = computed(() => (mode.value === 'data' ? examples : []))
</script>

<template>
  <main>
    <header>
      <p class="eyebrow">FUMINDO / INVENTORY</p>
      <h1>Pengelolaan Aset</h1>
      <p class="subtitle">Daftar aset operasional dan persediaan perusahaan.</p>
    </header>
    <div class="preview">
      <label for="preview-mode">Pratinjau tabel</label>
      <select id="preview-mode" v-model="mode">
        <option value="data">Data contoh</option>
        <option value="loading">Loading</option>
        <option value="empty">Data kosong</option>
        <option value="search">Pencarian kosong</option>
      </select>
      <span>Data contoh lokal, belum terhubung ke API.</span>
    </div>
    <AssetTable
      :assets="assets"
      :loading="mode === 'loading'"
      :searching="mode === 'search'"
      @edit="selectedAction = `Edit dipilih: ${$event.asset_name}`"
      @delete="selectedAction = `Hapus dipilih: ${$event.asset_name}`"
    />
    <p class="action-status" role="status">{{ selectedAction }}</p>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #f5f7fb;
  color: #0f172a;
  font-family: Inter, 'Segoe UI', sans-serif;
}
main {
  max-width: 1160px;
  margin: 0 auto;
  padding: 64px 24px;
}
.eyebrow {
  color: #2563eb;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 2px;
}
h1 {
  margin: 12px 0;
  font-size: clamp(26px, 4vw, 34px);
  letter-spacing: -1px;
}
.subtitle {
  color: #64748b;
  line-height: 1.6;
}
.preview {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin: 32px 0 18px;
  font-size: 13px;
  color: #475569;
}
.preview select {
  padding: 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: white;
  color: #334155;
  font: inherit;
}
.preview span {
  color: #64748b;
}
.action-status {
  min-height: 24px;
  color: #475569;
  font-size: 14px;
}
</style>
