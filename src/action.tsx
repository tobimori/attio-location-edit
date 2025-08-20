import type {RecordAction} from "attio/client"
import {showDialog} from "attio/client"
import {LocationEditDialog} from "./dialog"
import {DialogProvider} from "./utils/dialog-provider"

export const recordAction: RecordAction = {
  id: "location-edit",
  label: "Edit",
  onTrigger: async ({recordId, object}) => {
    showDialog({
      title: "Edit Location Attribute",
      Dialog: ({hideDialog}) => (
        <DialogProvider hideDialog={hideDialog}>
          <LocationEditDialog recordId={recordId} object={object} />
        </DialogProvider>
      ),
    })
  },
}
