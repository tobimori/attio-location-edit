import type {RecordAction} from "attio/client"
import {showDialog} from "attio/client"

import {HelloWorldDialog} from "./dialog"

export const recordAction: RecordAction = {
  id: "location-edit",
  label: "Edit",
  onTrigger: async ({recordId}) => {
    showDialog({
      title: "Edit Location Attribute",
      Dialog: () => {
        // This is a React component. It can use hooks and render other components.
        return <HelloWorldDialog recordId={recordId} />
      },
    })
  },
}
