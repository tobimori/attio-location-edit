import {Divider, Forms, Row, showDialog, showToast, TextBlock, useForm, useQuery} from "attio/client"
import {useRef} from "react"
import fetchRecord, {type RecordData} from "./fn/fetch-record.server"
import retrieveLocation from "./fn/retrieve-location.server"
import updateRecord from "./fn/update-record.server"
import getCurrentUser from "./graphql/current-user.graphql"
import {Await} from "./utils/await"
import {COUNTRY_CODES} from "./utils/country-code"
import {DialogProvider, useDialog} from "./utils/dialog-provider"
import {mapboxLocationOptionsProvider} from "./utils/mapbox-options-provider"

export function showLocationEditDialog({recordId, object}: {recordId: string; object: string}) {
  showDialog({
    title: "Edit Location",
    Dialog: ({hideDialog}) => (
      <DialogProvider hideDialog={hideDialog}>
        <LocationEditDialog recordId={recordId} object={object} />
      </DialogProvider>
    ),
  })
}

export function LocationEditDialog({recordId, object}: {recordId: string; object: string}) {
  return (
    <Await promise={fetchRecord({recordId, object})} fallback={<TextBlock>Loading…</TextBlock>}>
      {(data) =>
        data.attributes.length === 0 ? (
          <TextBlock>This object does not have any location attributes</TextBlock>
        ) : data.attributes.length === 1 ? (
          <EditDialogForm
            recordId={recordId}
            object={object}
            attribute={data.attributes[0]}
            values={data.values[data.attributes[0].value]}
          />
        ) : (
          <SelectAttributeForm data={data} recordId={recordId} object={object} />
        )
      }
    </Await>
  )
}

// if we have more than one attribute, this will show a form to select which attribute to edit
function SelectAttributeForm({data, recordId, object}: {data: RecordData; recordId: string; object: string}) {
  const {Form, Combobox, WithState} = useForm(
    {
      attribute: Forms.string(),
    },
    {
      attribute: data.attributes[0].value,
    }
  )

  return (
    <Form onSubmit={() => {}}>
      <Combobox
        name="attribute"
        label="Select Attribute to edit"
        options={data.attributes.map((attr) => ({value: attr.value, label: attr.label}))}
      />

      <Divider />

      <WithState values>
        {
          // type infer doesn't work here for some reason!
          ({values}: {values: {attribute: string}}) => {
            const attribute = data.attributes.find((attr) => attr.value === values.attribute)
            if (!attribute) return <>{/**/}</>
            const vals = data.values[attribute.value]
            if (!vals) return <>{/**/}</>

            return <EditDialogForm recordId={recordId} object={object} attribute={attribute} values={vals} />
          }
        }
      </WithState>
    </Form>
  )
}

function EditDialogForm({
  recordId,
  object,
  attribute,
  values,
}: {
  recordId: string
  object: string
  attribute: RecordData["attributes"][number]
  values: RecordData["values"][number]
}) {
  const {hideDialog} = useDialog()
  const {currentUser} = useQuery(getCurrentUser)
  const lastSearchValue = useRef<string | undefined>(undefined)

  const {Form, Combobox, TextInput, SubmitButton, WithState, change} = useForm(
    {
      search: Forms.string().optional(),
      line_1: Forms.string().optional(),
      line_2: Forms.string().optional(),
      line_3: Forms.string().optional(),
      line_4: Forms.string().optional(),
      locality: Forms.string().optional(),
      region: Forms.string().optional(),
      postcode: Forms.string().optional(),
      country_code: Forms.string().optional(),
      latitude: Forms.string().optional(),
      longitude: Forms.string().optional(),
    },
    {
      search: undefined,
      line_1: values.line_1 ?? undefined,
      line_2: values.line_2 ?? undefined,
      line_3: values.line_3 ?? undefined,
      line_4: values.line_4 ?? undefined,
      locality: values.locality ?? undefined,
      region: values.region ?? undefined,
      postcode: values.postcode ?? undefined,
      country_code: values.country_code ?? undefined,
      latitude: values.latitude ?? undefined,
      longitude: values.longitude ?? undefined,
    }
  )

  return (
    <Form
      onSubmit={async (values) => {
        try {
          await updateRecord({
            recordId,
            object,
            attribute: attribute.value,
            data: {
              line_1: values.line_1 || null,
              line_2: values.line_2 || null,
              line_3: values.line_3 || null,
              line_4: values.line_4 || null,
              locality: values.locality || null,
              region: values.region || null,
              postcode: values.postcode || null,
              country_code: values.country_code || null,
              latitude: values.latitude || null,
              longitude: values.longitude || null,
            },
          })
          
          await showToast({
            title: "Location updated",
            variant: "success",
          })
          
          hideDialog()
        } catch (error) {
          console.error("Failed to update location:", error)
          await showToast({
            title: "Failed to update location",
            variant: "error",
          })
        }
      }}
    >
      <Combobox
        name="search"
        label="Search location"
        placeholder="Start typing an address…"
        options={mapboxLocationOptionsProvider}
      />
      <WithState values>
        {({values}: {values: {search?: string}}) => {
          // only fetch if search value actually changed
          if (values.search && values.search !== lastSearchValue.current) {
            lastSearchValue.current = values.search

            // fetch location details and auto-fill fields
            retrieveLocation(values.search, currentUser)
              .then((response) => {
                const feature = response.features[0]
                if (!feature) return

                const props = feature.properties
                const context = props.context

                // extract address components
                const streetNumber = context.address?.address_number || ""
                const streetName = context.address?.street_name || context.street?.name || ""
                const line1 =
                  props.address ||
                  (streetNumber && streetName ? `${streetNumber} ${streetName}`.trim() : "")

                // update all fields with retrieved data
                change("line_1", line1 || undefined)
                change("line_2", undefined) // clear line 2 as mapbox doesn't provide it
                change("line_3", undefined) // clear line 3
                change("line_4", undefined) // clear line 4
                change("locality", context.place?.name || context.locality?.name || undefined)
                change("region", context.region?.name || undefined)
                change("postcode", context.postcode?.name || undefined)
                change("country_code", context.country?.country_code || undefined)
                change("latitude", props.coordinates.latitude.toString())
                change("longitude", props.coordinates.longitude.toString())
              })
              .catch((error) => {
                console.error("Error retrieving location details:", error)
              })
          }

          return <>{/* */}</>
        }}
      </WithState>

      <Divider />

      <TextInput name="line_1" label="Line 1" />
      <TextInput name="line_2" label="Line 2" />
      <Row>
        <TextInput name="line_3" label="Line 3" />
        <TextInput name="line_4" label="Line 4" />
      </Row>
      <Row>
        <TextInput name="postcode" label="Postcode" />
        <TextInput name="locality" label="City" />
      </Row>
      <Row>
        <TextInput name="region" label="State" />
        <Combobox name="country_code" label="Country" options={COUNTRY_CODES} />
      </Row>
      <Row>
        <TextInput name="latitude" label="Latitude" />
        <TextInput name="longitude" label="Longitude" />
      </Row>
      <SubmitButton label="Save changes" />
    </Form>
  )
}
