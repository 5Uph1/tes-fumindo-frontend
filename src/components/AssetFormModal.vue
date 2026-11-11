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
    class="m-auto max-h-[calc(100dvh-32px)] rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-[0_24px_80px_#0f172a33] backdrop:bg-slate-900/50 w-[min(480px,calc(100%-32px))]"
    aria-labelledby="asset-form-title"
    :aria-busy="saving"
    @cancel.prevent="cancel"
  >
    <form novalidate @submit.prevent="submit">
      <header
        class="flex justify-between gap-4 border-b border-slate-200 p-6 [&_p]:text-sm [&_p]:text-slate-500"
      >
        <div>
          <h2 class="mb-2 text-[21px] font-semibold" id="asset-form-title">
            {{ asset ? 'Edit aset' : 'Tambah aset' }}
          </h2>
          <p>Lengkapi informasi aset di bawah ini.</p>
        </div>
        <button
          type="button"
          class="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 enabled:hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2 size-8 border-0! bg-transparent! p-0! text-2xl!"
          aria-label="Tutup form"
          :disabled="saving"
          @click="cancel"
        >
          ×
        </button>
      </header>
      <div class="grid gap-5 p-6">
        <div>
          <label class="mb-2 block text-sm font-semibold" for="asset-name">Nama aset</label>
          <input
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-[11px] text-sm text-slate-900 aria-invalid:border-red-600 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
            id="asset-name"
            v-model="name"
            autofocus
            required
            :disabled="saving"
            :aria-invalid="!!errors.name"
            :aria-describedby="errors.name ? 'name-error' : undefined"
          />
          <p v-if="errors.name" id="name-error" class="mt-1.5 text-xs leading-normal text-red-700">
            {{ errors.name }}
          </p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold" for="asset-stock">Jumlah stok</label>
          <input
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-[11px] text-sm text-slate-900 aria-invalid:border-red-600 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
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
          <p id="stock-help" class="mt-1.5 text-xs leading-normal text-slate-500">
            Gunakan 0 jika stok belum tersedia.
          </p>
          <p id="stock-error" class="mt-1.5 text-xs leading-normal text-red-700">
            {{ errors.stock }}
          </p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold" for="asset-category">Kategori</label>
          <select
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-[11px] text-sm text-slate-900 aria-invalid:border-red-600 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
            id="asset-category"
            v-model="category"
            required
            :disabled="saving"
            :aria-invalid="!!errors.category"
            :aria-describedby="errors.category ? 'category-error' : undefined"
          >
            <option value="" disabled>Pilih kategori</option>
            <option value="Consumable">Consumable</option>
            <option value="Non-Consumable">Non-Consumable</option>
          </select>
          <p
            v-if="errors.category"
            id="category-error"
            class="mt-1.5 text-xs leading-normal text-red-700"
          >
            {{ errors.category }}
          </p>
        </div>
        <p v-if="error" role="alert" class="mt-1.5 text-xs leading-normal text-red-700">
          {{ error }}
        </p>
      </div>
      <footer class="flex justify-end gap-2.5 border-t border-slate-200 px-6 py-[18px]">
        <button
          class="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 enabled:hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
          type="button"
          :disabled="saving"
          @click="cancel"
        >
          Batal
        </button>
        <button
          type="submit"
          class="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 enabled:hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2 border-blue-600! bg-blue-600! text-white!"
          :disabled="saving"
        >
          {{ saving ? 'Menyimpan...' : 'Simpan aset' }}
        </button>
      </footer>
    </form>
  </dialog>
</template>
