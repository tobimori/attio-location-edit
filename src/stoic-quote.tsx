import {Column, TextBlock, useAsyncCache} from "attio/client"

import getStoicQuote from "./get-stoic-quote.server"

export function StoicQuote({recordId}: {recordId: string}) {
  // By passing in the recordId, the result will be cached for each recordId
  const {
    values: {quote},
    //       ^^^^^– this key matches
    //             vvvvv– this key
  } = useAsyncCache({quote: [getStoicQuote, recordId]})
  //                         ^^^^^^^^^^^^^  ^^^^^^^^
  //                         async fn       parameter(s)

  return (
    <Column>
      <TextBlock align="center">{quote.text}</TextBlock>
      <TextBlock align="right">– {quote.author}</TextBlock>
    </Column>
  )
}
