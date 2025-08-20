import {type RecordWidget, Widget} from "attio/client"
import {Suspense} from "react"

export const recordWidget: RecordWidget = {
  id: "location-details",
  label: "Location Details",
  Widget: ({recordId}) => (
    <Suspense fallback={<Widget.Loading />}>
      <Widget.TextWidget>
        <Widget.Title>ARR</Widget.Title>
      </Widget.TextWidget>
    </Suspense>
  ),
}
