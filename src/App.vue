<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AssetTable from './components/AssetTable.vue'
import AssetSearch from './components/AssetSearch.vue'
import AssetPagination from './components/AssetPagination.vue'
import AssetFormModal from './components/AssetFormModal.vue'
import AssetDeleteModal from './components/AssetDeleteModal.vue'
import AppToast from './components/AppToast.vue'
import type { Asset, AssetInput } from './types/asset'
import type { Notification } from './types/notification'

const mode = ref<'data' | 'loading' | 'empty' | 'search'>('data')
const notification = ref<Notification | null>(null)
let notificationId = 0

function notify(type: Notification['type'], message: string) {
  notification.value = { id: ++notificationId, type, message }
}
const search = ref('')
const page = ref(1)
const limit = 10
const formOpen = ref(false)
const editingAsset = ref<Asset | null>(null)
const deletingAsset = ref<Asset | null>(null)
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
  notify(
    'success',
    editingAsset.value
      ? 'Data contoh aset berhasil diperbarui.'
      : 'Data contoh aset berhasil ditambahkan.',
  )
  formOpen.value = false
  // Edit nama dapat membuat aset tidak lagi cocok dengan pencarian aktif.
  page.value = Math.min(page.value, Math.max(1, Math.ceil(filteredAssets.value.length / limit)))
}

function deleteExample(asset: Asset) {
  examples.value = examples.value.filter((item) => item.asset_id !== asset.asset_id)
  deletingAsset.value = null
  notify('success', `Data contoh ${asset.asset_name} berhasil dihapus.`)
  page.value = Math.min(page.value, Math.max(1, Math.ceil(filteredAssets.value.length / limit)))
}
</script>

<template>
  <main class="mx-auto max-w-[1160px] px-6 py-16">
    <header>
      <p class="text-[11px] font-bold tracking-[2px] text-blue-600">FUMINDO / INVENTORY</p>
      <h1 class="my-3 text-[clamp(26px,4vw,34px)] font-bold tracking-[-1px]">Pengelolaan Aset</h1>
      <p class="leading-relaxed text-slate-500">
        Daftar aset operasional dan persediaan perusahaan.
      </p>
    </header>
    <div
      class="mt-8 mb-[18px] flex flex-wrap items-center gap-3 text-[13px] text-slate-600 [&_select]:rounded-md [&_select]:border [&_select]:border-slate-300 [&_select]:bg-white [&_select]:p-2 [&_select]:text-slate-700 [&_span]:text-slate-500"
    >
      <label for="preview-mode">Pratinjau tabel</label>
      <select id="preview-mode" v-model="mode">
        <option value="data">Data contoh</option>
        <option value="loading">Loading</option>
        <option value="empty">Data kosong</option>
        <option value="search">Pencarian kosong</option>
      </select>
      <span>Data contoh lokal, belum terhubung ke API.</span>
      <button
        type="button"
        class="cursor-pointer rounded-md border border-red-200 bg-white px-3 py-2 text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-blue-600"
        @click="
          notify('error', 'Ini contoh notifikasi gagal. Tidak ada permintaan API yang dikirim.')
        "
      >
        Coba toast gagal
      </button>
    </div>
    <div
      class="mb-[18px] flex flex-wrap items-end justify-between gap-4 [&>form]:mb-0 [&>form]:min-w-[min(100%,260px)] [&>form]:flex-1"
    >
      <AssetSearch v-model="search" />
      <button
        type="button"
        class="cursor-pointer rounded-lg border-0 bg-blue-600 px-[18px] py-3 text-sm text-white focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
        @click="openForm()"
      >
        + Tambah aset
      </button>
    </div>
    <AssetTable
      :assets="assets"
      :page="page"
      :limit="limit"
      :loading="mode === 'loading'"
      :searching="mode === 'search' || search.length > 0"
      @edit="openForm($event)"
      @delete="deletingAsset = $event"
    />
    <AssetPagination
      v-model:page="page"
      :limit="limit"
      :total="filteredAssets.length"
      :loading="mode === 'loading'"
    />
    <AppToast :notification="notification" @dismiss="notification = null" />
    <AssetFormModal
      v-if="formOpen"
      :asset="editingAsset"
      @cancel="formOpen = false"
      @save="saveExample"
    />
    <AssetDeleteModal
      v-if="deletingAsset"
      :asset="deletingAsset"
      @cancel="deletingAsset = null"
      @confirm="deleteExample"
    />
  </main>
</template>
