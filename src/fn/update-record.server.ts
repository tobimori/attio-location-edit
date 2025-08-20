import {attioFetch} from "attio/server"

export default async function updateRecord({
  recordId,
  object,
  attribute,
  data,
}: {
  recordId: string
  object: string
  attribute: string
  data: {
    line_1?: string | null
    line_2?: string | null
    line_3?: string | null
    line_4?: string | null
    locality?: string | null
    region?: string | null
    postcode?: string | null
    country_code?: string | null
    latitude?: string | null
    longitude?: string | null
  }
}) {
  // prepare location data - all fields must be specified even if null
  const locationData = {
    line_1: data.line_1 ?? null,
    line_2: data.line_2 ?? null,
    line_3: data.line_3 ?? null,
    line_4: data.line_4 ?? null,
    locality: data.locality ?? null,
    region: data.region ?? null,
    postcode: data.postcode ?? null,
    country_code: data.country_code ?? null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
  }

  const response = await attioFetch({
    method: "PATCH",
    path: `/objects/${object}/records/${recordId}`,
    body: {
      data: {
        values: {
          [attribute]: locationData,
        },
      },
    },
  })

  return response
}
