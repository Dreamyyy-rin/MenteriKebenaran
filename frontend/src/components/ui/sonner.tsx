import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      richColors
      position="bottom-left"
      toastOptions={{
        duration: 4000,
      }}
      {...props}
    />
  )
}

export { Toaster }
