import {TextBlock} from "attio/client"
import React from "react"

import {StoicQuote} from "./stoic-quote"

const Loading = () => <TextBlock>Loading stoic quote...</TextBlock>

export function HelloWorldDialog({recordId}: {recordId: string}) {
  // A simple counter to demonstrate that this is just regular React code.
  const [seconds, setSeconds] = React.useState(0)
  React.useEffect(() => {
    const timeout = setTimeout(() => setSeconds(seconds + 1), 1000)
    return () => clearTimeout(timeout)
  }, [seconds])

  return (
    <>
      <TextBlock align="left">
        I am a dialog. I have been open for: {seconds} second{seconds === 1 ? "" : "s"}
      </TextBlock>
      {/* The hook in StoicQuote will suspend until the stoic quote is loaded. */}
      <React.Suspense fallback={<Loading />}>
        <StoicQuote recordId={recordId} />
      </React.Suspense>
    </>
  )
}
