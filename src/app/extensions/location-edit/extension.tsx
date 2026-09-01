import {Extensions} from "attio/client"

import {showLocationEditDialog} from "../../../dialog"

export default Extensions.defineExtension({
  type: "record-action",
  id: "location-edit",
  label: "Edit Location Attribute",
  onTrigger: async (details) => {
    showLocationEditDialog(details)
  },
})
