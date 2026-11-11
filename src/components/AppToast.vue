<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import type { Notification } from '../types/notification'

const props = defineProps<{ notification: Notification | null }>()
const emit = defineEmits<{ dismiss: [] }>()
let timer: ReturnType<typeof setTimeout> | undefined

function pause() {
  clearTimeout(timer)
}

function resume() {
  pause()
  // Pesan gagal tetap tampil sampai ditutup pengguna.
  if (props.notification?.type === 'success') {
    timer = setTimeout(() => emit('dismiss'), 5000)
  }
}

watch(() => props.notification, resume, { immediate: true })
onBeforeUnmount(pause)
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed right-4 bottom-5 left-4 z-50 sm:right-auto sm:w-96">
      <div role="status" aria-atomic="true" class="sr-only">
        {{ notification?.type === 'success' ? notification.message : '' }}
      </div>
      <div role="alert" aria-atomic="true" class="sr-only">
        {{ notification?.type === 'error' ? notification.message : '' }}
      </div>
      <div
        v-if="notification"
        class="pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg"
        :class="notification.type === 'success' ? 'border-emerald-200' : 'border-red-200'"
        @mouseenter="pause"
        @mouseleave="resume"
        @focusin="pause"
        @focusout="resume"
      >
        <span
          aria-hidden="true"
          class="grid size-7 shrink-0 place-items-center rounded-full font-bold"
          :class="
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          "
          >{{ notification.type === 'success' ? '✓' : '!' }}</span
        >
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-slate-900">
            {{ notification.type === 'success' ? 'Berhasil' : 'Gagal' }}
          </p>
          <p class="mt-1 text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
            {{ notification.message }}
          </p>
        </div>
        <button
          type="button"
          aria-label="Tutup notifikasi"
          class="grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-xl text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
          @click="emit('dismiss')"
        >
          ×
        </button>
      </div>
    </div>
  </Teleport>
</template>
