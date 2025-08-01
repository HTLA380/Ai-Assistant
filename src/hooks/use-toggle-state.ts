import { useCallback, useState } from "react"
import type { Dispatch, SetStateAction } from "react"

function useToggleState(defaultValue?: boolean): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState(!!defaultValue)

  const toggle = useCallback(() => {
    setValue((x) => !x)
  }, [])

  return [value, toggle, setValue]
}

export { useToggleState }
