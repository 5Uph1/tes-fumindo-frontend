<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import AssetTable from './components/AssetTable.vue'
import AssetSearch from './components/AssetSearch.vue'
import AssetPagination from './components/AssetPagination.vue'
import AssetFormModal from './components/AssetFormModal.vue'
import AssetDeleteModal from './components/AssetDeleteModal.vue'
import AppToast from './components/AppToast.vue'
import { assetsApi } from './services/assets'
import type { Asset, AssetInput } from './types/asset'
import type { Notification } from './types/notification'

const notification = ref<Notification | null>(null)
let notificationId = 0
function notify(type: Notification['type'], message: string) {
  notification.value = { id: ++notificationId, type, message }
}

const search = ref('')
const page = ref(1)
const limit = 10
const assets = ref<Asset[]>([])
const total = ref(0)
const loading = ref(false)
const listError = ref('')
const formOpen = ref(false)
const editingAsset = ref<Asset | null>(null)
const deletingAsset = ref<Asset | null>(null)
const saving = ref(false)
const deleting = ref(false)
const detailLoading = ref(false)
const formError = ref('')
const deleteError = ref('')
let listController: AbortController | undefined
let disposed = false

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.'
}

async function loadAssets() {
  listController?.abort()
  const controller = new AbortController()
  listController = controller
  loading.value = true
  listError.value = ''
  try {
    const result = await assetsApi.list(search.value, page.value, limit, controller.signal)
    if (controller.signal.aborted) return
    const lastPage = Math.max(1, result.totalPages)
    if (page.value > lastPage) {
      page.value = lastPage
      return
    }
    assets.value = result.data
    total.value = result.total
  } catch (error) {
    if (controller.signal.aborted) return
    assets.value = []
    total.value = 0
    listError.value = errorMessage(error)
  } finally {
    if (listController === controller) loading.value = false
  }
}

watch(
  search,
  () => {
    page.value = 1
  },
  { flush: 'sync' },
)
watch(
  [search, page],
  () => {
    void loadAssets()
  },
  { immediate: true },
)
onBeforeUnmount(() => {
  disposed = true
  listController?.abort()
})

async function openForm(asset: Asset | null = null) {
  if (saving.value || deleting.value || detailLoading.value) return
  formError.value = ''
  if (!asset) {
    editingAsset.value = null
    formOpen.value = true
    return
  }
  detailLoading.value = true
  try {
    const detail = await assetsApi.detail(asset.asset_id)
    if (disposed) return
    editingAsset.value = detail
    formOpen.value = true
  } catch (error) {
    notify('error', errorMessage(error))
  } finally {
    detailLoading.value = false
  }
}

async function saveAsset(input: AssetInput) {
  if (saving.value) return
  saving.value = true
  formError.value = ''
  const editingId = editingAsset.value?.asset_id
  try {
    if (editingId !== undefined) await assetsApi.update(editingId, input)
    else await assetsApi.create(input)
    formOpen.value = false
    notify(
      'success',
      editingId !== undefined ? 'Aset berhasil diperbarui.' : 'Aset berhasil ditambahkan.',
    )
    await loadAssets()
  } catch (error) {
    formError.value = errorMessage(error)
    notify('error', formError.value)
  } finally {
    saving.value = false
  }
}

function confirmDelete(asset: Asset) {
  if (saving.value || deleting.value || detailLoading.value) return
  deleteError.value = ''
  deletingAsset.value = asset
}

async function deleteAsset(asset: Asset) {
  if (deleting.value) return
  deleting.value = true
  deleteError.value = ''
  try {
    await assetsApi.remove(asset.asset_id)
    deletingAsset.value = null
    notify('success', `Aset ${asset.asset_name} berhasil dihapus.`)
    await loadAssets()
  } catch (error) {
    deleteError.value = errorMessage(error)
    notify('error', deleteError.value)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-[1160px] px-4 py-8 sm:px-6 sm:py-12">
    <!-- Header Section -->
    <header class="mb-8">
      <div class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wider text-blue-600 uppercase border border-blue-100">
        <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
        FUMiNDO / INVENTORY
      </div>
      <h1 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Pengelolaan Aset
      </h1>
      <p class="mt-2 text-base text-slate-600 max-w-2xl">
        Daftar aset operasional dan persediaan perusahaan.
      </p>
    </header>

    <!-- Toolbar: Search & Main Action -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between [&>form]:w-full [&>form]:max-w-md">
      <AssetSearch v-model="search" />

      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        :disabled="detailLoading || saving || deleting"
        @click="openForm()"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Aset
      </button>
    </div>

    <!-- Status Loading State -->
    <div v-if="detailLoading" role="status" class="mb-4 inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 animate-pulse">
      <svg class="h-4 w-4 animate-spin text-slate-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      Memuat detail aset...
    </div>

    <!-- Error State -->
    <section
      v-if="listError"
      role="alert"
      class="my-6 rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center backdrop-blur-sm"
    >
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 class="mt-3 text-base font-semibold text-red-900">Gagal memuat daftar aset</h2>
      <p class="mt-1 text-sm text-red-600 max-w-md mx-auto">{{ listError }}</p>
      <button
        type="button"
        class="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-blue-600"
        @click="loadAssets"
      >
        Coba lagi
      </button>
    </section>

    <!-- Main Content Table & Pagination -->
    <template v-else>
      <AssetTable
        :assets="assets"
        :page="page"
        :limit="limit"
        :loading="loading"
        :searching="search.length > 0"
        @edit="openForm($event)"
        @delete="confirmDelete"
      />
      <AssetPagination
        v-model:page="page"
        :limit="limit"
        :total="total"
        :loading="loading"
      />
    </template>

    <!-- Modals & Overlay Components -->
    <AppToast :notification="notification" @dismiss="notification = null" />

    <AssetFormModal
      v-if="formOpen"
      :asset="editingAsset"
      :saving="saving"
      :error="formError"
      @cancel="!saving && (formOpen = false)"
      @save="saveAsset"
    />

    <AssetDeleteModal
      v-if="deletingAsset"
      :asset="deletingAsset"
      :deleting="deleting"
      :error="deleteError"
      @cancel="!deleting && (deletingAsset = null)"
      @confirm="deleteAsset"
    />
  </main>
</template>
