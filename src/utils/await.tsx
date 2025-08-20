import {type ReactNode, Suspense, use} from "react"

function Suspender<T>({
  promise,
  children,
}: {
  promise: Promise<T>
  children: (data: T) => ReactNode
}) {
  // React will suspend here until the promise resolves or rejects.
  const result = use(promise) as T
  return children(result)
}

/**
 * Wraps a promise in Suspense with render props.
 *
 * Usage:
 * <Await promise={fetchData()} fallback={<Loading />}>
 *   {(data) => <div>{data.message}</div>}
 * </Await>
 */
export function Await<T>({
  promise,
  children,
  fallback,
}: {
  promise: Promise<T>
  children: (data: T) => ReactNode
  fallback: ReactNode
}) {
  if (
    typeof promise !== "object" ||
    promise === null ||
    typeof (promise as {then?: unknown}).then !== "function"
  ) {
    throw new Error("Await expects a promise as 'promise' prop.")
  }

  return (
    <Suspense fallback={fallback}>
      <Suspender promise={promise}>{children}</Suspender>
    </Suspense>
  )
}
