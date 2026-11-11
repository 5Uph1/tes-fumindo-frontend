<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import type { Asset, AssetInput } from '../types/asset'

const props = withDefaults(
  defineProps<{
    asset?: Asset | null
    saving?: boolean
    error?: string
  }>(),
  { asset: null, saving: false, error: '' },
)
const emit = defineEmits<{ save: [input: AssetInput]; cancel: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const name = ref(props.asset?.asset_name ?? '')
const stock = ref<string | number>(props.asset?.stock_quantity ?? 0)
const category = ref<string>(props.asset?.category ?? '')
const errors = reactive({ name: '', stock: '', category: '' })
let previousFocus: HTMLElement | null = null

onMounted(() => {
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  dialog.value?.showModal()
})
onBeforeUnmount(() => {
  dialog.value?.close()
  previousFocus?.focus()
})

function cancel() {
  if (!props.saving) emit('cancel')
}

function submit() {
  if (props.saving) return
  const quantity = typeof stock.value === 'number' ? stock.value : Number(stock.value)
  errors.name = name.value.trim() ? '' : 'Nama aset wajib diisi.'
  errors.stock =
    String(stock.value).trim() !== '' &&
    Number.isInteger(quantity) &&
    quantity >= 0 &&
    quantity <= 2147483647
      ? ''
      : 'Stok harus bilangan bulat antara 0 dan 2147483647.'
  errors.category =
    category.value === 'Consumable' || category.value === 'Non-Consumable'
      ? ''
      : 'Pilih kategori aset.'
  if (errors.name || errors.stock || errors.category) return

  emit('save', {
    asset_name: name.value.trim(),
    stock_quantity: quantity,
    category: category.value as AssetInput['category'],
  })
}
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto max-h-[calc(100dvh-32px)] w-[min(480px,calc(100%-32px))] rounded-2xl border border-slate-200/80 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-xs"
    aria-labelledby="asset-form-title"
    :aria-busy="saving"
    @cancel.prevent="cancel"
  >
    <form novalidate @submit.prevent="submit">
      <!-- Header -->
      <header class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
        <div>
          <h2 class="text-lg font-bold text-slate-900" id="asset-form-title">
            {{ asset ? 'Edit Aset' : 'Tambah Aset Baru' }}
          </h2>
          <p class="mt-0.5 text-xs text-slate-500">Lengkapi informasi detail aset di bawah ini.</p>
        </div>
        <button
          type="button"
          class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-blue-600"
          aria-label="Tutup form"
          :disabled="saving"
          @click="cancel"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <!-- Body Form Fields -->
      <div class="grid gap-5 px-6 py-5">
        <!-- Nama Aset -->
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600" for="asset-name">
            Nama Aset
          </label>
          <input
            class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition-all aria-invalid:border-red-600 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:opacity-60"
            id="asset-name"
            v-model="name"
            placeholder="Contoh: Komputer"
            autofocus
            required
            :disabled="saving"
            :aria-invalid="!!errors.name"
            :aria-describedby="errors.name ? 'name-error' : undefined"
          />
          <p v-if="errors.name" id="name-error" class="mt-1.5 text-xs font-medium text-red-600">
            {{ errors.name }}
          </p>
        </div>

        <!-- Jumlah Stok -->
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600" for="asset-stock">
            Jumlah Stok
          </label>
          <input
            class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition-all aria-invalid:border-red-600 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:opacity-60"
            id="asset-stock"
            v-model="stock"
            type="number"
            min="0"
            max="2147483647"
            step="1"
            required
            :disabled="saving"
            :aria-invalid="!!errors.stock"
            aria-describedby="stock-help stock-error"
          />
          <p id="stock-help" class="mt-1.5 text-xs text-slate-400">
            Gunakan angka 0 jika stok belum tersedia.
          </p>
          <p v-if="errors.stock" id="stock-error" class="mt-1.5 text-xs font-medium text-red-600">
            {{ errors.stock }}
          </p>
        </div>

        <!-- Kategori -->
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600" for="asset-category">
            Kategori
          </label>
          <select
            class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition-all aria-invalid:border-red-600 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:opacity-60"
            id="asset-category"
            v-model="category"
            required
            :disabled="saving"
            :aria-invalid="!!errors.category"
            :aria-describedby="errors.category ? 'category-error' : undefined"
          >
            <option value="" disabled>Pilih kategori aset</option>
            <option value="Consumable">Consumable</option>
            <option value="Non-Consumable">Non-Consumable</option>
          </select>
          <p v-if="errors.category" id="category-error" class="mt-1.5 text-xs font-medium text-red-600">
            {{ errors.category }}
          </p>
        </div>

        <!-- Global Error Alert -->
        <div v-if="error" role="alert" class="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
          {{ error }}
        </div>
      </div>

      <!-- Footer Actions -->
      <footer class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
        <button
          class="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-blue-600"
          type="button"
          :disabled="saving"
          @click="cancel"
        >
          Batal
        </button>
        <button
          type="submit"
          class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          :disabled="saving"
        >
          <svg v-if="saving" class="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ saving ? 'Menyimpan...' : 'Simpan Aset' }}
        </button>
      </footer>
    </form>
  </dialog>
</template>
