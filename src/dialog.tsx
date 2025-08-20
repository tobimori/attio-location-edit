import {Divider, Forms, Row, TextBlock, Typography, useForm} from "attio/client"
import fetchRecord, {type RecordData} from "./fn/fetch-record.server"
import {Await} from "./utils/await"
import {COUNTRY_CODES} from "./utils/country-code"

export function LocationEditDialog({recordId, object}: {recordId: string; object: string}) {
  return (
    <Await
      promise={fetchRecord({recordId, object})}
      fallback={<Typography.Body>Loading…</Typography.Body>}
    >
      {(data) =>
        data.attributes.length === 0 ? (
          <TextBlock>This object does not have any location attributes</TextBlock>
        ) : data.attributes.length === 1 ? (
          <EditDialogForm
            attribute={data.attributes[0]}
            values={data.values[data.attributes[0].value]}
          />
        ) : (
          <SelectAttributeForm data={data} />
        )
      }
    </Await>
  )
}

function SelectAttributeForm({data}: {data: RecordData}) {
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

            return <EditDialogForm attribute={attribute} values={vals} />
          }
        }
      </WithState>
    </Form>
  )
}

function EditDialogForm({
  attribute,
  values,
}: {
  attribute: RecordData["attributes"][number]
  values: RecordData["values"][number]
}) {
  const {Form, Combobox, TextInput, SubmitButton} = useForm(
    {
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
    <Form onSubmit={console.log}>
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
