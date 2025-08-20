import {getWorkspaceConnection} from "attio/server"
import type {GetCurrentUserQuery} from "../graphql/current-user.graphql"
import {MapboxRetrieveResponseSchema} from "../utils/mapbox-schemas"

export default async function retrieveLocation(
  mapboxId: string,
  user: GetCurrentUserQuery["currentUser"]
) {
  const connection = getWorkspaceConnection()
  if (!connection.value) {
    throw new Error("Mapbox API key not configured in workspace connection")
  }

  // build query parameters
  const params = new URLSearchParams({
    access_token: connection.value,
    session_token: user.id,
    language: "en",
  })

  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return MapboxRetrieveResponseSchema.parse(data)
}
