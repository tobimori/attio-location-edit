import {z} from "zod"

// context layer schemas
const ContextLayerSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
})

const CountryContextSchema = ContextLayerSchema.extend({
  country_code: z.string().optional(),
  country_code_alpha_3: z.string().optional(),
})

const RegionContextSchema = ContextLayerSchema.extend({
  region_code: z.string().optional(),
  region_code_full: z.string().optional(),
})

const AddressContextSchema = ContextLayerSchema.extend({
  address_number: z.string().optional(),
  street_name: z.string().optional(),
})

// suggestion schema for /suggest endpoint
export const MapboxSuggestionSchema = z.object({
  name: z.string(),
  name_preferred: z.string().optional(),
  mapbox_id: z.string(),
  feature_type: z.string(),
  address: z.string().optional(),
  full_address: z.string().optional(),
  place_formatted: z.string(),
  context: z.object({
    country: CountryContextSchema.optional(),
    region: RegionContextSchema.optional(),
    postcode: ContextLayerSchema.optional(),
    district: ContextLayerSchema.optional(),
    place: ContextLayerSchema.optional(),
    locality: ContextLayerSchema.optional(),
    neighborhood: ContextLayerSchema.optional(),
    address: AddressContextSchema.optional(),
    street: ContextLayerSchema.optional(),
  }),
  language: z.string(),
  maki: z.string().optional(),
  poi_category: z.array(z.string()).optional(),
  poi_category_ids: z.array(z.string()).optional(),
  brand: z.array(z.string()).optional(),
  brand_id: z.array(z.string()).optional(),
  external_ids: z.record(z.string(), z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  distance: z.number().optional(),
  eta: z.number().optional(),
  added_distance: z.number().optional(),
  added_time: z.number().optional(),
})

export const MapboxSuggestResponseSchema = z.object({
  suggestions: z.array(MapboxSuggestionSchema),
  attribution: z.string(),
})

// feature schema for /retrieve endpoint
export const MapboxFeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: z.object({
    coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
    type: z.literal("Point"),
  }),
  properties: z.object({
    name: z.string(),
    name_preferred: z.string().optional(),
    mapbox_id: z.string(),
    feature_type: z.string(),
    address: z.string().optional(),
    full_address: z.string().optional(),
    place_formatted: z.string().optional(),
    context: z.object({
      country: CountryContextSchema.optional(),
      region: RegionContextSchema.optional(),
      postcode: ContextLayerSchema.optional(),
      district: ContextLayerSchema.optional(),
      place: ContextLayerSchema.optional(),
      locality: ContextLayerSchema.optional(),
      neighborhood: ContextLayerSchema.optional(),
      address: AddressContextSchema.optional(),
      street: ContextLayerSchema.optional(),
    }),
    coordinates: z.object({
      longitude: z.number(),
      latitude: z.number(),
      accuracy: z.string().optional(),
      routable_points: z
        .array(
          z.object({
            name: z.string(),
            latitude: z.number(),
            longitude: z.number(),
            note: z.string().optional(),
          })
        )
        .optional(),
    }),
    bbox: z.array(z.number()).optional(),
    language: z.string().optional(),
    maki: z.string().optional(),
    poi_category: z.array(z.string()).optional(),
    poi_category_ids: z.array(z.string()).optional(),
    brand: z.array(z.string()).optional(),
    brand_id: z.array(z.string()).optional(),
    external_ids: z.record(z.string(), z.string()).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
})

export const MapboxRetrieveResponseSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(MapboxFeatureSchema),
  attribution: z.string(),
})
