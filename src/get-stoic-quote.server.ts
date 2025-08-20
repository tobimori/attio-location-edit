import {z} from "zod"

const quoteSchema = z.object({
  text: z.string(),
  author: z.string(),
})
export type Quote = z.infer<typeof quoteSchema>

export default async function getStoicQuote(recordId: string): Promise<Quote> {
  // We don't really need the recordId for this API, but this is how we could use a parameter
  const response = await fetch(`https://stoic-quotes.com/api/quote?${recordId}`)
  const data = await response.json()
  return quoteSchema.parse(data)
}
