<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const draft = ref(props.modelValue)
let timer: ReturnType<typeof setTimeout> | undefined

function publish() {
  clearTimeout(timer)
  const value = draft.value.trim()
  if (value !== props.modelValue) emit('update:modelValue', value)
}

function schedule(event: Event) {
  clearTimeout(timer)
  if ((event as InputEvent).isComposing) return
  timer = setTimeout(publish, 300)
}

function clear() {
  draft.value = ''
  publish()
}

watch(
  () => props.modelValue,
  (value) => {
    clearTimeout(timer)
    draft.value = value
  },
)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <form class="w-full" role="search" @submit.prevent="publish">
    <label class="mb-1.5 block text-xs font-semibold text-slate-600 uppercase tracking-wider" for="asset-search-input">
      Cari Aset
    </label>

    <div
      class="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-3.5 shadow-2xs transition-all duration-150 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100"
    >
      <!-- Icon Search -->
      <svg
        class="h-4 w-4 shrink-0 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35" />
      </svg>

      <!-- Input Field -->
      <input
        class="min-w-0 w-full border-0 bg-transparent py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        id="asset-search-input"
        v-model="draft"
        type="search"
        placeholder="Cari berdasarkan nama aset..."
        autocomplete="off"
        @input="schedule"
        @compositionend="schedule"
      />

      <!-- Clear Button (Muncul saat ada teks) -->
      <button
        class="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-blue-600"
        v-if="draft"
        type="button"
        aria-label="Hapus pencarian"
        @click="clear"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </form>
</template>
