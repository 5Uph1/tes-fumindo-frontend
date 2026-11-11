<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    page: number
    limit: number
    total: number
    loading?: boolean
  }>(),
  { loading: false },
)
const emit = defineEmits<{ 'update:page': [page: number] }>()
const totalPages = computed(() => Math.ceil(props.total / props.limit))
const first = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.limit + 1))
const last = computed(() => Math.min(props.page * props.limit, props.total))
const pages = computed(() => {
  const start = Math.max(1, Math.min(props.page - 2, totalPages.value - 4))
  return Array.from({ length: Math.min(5, totalPages.value) }, (_, index) => start + index)
})

function navigate(page: number) {
  if (!props.loading && page >= 1 && page <= totalPages.value && page !== props.page) {
    emit('update:page', page)
  }
}
</script>

<template>
  <div
    class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4 text-xs text-slate-500"
  >
    <p role="status">
      Menampilkan <strong class="font-semibold text-slate-800">{{ first }}–{{ last }}</strong> dari
      <strong class="font-semibold text-slate-800">{{ total }}</strong> aset
    </p>

    <nav class="flex items-center gap-1.5" aria-label="Halaman daftar aset">
      <!-- First Page Button -->
      <button
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-600 transition-colors enabled:hover:border-blue-300 enabled:hover:bg-blue-50/50 enabled:hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer"
        type="button"
        :disabled="loading || page <= 1"
        aria-label="Halaman pertama"
        @click="navigate(1)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
        </svg>
      </button>

      <!-- Previous Page Button -->
      <button
        class="inline-flex h-9 px-3 items-center justify-center rounded-lg border border-slate-200/80 bg-white font-medium text-slate-600 transition-colors enabled:hover:border-blue-300 enabled:hover:bg-blue-50/50 enabled:hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer"
        type="button"
        :disabled="loading || page <= 1"
        @click="navigate(page - 1)"
      >
        Sebelumnya
      </button>

      <!-- Page Numbers -->
      <button
        v-for="number in pages"
        :key="number"
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer"
        :class="
          number === page
            ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
            : 'border-slate-200/80 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600'
        "
        :aria-current="number === page ? 'page' : undefined"
        :aria-label="`Halaman ${number}`"
        :disabled="loading"
        @click="navigate(number)"
      >
        {{ number }}
      </button>

      <!-- Next Page Button -->
      <button
        type="button"
        class="inline-flex h-9 px-3 items-center justify-center rounded-lg border border-slate-200/80 bg-white font-medium text-slate-600 transition-colors enabled:hover:border-blue-300 enabled:hover:bg-blue-50/50 enabled:hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer"
        :disabled="loading || page >= totalPages || total === 0"
        @click="navigate(page + 1)"
      >
        Berikutnya
      </button>

      <!-- Last Page Button -->
      <button
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-600 transition-colors enabled:hover:border-blue-300 enabled:hover:bg-blue-50/50 enabled:hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer"
        type="button"
        :disabled="loading || page >= totalPages || total === 0"
        aria-label="Halaman terakhir"
        @click="navigate(totalPages)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </nav>
  </div>
</template>
