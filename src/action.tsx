import type {RecordAction} from "attio/client"
import {showDialog} from "attio/client"

import {LocationEditDialog} from "./dialog"

export const recordAction: RecordAction = {
  id: "location-edit",
  label: "Edit",
  onTrigger: async ({recordId, object}) => {
    showDialog({
      title: "Edit Location Attribute",
      Dialog: () => {
        return <LocationEditDialog recordId={recordId} object={object} />
      },
    })
  },
}
