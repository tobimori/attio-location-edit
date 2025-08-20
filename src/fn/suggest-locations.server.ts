import {getWorkspaceConnection} from "attio/server"
import type {GetCurrentUserQuery} from "../graphql/current-user.graphql"
import {MapboxSuggestResponseSchema} from "../utils/mapbox-schemas"

export default async function suggestLocations(
  query: string,
  user: GetCurrentUserQuery["currentUser"]
) {
  const connection = getWorkspaceConnection()
  if (!connection.value) {
    throw new Error("Mapbox API key not configured in workspace connection")
  }

  const params = new URLSearchParams({
    q: query,
    access_token: connection.value,
    session_token: user.id,
    limit: "10",
    types: "address,poi,place,locality,neighborhood,street",
    language: "en",
  })

  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/suggest?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return MapboxSuggestResponseSchema.parse(data)
}
