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
  <form class="asset-search" role="search" @submit.prevent="publish">
    <label for="asset-search-input">Cari aset</label>
    <div class="search-field">
      <svg
        class="search-icon"
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
        id="asset-search-input"
        v-model="draft"
        type="search"
        placeholder="Cari berdasarkan nama aset..."
        autocomplete="off"
        @input="schedule"
        @compositionend="schedule"
      />
      <button v-if="draft" type="button" aria-label="Hapus pencarian" @click="clear">×</button>
    </div>
  </form>
</template>

<style scoped>
.asset-search {
  max-width: 420px;
  margin: 24px 0 18px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}
.search-field {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  padding: 0 12px;
}
.search-field:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px #dbeafe;
}
.search-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #64748b;
}
input {
  width: 100%;
  min-width: 0;
  padding: 12px 0;
  border: 0;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: 14px;
  color: #0f172a;
}
input::placeholder {
  color: #64748b;
}
input::-webkit-search-cancel-button {
  appearance: none;
}
button {
  border: 0;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 24px;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 5px;
}
button:hover {
  background: #f1f5f9;
  color: #0f172a;
}
button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
</style>
