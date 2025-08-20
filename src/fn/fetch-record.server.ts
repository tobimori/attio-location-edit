import {attioFetch} from "attio/server"
import {z} from "zod"

const AttributesSchema = z.object({
  data: z.array(
    z.object({
      title: z.string(),
      api_slug: z.string(),
      type: z.string(),
      is_writable: z.boolean(),
      is_archived: z.boolean(),
    })
  ),
})

const LocationValueSchema = z.object({
  line_1: z.string().nullable(),
  line_2: z.string().nullable(),
  line_3: z.string().nullable(),
  line_4: z.string().nullable(),
  locality: z.string().nullable(),
  region: z.string().nullable(),
  postcode: z.string().nullable(),
  country_code: z.string().nullable(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  attribute_type: z.literal("location"),
})

type LocationValue = z.infer<typeof LocationValueSchema>

export default async function fetchRecord({object, recordId}: {object: string; recordId: string}) {
  const [attributesResponse, recordResponse] = await Promise.all([
    attioFetch({
      method: "GET",
      path: `/objects/${object}/attributes`,
      queryParams: {
        limit: 500,
      },
    }),
    attioFetch({
      method: "GET",
      path: `/objects/${object}/records/${recordId}`,
    }),
  ])

  // filter for location attributes that are writable and not archived
  const allAttributes = AttributesSchema.parse(attributesResponse).data
  const attributes = allAttributes
    .filter((attr) => attr.type === "location" && attr.is_writable && !attr.is_archived)
    .map((attr) => ({
      value: attr.api_slug,
      label: attr.title,
    }))

  // extract location values (single-select, so index 0)
  const values: Record<string, LocationValue> = {}
  for (const attr of attributes) {
    const value = (recordResponse.data as any).values?.[attr.value]?.[0]
    if (value) {
      values[attr.value] = LocationValueSchema.parse(value)
    }
  }

  return {
    attributes,
    values,
  }
}

export type RecordData = Awaited<ReturnType<typeof fetchRecord>>
