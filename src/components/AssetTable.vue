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
  <section class="asset-table" aria-label="Daftar aset" :aria-busy="loading">
    <p v-if="loading" class="sr-only" role="status">Memuat daftar aset...</p>
    <div class="table-scroll">
      <table>
        <caption class="sr-only">
          Data aset dan tindakan pengelolaannya
        </caption>
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Asset Name</th>
            <th scope="col" class="stock">Stock Quantity</th>
            <th scope="col">Category</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody v-if="loading" aria-hidden="true">
          <tr v-for="row in 5" :key="row">
            <td v-for="column in 5" :key="column"><span class="skeleton" /></td>
          </tr>
        </tbody>
        <tbody v-else-if="assets.length">
          <tr v-for="(asset, index) in assets" :key="asset.asset_id">
            <td class="row-number">{{ (page - 1) * limit + index + 1 }}</td>
            <td class="asset-name">{{ asset.asset_name }}</td>
            <td class="stock">{{ asset.stock_quantity.toLocaleString('id-ID') }}</td>
            <td>
              <span class="badge" :class="{ durable: asset.category === 'Non-Consumable' }">
                {{ asset.category }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button
                  type="button"
                  :aria-label="`Edit ${asset.asset_name}`"
                  @click="$emit('edit', asset)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="delete"
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
            <td colspan="5" class="empty">
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

<style scoped>
.asset-table {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
}
.table-scroll {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}
th {
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
th,
td {
  padding: 18px 22px;
}
tbody tr + tr {
  border-top: 1px solid #f1f5f9;
}
tbody tr:hover {
  background: #fafcff;
}
.stock {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.row-number {
  color: #64748b;
}
.asset-name {
  font-weight: 600;
  min-width: 160px;
  overflow-wrap: anywhere;
}
.badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 6px;
  background: #ecfdf5;
  color: #047857;
  font-size: 12px;
  white-space: nowrap;
}
.badge.durable {
  background: #eef2ff;
  color: #4338ca;
}
.actions {
  display: flex;
  gap: 8px;
}
button {
  border: 1px solid #dbe3ee;
  border-radius: 6px;
  padding: 7px 12px;
  background: white;
  color: #334155;
  cursor: pointer;
  font: inherit;
}
button:hover {
  background: #eff6ff;
  border-color: #93c5fd;
}
button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 3px;
}
button.delete {
  color: #b91c1c;
}
button.delete:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}
.empty {
  text-align: center;
  padding: 64px 24px;
  color: #475569;
}
.empty strong {
  font-size: 16px;
}
.empty p {
  color: #64748b;
  margin: 10px 0 0;
}
.skeleton {
  display: block;
  min-width: 32px;
  height: 20px;
  border-radius: 5px;
  background: #e2e8f0;
  animation: pulse 1.4s ease-in-out infinite;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
@keyframes pulse {
  50% {
    opacity: 0.4;
  }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}
</style>
