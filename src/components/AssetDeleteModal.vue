<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { Asset } from '../types/asset'

const props = withDefaults(
  defineProps<{
    asset: Asset
    deleting?: boolean
    error?: string
  }>(),
  { deleting: false, error: '' },
)
const emit = defineEmits<{ confirm: [asset: Asset]; cancel: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
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
  if (!props.deleting) emit('cancel')
}

function confirm() {
  if (!props.deleting) emit('confirm', props.asset)
}
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto max-h-[calc(100dvh-32px)] w-[min(420px,calc(100%-32px))] rounded-2xl border border-slate-200/80 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-xs"
    aria-labelledby="delete-title"
    aria-describedby="delete-description"
    :aria-busy="deleting"
    @cancel.prevent="cancel"
  >
    <div class="px-6 pt-8 pb-6 text-center">
      <!-- Icon Peringatan -->
      <div
        class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600"
        aria-hidden="true"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9-.75a9 9 0 1 1 18 0 9 9 0 0 1-18 0zm9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>

      <h2 class="text-lg font-bold text-slate-900" id="delete-title">Hapus Aset?</h2>

      <p
        class="mt-2 text-sm leading-relaxed text-slate-500 [overflow-wrap:anywhere]"
        id="delete-description"
      >
        Aset <strong class="font-semibold text-slate-800">{{ asset.asset_name }}</strong> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
      </p>

      <!-- Error Alert -->
      <div
        v-if="error"
        role="alert"
        class="mt-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200 text-left"
      >
        {{ error }}
      </div>
    </div>

    <!-- Footer Actions -->
    <footer class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
      <button
        class="inline-flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-blue-600"
        type="button"
        autofocus
        :disabled="deleting"
        @click="cancel"
      >
        Batal
      </button>
      <button
        type="button"
        class="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        :disabled="deleting"
        @click="confirm"
      >
        <svg v-if="deleting" class="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
      </button>
    </footer>
  </dialog>
</template>
