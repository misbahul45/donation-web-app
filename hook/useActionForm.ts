'use client'
import { useState, useActionState } from 'react'

type ActionFormState = { success?: string; error?: string } | null

type UseActionFormProps<T> = {
  action: (values: T) => Promise<ActionFormState>
  extractValues: (formData: FormData) => T
}

export function useActionForm<T>({ action, extractValues }: UseActionFormProps<T>) {
  const [isLoading, setIsLoading] = useState(false)

  const formReducer = async (_: ActionFormState, formData: FormData): Promise<ActionFormState> => {
    setIsLoading(true)
    try {
      const values = extractValues(formData)
      const result = await action(values)
      return result
    } finally {
      setIsLoading(false)
    }
  }

  const [state, formAction] = useActionState(formReducer, null)

  return {
    state,
    formAction,
    isLoading,
  }
}
