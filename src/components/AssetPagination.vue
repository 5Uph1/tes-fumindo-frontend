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
    class="flex flex-wrap items-center justify-between gap-4 py-[18px] text-[13px] text-slate-500"
  >
    <p role="status">
      Menampilkan <strong class="font-semibold text-slate-700">{{ first }}–{{ last }}</strong> dari
      <strong class="font-semibold text-slate-700">{{ total }}</strong> aset
    </p>
    <nav class="flex flex-wrap gap-1.5" aria-label="Halaman daftar aset">
      <button
        class="min-h-9 min-w-9 cursor-pointer rounded-[7px] border border-slate-200 bg-white px-2.5 py-2 text-slate-600 enabled:hover:border-blue-300 enabled:hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
        type="button"
        :disabled="loading || page <= 1"
        aria-label="Halaman pertama"
        @click="navigate(1)"
      >
        «
      </button>
      <button
        class="min-h-9 min-w-9 cursor-pointer rounded-[7px] border border-slate-200 bg-white px-2.5 py-2 text-slate-600 enabled:hover:border-blue-300 enabled:hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
        type="button"
        :disabled="loading || page <= 1"
        @click="navigate(page - 1)"
      >
        Sebelumnya
      </button>
      <button
        class="min-h-9 min-w-9 cursor-pointer rounded-[7px] border px-2.5 py-2 enabled:hover:border-blue-300 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
        v-for="number in pages"
        :key="number"
        type="button"
        :class="
          number === page
            ? 'border-blue-600 bg-blue-600 text-white enabled:hover:bg-blue-700'
            : 'border-slate-200 bg-white text-slate-600 enabled:hover:bg-blue-50'
        "
        :aria-current="number === page ? 'page' : undefined"
        :aria-label="`Halaman ${number}`"
        :disabled="loading"
        @click="navigate(number)"
      >
        {{ number }}
      </button>
      <button
        class="border-slate-200 bg-white text-slate-600 enabled:hover:bg-blue-50 min-h-9 min-w-9 cursor-pointer rounded-[7px] border px-2.5 py-2 enabled:hover:border-blue-300 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
        type="button"
        :disabled="loading || page >= totalPages || total === 0"
        @click="navigate(page + 1)"
      >
        Berikutnya
      </button>
      <button
        class="border-slate-200 bg-white text-slate-600 enabled:hover:bg-blue-50 min-h-9 min-w-9 cursor-pointer rounded-[7px] border px-2.5 py-2 enabled:hover:border-blue-300 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
        type="button"
        :disabled="loading || page >= totalPages || total === 0"
        aria-label="Halaman terakhir"
        @click="navigate(totalPages)"
      >
        »
      </button>
    </nav>
  </div>
</template>
