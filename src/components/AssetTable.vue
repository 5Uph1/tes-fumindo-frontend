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
    class="overflow-hidden rounded-[14px] border border-slate-200 bg-white"
    aria-label="Daftar aset"
    :aria-busy="loading"
  >
    <p v-if="loading" class="sr-only" role="status">Memuat daftar aset...</p>
    <div class="overflow-x-auto">
      <table
        class="w-full border-collapse text-left text-sm [&_th]:bg-slate-50 [&_th]:text-xs [&_th]:font-semibold [&_th]:whitespace-nowrap [&_th]:text-slate-500 [&_th]:px-[22px] [&_th]:py-[18px] [&_td]:px-[22px] [&_td]:py-[18px] [&_tbody_tr+tr]:border-t [&_tbody_tr+tr]:border-slate-100 [&_tbody_tr:hover]:bg-slate-50/50"
      >
        <caption class="sr-only">
          Data aset dan tindakan pengelolaannya
        </caption>
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Asset Name</th>
            <th scope="col" class="text-right tabular-nums">Stock Quantity</th>
            <th scope="col">Category</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody v-if="loading" aria-hidden="true">
          <tr v-for="row in 5" :key="row">
            <td v-for="column in 5" :key="column">
              <span
                class="block h-5 min-w-8 animate-pulse rounded-[5px] bg-slate-200 motion-reduce:animate-none"
              />
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="assets.length">
          <tr v-for="(asset, index) in assets" :key="asset.asset_id">
            <td class="text-slate-500">{{ (page - 1) * limit + index + 1 }}</td>
            <td class="min-w-40 font-semibold [overflow-wrap:anywhere]">{{ asset.asset_name }}</td>
            <td class="text-right tabular-nums">
              {{ asset.stock_quantity.toLocaleString('id-ID') }}
            </td>
            <td>
              <span
                class="inline-block rounded-md px-2.5 py-[5px] text-xs whitespace-nowrap"
                :class="
                  asset.category === 'Non-Consumable'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-emerald-50 text-emerald-700'
                "
              >
                {{ asset.category }}
              </span>
            </td>
            <td>
              <div class="flex gap-2">
                <button
                  class="cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-[7px] text-slate-700 hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
                  type="button"
                  :aria-label="`Edit ${asset.asset_name}`"
                  @click="$emit('edit', asset)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-[7px] text-red-700 hover:border-red-300 hover:bg-red-50 focus-visible:outline-3 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
                  :aria-label="`Hapus ${asset.asset_name}`"
                  @click="$emit('delete', asset)"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td
              colspan="5"
              class="px-6! py-16! text-center text-slate-600 [&_strong]:text-base [&_p]:mt-2.5 [&_p]:text-slate-500"
            >
              <strong>{{ searching ? 'Aset tidak ditemukan' : 'Belum ada aset' }}</strong>
              <p>
                {{
                  searching
                    ? 'Coba gunakan kata pencarian lain.'
                    : 'Aset yang ditambahkan akan tampil di sini.'
                }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
