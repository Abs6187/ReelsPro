"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
} from "lucide-react"

const variantIconMap = {
  default: Info,
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  destructive: XCircle,
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant = "default", ...props }) => {
        const Icon = variantIconMap[variant as keyof typeof variantIconMap] || Info

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3 pr-6">
              <div className="pt-1">
                <Icon className="h-5 w-5" />
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
