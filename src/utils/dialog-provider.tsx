import {createContext, type ReactNode, useContext} from "react"

const DialogContext = createContext<{
  hideDialog: () => void
}>(null!)

export function DialogProvider({
  children,
  hideDialog,
}: {
  children: ReactNode
  hideDialog: () => void
}) {
  return <DialogContext.Provider value={{hideDialog}}>{children}</DialogContext.Provider>
}

export function useDialog() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider")
  }

  return context
}
