<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AssetTable from './components/AssetTable.vue'
import AssetSearch from './components/AssetSearch.vue'
import AssetPagination from './components/AssetPagination.vue'
import AssetFormModal from './components/AssetFormModal.vue'
import type { Asset, AssetInput } from './types/asset'

const mode = ref<'data' | 'loading' | 'empty' | 'search'>('data')
const selectedAction = ref('')
const search = ref('')
const page = ref(1)
const limit = 10
const formOpen = ref(false)
const editingAsset = ref<Asset | null>(null)
const examples = ref<Asset[]>([
  { asset_id: 3, asset_name: 'Laptop Operasional', stock_quantity: 5, category: 'Non-Consumable' },
  { asset_id: 2, asset_name: 'Kertas A4', stock_quantity: 0, category: 'Consumable' },
  { asset_id: 1, asset_name: 'Pulpen', stock_quantity: 50, category: 'Consumable' },
  { asset_id: 4, asset_name: 'Printer', stock_quantity: 2, category: 'Non-Consumable' },
  { asset_id: 5, asset_name: 'Monitor', stock_quantity: 6, category: 'Non-Consumable' },
  { asset_id: 6, asset_name: 'Keyboard', stock_quantity: 10, category: 'Non-Consumable' },
  { asset_id: 7, asset_name: 'Mouse', stock_quantity: 10, category: 'Non-Consumable' },
  { asset_id: 8, asset_name: 'Meja Kantor', stock_quantity: 12, category: 'Non-Consumable' },
  { asset_id: 9, asset_name: 'Kursi Kantor', stock_quantity: 12, category: 'Non-Consumable' },
  { asset_id: 10, asset_name: 'Pensil', stock_quantity: 30, category: 'Consumable' },
  { asset_id: 11, asset_name: 'Penghapus', stock_quantity: 20, category: 'Consumable' },
  { asset_id: 12, asset_name: 'Tinta Printer', stock_quantity: 8, category: 'Consumable' },
  { asset_id: 13, asset_name: 'Map Dokumen', stock_quantity: 40, category: 'Consumable' },
  { asset_id: 14, asset_name: 'Sticky Notes', stock_quantity: 15, category: 'Consumable' },
  { asset_id: 15, asset_name: 'Baterai AA', stock_quantity: 0, category: 'Consumable' },
])
const filteredAssets = computed(() => {
  if (mode.value !== 'data') return []
  const keyword = search.value.toLocaleLowerCase('id-ID')
  return examples.value
    .filter((asset) => asset.asset_name.toLocaleLowerCase('id-ID').includes(keyword))
    .sort((a, b) => b.asset_id - a.asset_id)
})
const assets = computed(() =>
  filteredAssets.value.slice((page.value - 1) * limit, page.value * limit),
)
watch([search, mode], () => {
  page.value = 1
})

function openForm(asset: Asset | null = null) {
  editingAsset.value = asset
  formOpen.value = true
}

function saveExample(input: AssetInput) {
  if (editingAsset.value) {
    const index = examples.value.findIndex(
      (asset) => asset.asset_id === editingAsset.value?.asset_id,
    )
    if (index !== -1) examples.value[index] = { asset_id: editingAsset.value.asset_id, ...input }
  } else {
    const id = Math.max(0, ...examples.value.map((asset) => asset.asset_id)) + 1
    examples.value.push({ asset_id: id, ...input })
  }
  selectedAction.value = 'Data contoh berhasil disimpan secara lokal.'
  formOpen.value = false
  // Edit nama dapat membuat aset tidak lagi cocok dengan pencarian aktif.
  page.value = Math.min(page.value, Math.max(1, Math.ceil(filteredAssets.value.length / limit)))
}
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
    <div class="asset-toolbar">
      <AssetSearch v-model="search" />
      <button type="button" class="add-asset" @click="openForm()">+ Tambah aset</button>
    </div>
    <AssetTable
      :assets="assets"
      :page="page"
      :limit="limit"
      :loading="mode === 'loading'"
      :searching="mode === 'search' || search.length > 0"
      @edit="openForm($event)"
      @delete="selectedAction = `Hapus dipilih: ${$event.asset_name}`"
    />
    <AssetPagination
      v-model:page="page"
      :limit="limit"
      :total="filteredAssets.length"
      :loading="mode === 'loading'"
    />
    <p class="action-status" role="status">{{ selectedAction }}</p>
    <AssetFormModal
      v-if="formOpen"
      :asset="editingAsset"
      @cancel="formOpen = false"
      @save="saveExample"
    />
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
.asset-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.asset-toolbar > form {
  flex: 1;
  margin-bottom: 0;
  min-width: min(100%, 260px);
}
.add-asset {
  padding: 12px 18px;
  border: 0;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}
.add-asset:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}
</style>
