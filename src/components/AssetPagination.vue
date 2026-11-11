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
  <div class="pagination">
    <p role="status">
      Menampilkan <strong>{{ first }}–{{ last }}</strong> dari <strong>{{ total }}</strong> aset
    </p>
    <nav aria-label="Halaman daftar aset">
      <button
        type="button"
        :disabled="loading || page <= 1"
        aria-label="Halaman pertama"
        @click="navigate(1)"
      >
        «
      </button>
      <button type="button" :disabled="loading || page <= 1" @click="navigate(page - 1)">
        Sebelumnya
      </button>
      <button
        v-for="number in pages"
        :key="number"
        type="button"
        :class="{ active: number === page }"
        :aria-current="number === page ? 'page' : undefined"
        :aria-label="`Halaman ${number}`"
        :disabled="loading"
        @click="navigate(number)"
      >
        {{ number }}
      </button>
      <button
        type="button"
        :disabled="loading || page >= totalPages || total === 0"
        @click="navigate(page + 1)"
      >
        Berikutnya
      </button>
      <button
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

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 18px 0;
  color: #64748b;
  font-size: 13px;
}
p {
  margin: 0;
}
strong {
  color: #334155;
  font-weight: 600;
}
nav {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
button {
  min-width: 36px;
  min-height: 36px;
  padding: 8px 10px;
  border: 1px solid #dbe3ee;
  border-radius: 7px;
  background: white;
  color: #475569;
  font: inherit;
  cursor: pointer;
}
button:hover:not(:disabled) {
  border-color: #93c5fd;
  background: #eff6ff;
}
button.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}
button.active:hover:not(:disabled) {
  background: #1d4ed8;
}
button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}
</style>
