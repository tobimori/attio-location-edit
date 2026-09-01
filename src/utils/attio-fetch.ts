import {ATTIO_API_TOKEN} from "attio/server"

type AttioFetchOptions = {
  body?: unknown
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  queryParams?: Record<string, string | number | boolean>
}

export async function attioFetch<T = unknown>({
  body,
  method,
  path,
  queryParams,
}: AttioFetchOptions): Promise<T> {
  const url = new URL(`https://api.attio.com/v2${path}`)

  for (const [key, value] of Object.entries(queryParams ?? {})) {
    url.searchParams.set(key, String(value))
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${ATTIO_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Attio API request failed: ${response.status} ${response.statusText}`)
  }

  return (response.status === 204 ? undefined : await response.json()) as T
}
