/**
 * Centralized toast utility for YowPainter.
 * Wraps `sonner` to provide consistent, styled notifications.
 * 
 * Usage:
 *   import { toast } from '@/lib/toast'
 *   toast.success('Profil mis à jour !')
 *   toast.error(err, 'Mise à jour du profil')
 */
import { toast as sonnerToast } from 'sonner'
import { getApiErrorMessage } from './api-error-handler'

export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 4000,
    })
  },

  error: (err: unknown, context?: string) => {
    const message = getApiErrorMessage(err)
    sonnerToast.error(context ? `${context} échoué` : 'Une erreur est survenue', {
      description: message,
      duration: 6000,
    })
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 4000,
    })
  },

  loading: (message: string) => {
    return sonnerToast.loading(message)
  },

  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id)
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: (err) => getApiErrorMessage(err) || messages.error,
    })
  },
}
