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
    class="asset-modal"
    aria-labelledby="asset-form-title"
    :aria-busy="saving"
    @cancel.prevent="cancel"
  >
    <form novalidate @submit.prevent="submit">
      <header class="modal-header">
        <div>
          <h2 id="asset-form-title">{{ asset ? 'Edit aset' : 'Tambah aset' }}</h2>
          <p>Lengkapi informasi aset di bawah ini.</p>
        </div>
        <button
          type="button"
          class="close"
          aria-label="Tutup form"
          :disabled="saving"
          @click="cancel"
        >
          ×
        </button>
      </header>
      <div class="fields">
        <div>
          <label for="asset-name">Nama aset</label>
          <input
            id="asset-name"
            v-model="name"
            autofocus
            required
            :disabled="saving"
            :aria-invalid="!!errors.name"
            :aria-describedby="errors.name ? 'name-error' : undefined"
          />
          <p v-if="errors.name" id="name-error" class="field-error">{{ errors.name }}</p>
        </div>
        <div>
          <label for="asset-stock">Jumlah stok</label>
          <input
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
          <p id="stock-help" class="hint">Gunakan 0 jika stok belum tersedia.</p>
          <p id="stock-error" class="field-error">{{ errors.stock }}</p>
        </div>
        <div>
          <label for="asset-category">Kategori</label>
          <select
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
          <p v-if="errors.category" id="category-error" class="field-error">
            {{ errors.category }}
          </p>
        </div>
        <p v-if="error" role="alert" class="field-error">{{ error }}</p>
      </div>
      <footer>
        <button type="button" :disabled="saving" @click="cancel">Batal</button>
        <button type="submit" class="primary" :disabled="saving">
          {{ saving ? 'Menyimpan...' : 'Simpan aset' }}
        </button>
      </footer>
    </form>
  </dialog>
</template>

<style scoped>
.asset-modal {
  width: min(480px, calc(100% - 32px));
  max-height: calc(100dvh - 32px);
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  color: #0f172a;
  box-shadow: 0 24px 80px #0f172a33;
}
.asset-modal::backdrop {
  background: #0f172a80;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}
h2 {
  font-size: 21px;
  margin: 0 0 8px;
}
.modal-header p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}
.fields {
  display: grid;
  gap: 20px;
  padding: 24px;
}
label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
input,
select {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 11px 12px;
  background: white;
  color: #0f172a;
  font: inherit;
  font-size: 14px;
}
[aria-invalid='true'] {
  border-color: #dc2626;
}
.hint,
.field-error {
  font-size: 12px;
  margin: 6px 0 0;
  line-height: 1.5;
}
.hint {
  color: #64748b;
}
.field-error {
  color: #b91c1c;
}
footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 18px 24px;
  border-top: 1px solid #e2e8f0;
}
button {
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
  background: white;
  color: #334155;
  cursor: pointer;
}
button.primary {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}
button.close {
  padding: 0;
  width: 32px;
  height: 32px;
  border: 0;
  font-size: 24px;
}
button:hover:not(:disabled) {
  filter: brightness(0.95);
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
input:focus-visible,
select:focus-visible,
button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}
</style>
