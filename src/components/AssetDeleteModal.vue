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
    class="m-auto max-h-[calc(100dvh-32px)] rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-[0_24px_80px_#0f172a33] backdrop:bg-slate-900/50 w-[min(440px,calc(100%-32px))]"
    aria-labelledby="delete-title"
    aria-describedby="delete-description"
    :aria-busy="deleting"
    @cancel.prevent="cancel"
  >
    <div class="px-6 py-7 text-center">
      <span
        class="mx-auto mb-[18px] grid size-11 place-items-center rounded-full bg-red-50 text-[25px] font-bold text-red-700"
        aria-hidden="true"
        >!</span
      >
      <h2 class="mb-3 text-[21px] font-semibold" id="delete-title">Hapus aset?</h2>
      <p
        class="text-sm leading-[1.7] text-slate-500 [overflow-wrap:anywhere]"
        id="delete-description"
      >
        Aset <strong class="font-semibold text-slate-700">{{ asset.asset_name }}</strong> akan
        dihapus. Tindakan ini tidak dapat dibatalkan.
      </p>
      <p
        v-if="error"
        class="text-sm leading-[1.7] text-slate-500 [overflow-wrap:anywhere] mt-4! text-red-700!"
        role="alert"
      >
        {{ error }}
      </p>
    </div>
    <footer class="flex flex-wrap justify-center gap-2.5 border-t border-slate-200 px-6 py-[18px]">
      <button
        class="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 enabled:hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
        type="button"
        autofocus
        :disabled="deleting"
        @click="cancel"
      >
        Batal
      </button>
      <button
        type="button"
        class="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 enabled:hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2 border-red-700! bg-red-700! text-white!"
        :disabled="deleting"
        @click="confirm"
      >
        {{ deleting ? 'Menghapus...' : 'Hapus aset' }}
      </button>
    </footer>
  </dialog>
</template>
