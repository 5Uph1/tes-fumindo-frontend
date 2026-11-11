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
  <form class="mt-6 mb-[18px] max-w-[420px]" role="search" @submit.prevent="publish">
    <label class="mb-2 block text-[13px] font-semibold text-slate-600" for="asset-search-input"
      >Cari aset</label
    >
    <div
      class="flex items-center gap-2.5 rounded-[9px] border border-slate-300 bg-white px-3 focus-within:border-blue-600 focus-within:ring-3 focus-within:ring-blue-100"
    >
      <svg
        class="size-5 shrink-0 text-slate-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        aria-hidden="true"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
      <input
        class="min-w-0 w-full border-0 bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 [&::-webkit-search-cancel-button]:appearance-none"
        id="asset-search-input"
        v-model="draft"
        type="search"
        placeholder="Cari berdasarkan nama aset..."
        autocomplete="off"
        @input="schedule"
        @compositionend="schedule"
      />
      <button
        class="size-8 shrink-0 cursor-pointer rounded-[5px] border-0 bg-transparent text-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
        v-if="draft"
        type="button"
        aria-label="Hapus pencarian"
        @click="clear"
      >
        ×
      </button>
    </div>
  </form>
</template>
