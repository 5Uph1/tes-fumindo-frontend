import type { Asset, AssetInput, AssetList } from '../types/asset'

const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(
  /\/$/,
  '',
)

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    const timeout = AbortSignal.timeout(15000)
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      signal: options.signal ? AbortSignal.any([options.signal, timeout]) : timeout,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
    })
  } catch (error) {
    if (options.signal?.aborted) throw error
    throw new Error('Tidak dapat menghubungi server. Periksa koneksi dan coba lagi.')
  }

  if (!response.ok) {
    let message =
      response.status >= 500
        ? 'Server mengalami gangguan. Silakan coba lagi.'
        : `Permintaan gagal (${response.status}).`
    if (response.status < 500) {
      const body: unknown = await response.json().catch(() => null)
      if (body && typeof body === 'object' && 'message' in body) {
        if (typeof body.message === 'string') message = body.message
        else if (Array.isArray(body.message))
          message = body.message.filter((item) => typeof item === 'string').join(', ') || message
      }
    }
    throw new Error(message)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const assetsApi = {
  list(search: string, page: number, limit: number, signal?: AbortSignal) {
    const query = new URLSearchParams({ search, page: String(page), limit: String(limit) })
    return request<AssetList>(`/assets?${query}`, { signal })
  },
  detail(id: number) {
    return request<Asset>(`/assets/${id}`)
  },
  create(input: AssetInput) {
    return request<Asset>('/assets', { method: 'POST', body: JSON.stringify(input) })
  },
  update(id: number, input: Partial<AssetInput>) {
    return request<Asset>(`/assets/${id}`, { method: 'PATCH', body: JSON.stringify(input) })
  },
  remove(id: number) {
    return request<void>(`/assets/${id}`, { method: 'DELETE' })
  },
}
