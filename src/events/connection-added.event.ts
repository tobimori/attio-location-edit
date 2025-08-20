import type {Connection} from "attio/server"

export default async function connectionAdded({connection}: {connection: Connection}) {
  if (!connection.value) {
    throw new Error("No API key provided in connection")
  }

  const params = new URLSearchParams({
    q: "test",
    access_token: connection.value,
    session_token: "test",
    limit: "1",
    language: "en",
  })

  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/suggest?${params.toString()}`
  )

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid Mapbox API key - authentication failed")
    }

    throw new Error(`Failed to validate Mapbox API key: ${response.status} ${response.statusText}`)
  }

  return
}
