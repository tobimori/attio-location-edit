import {type RecordWidget, Widget} from "attio/client"
import {showLocationEditDialog} from "./dialog"
import fetchRecord from "./fn/fetch-record.server"
import {Await} from "./utils/await"

export const recordWidget: RecordWidget = {
  id: "location-details",
  label: "Location Details",
  color: "#276CF0",
  Widget: (details) => (
    <Await promise={fetchRecord(details)} fallback={<Widget.Loading />}>
      {(data) => {
        const firstAttribute = data.attributes[0]
        const locationData = firstAttribute ? data.values[firstAttribute.value] : null

        if (!firstAttribute || !locationData) {
          return (
            <Widget.TextWidget>
              <Widget.Title>Location</Widget.Title>
              <Widget.Text.Primary>No location data</Widget.Text.Primary>
            </Widget.TextWidget>
          )
        }

        const addressLines = [
          locationData.line_1,
          locationData.line_2,
          locationData.line_3,
          locationData.line_4,
        ]
          .filter(Boolean)
          .join(", ")

        const cityStateCountry = [
          locationData.locality,
          locationData.region,
          locationData.postcode,
          locationData.country_code,
        ]
          .filter(Boolean)
          .join(", ")

        return (
          <Widget.TextWidget
            onTrigger={() => {
              showLocationEditDialog(details)
            }}
          >
            <Widget.Title>{firstAttribute.label}</Widget.Title>
            <Widget.Text.Primary>{addressLines || "No address"}</Widget.Text.Primary>
            {cityStateCountry && <Widget.Text.Secondary>{cityStateCountry}</Widget.Text.Secondary>}
          </Widget.TextWidget>
        )
      }}
    </Await>
  ),
}
