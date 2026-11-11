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
    <div class="pointer-events-none fixed left-4 bottom-5 right-4 z-50 sm:left-6 sm:bottom-6 sm:right-auto sm:w-96">
      <!-- Screen Reader Live Regions -->
      <div role="status" aria-atomic="true" class="sr-only">
        {{ notification?.type === 'success' ? notification.message : '' }}
      </div>
      <div role="alert" aria-atomic="true" class="sr-only">
        {{ notification?.type === 'error' ? notification.message : '' }}
      </div>

      <!-- Toast Card dengan transisi -->
      <transition
        enter-active-class="transform transition duration-300 ease-out"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:-translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transform transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 translate-y-1 sm:translate-y-0"
      >
        <div
          v-if="notification"
          class="pointer-events-auto flex items-start gap-3.5 rounded-2xl border bg-white p-4 shadow-xl backdrop-blur-md"
          :class="notification.type === 'success' ? 'border-emerald-200/80 shadow-emerald-900/5' : 'border-red-200/80 shadow-red-900/5'"
          @mouseenter="pause"
          @mouseleave="resume"
          @focusin="pause"
          @focusout="resume"
        >
          <!-- Ikon Status (Sukses / Gagal) -->
          <div
            aria-hidden="true"
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
            :class="
              notification.type === 'success'
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-red-100 text-red-600'
            "
          >
            <!-- Check Icon untuk Success -->
            <svg
              v-if="notification.type === 'success'"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <!-- Exclamation Icon untuk Error -->
            <svg
              v-else
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>

          <!-- Teks Pesan -->
          <div class="min-w-0 flex-1 pt-0.5">
            <p class="text-xs font-bold uppercase tracking-wider text-slate-900">
              {{ notification.type === 'success' ? 'Berhasil' : 'Gagal' }}
            </p>
            <p class="mt-1 text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
              {{ notification.message }}
            </p>
          </div>

          <!-- Tombol Tutup (Dismiss) -->
          <button
            type="button"
            aria-label="Tutup notifikasi"
            class="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600"
            @click="emit('dismiss')"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </transition>
    </div>
  </Teleport>
</template>
