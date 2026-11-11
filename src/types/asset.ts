export interface Asset {
  asset_id: number
  asset_name: string
  stock_quantity: number
  category: 'Consumable' | 'Non-Consumable'
}

export type AssetInput = Omit<Asset, 'asset_id'>

export interface AssetList {
  data: Asset[]
  page: number
  limit: number
  total: number
  totalPages: number
}
