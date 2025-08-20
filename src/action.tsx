import type {RecordAction} from "attio/client"
import {showLocationEditDialog} from "./dialog"

export const recordAction: RecordAction = {
  id: "location-edit",
  label: "Edit",
  onTrigger: async (details) => {
    showLocationEditDialog(details)
  },
}
