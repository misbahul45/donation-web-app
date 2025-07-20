'use client'
import { useRouter } from 'next/navigation';
import { useActionState } from 'react'

type ActionFormState = { success?: string; error?: string } | null

type UseActionFormProps<T> = {
  action: (values: T) => Promise<ActionFormState>
  extractValues: (formData: FormData) => T
}

export function useActionForm<T>({ action, extractValues }: UseActionFormProps<T>) {
  const router=useRouter()
  const formReducer = async (_: ActionFormState, formData: FormData): Promise<ActionFormState> => {
    const values = extractValues(formData)
    const res=await action(values)
    router.refresh()
    return res;
  }

  const [state, formAction] = useActionState(formReducer, null)

  return {
    state,
    formAction,
  }
}
