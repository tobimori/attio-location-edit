import {type PlainComboboxOptionsProvider, runQuery} from "attio/client"
import retrieveLocation from "../fn/retrieve-location.server"
import suggestLocations from "../fn/suggest-locations.server"
import getCurrentUser from "../graphql/current-user.graphql"

export const mapboxLocationOptionsProvider: PlainComboboxOptionsProvider = {
  search: async (query: string) => {
    if (!query || query.length < 2) {
      return []
    }

    try {
      const {currentUser} = await runQuery(getCurrentUser)
      const response = await suggestLocations(query, currentUser)

      return response.suggestions.map((suggestion) => ({
        value: suggestion.mapbox_id,
        label: suggestion.name,
        description: suggestion.full_address || suggestion.place_formatted,
      }))
    } catch (error) {
      console.error("Error searching locations:", error)
      return []
    }
  },

  getOption: async (mapboxId: string) => {
    try {
      const {currentUser} = await runQuery(getCurrentUser)
      const response = await retrieveLocation(mapboxId, currentUser)

      const feature = response.features[0]
      if (!feature) {
        return undefined
      }

      return {
        label: feature.properties.name,
        description: feature.properties.full_address || feature.properties.place_formatted,
      }
    } catch (error) {
      console.error("Error retrieving location:", error)
      return undefined
    }
  },
}
