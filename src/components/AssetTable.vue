<script setup lang="ts">
import type { Asset } from '../types/asset'

withDefaults(
  defineProps<{
    assets: Asset[]
    loading?: boolean
    page?: number
    limit?: number
    searching?: boolean
  }>(),
  {
    loading: false,
    page: 1,
    limit: 10,
    searching: false,
  },
)

defineEmits<{
  edit: [asset: Asset]
  delete: [asset: Asset]
}>()
</script>

<template>
  <section
    class="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs"
    aria-label="Daftar aset"
    :aria-busy="loading"
  >
    <p v-if="loading" class="sr-only" role="status">Memuat daftar aset...</p>

    <div class="overflow-x-auto">
      <table
        class="w-full border-collapse text-left text-sm [&_th]:bg-slate-50/80 [&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-wider [&_th]:uppercase [&_th]:whitespace-nowrap [&_th]:text-slate-500 [&_th]:px-6 [&_th]:py-4 [&_td]:px-6 [&_td]:py-4 [&_tbody_tr+tr]:border-t [&_tbody_tr+tr]:border-slate-100 [&_tbody_tr:hover]:bg-slate-50/60 transition-colors"
      >
        <caption class="sr-only">
          Data aset dan tindakan pengelolaannya
        </caption>

        <thead>
          <tr>
            <th scope="col" class="w-16">No</th>
            <th scope="col">Nama Aset</th>
            <th scope="col" class="text-right tabular-nums">Jumlah Stok</th>
            <th scope="col">Kategori</th>
            <th scope="col" class="text-right">Aksi</th>
          </tr>
        </thead>

        <!-- Loading Skeleton -->
        <tbody v-if="loading" aria-hidden="true">
          <tr v-for="row in 5" :key="row">
            <td><div class="h-4 w-6 animate-pulse rounded bg-slate-200"></div></td>
            <td><div class="h-4 w-40 animate-pulse rounded bg-slate-200"></div></td>
            <td><div class="h-4 w-16 ml-auto animate-pulse rounded bg-slate-200"></div></td>
            <td><div class="h-5 w-24 animate-pulse rounded-md bg-slate-200"></div></td>
            <td>
              <div class="flex justify-end gap-2">
                <div class="h-8 w-14 animate-pulse rounded-md bg-slate-200"></div>
                <div class="h-8 w-14 animate-pulse rounded-md bg-slate-200"></div>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Data Rows -->
        <tbody v-else-if="assets.length">
          <tr v-for="(asset, index) in assets" :key="asset.asset_id">
            <td class="font-medium text-slate-400">
              {{ (page - 1) * limit + index + 1 }}
            </td>
            <td class="font-medium text-slate-900 [overflow-wrap:anywhere]">
              {{ asset.asset_name }}
            </td>
            <td class="text-right font-medium text-slate-700 tabular-nums">
              {{ asset.stock_quantity.toLocaleString('id-ID') }}
            </td>
            <td>
              <span
                class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap border"
                :class="
                  asset.category === 'Non-Consumable'
                    ? 'bg-indigo-50/50 text-indigo-700 border-indigo-100'
                    : 'bg-emerald-50/50 text-emerald-700 border-emerald-100'
                "
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="asset.category === 'Non-Consumable' ? 'bg-indigo-500' : 'bg-emerald-500'"></span>
                {{ asset.category }}
              </span>
            </td>
            <td>
              <div class="flex items-center justify-end gap-2">
                <!-- Tombol Edit dengan latar warna soft blue -->
                <button
                  class="inline-flex items-center justify-center cursor-pointer rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600"
                  type="button"
                  :aria-label="`Edit ${asset.asset_name}`"
                  @click="$emit('edit', asset)"
                >
                  Edit
                </button>
                <!-- Tombol Hapus dengan latar warna soft red -->
                <button
                  type="button"
                  class="inline-flex items-center justify-center cursor-pointer rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-red-600"
                  :aria-label="`Hapus ${asset.asset_name}`"
                  @click="$emit('delete', asset)"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Empty State -->
        <tbody v-else>
          <tr>
            <td colspan="5" class="py-12 text-center">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <strong class="text-sm font-semibold text-slate-900">
                {{ searching ? 'Aset tidak ditemukan' : 'Belum ada aset' }}
              </strong>
              <p class="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                {{
                  searching
                    ? 'Coba gunakan kata kunci pencarian yang berbeda.'
                    : 'Aset perusahaan yang ditambahkan akan tampil di sini.'
                }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
