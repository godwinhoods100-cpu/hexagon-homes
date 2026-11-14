import { useCallback, useEffect, useState } from "react"
import { api } from "../api"
import type { User } from "../context/AuthContext"

const PENDING = -1 // a save that the server has not confirmed yet

/**
 * Saved homes, stored on the user's account (not in the browser).
 * `ids` is the list of saved property ids; `toggle` saves or un-saves one.
 */
export function useFavourites(user: User | null) {
  // property id -> id of the favourite row on the server
  const [byProperty, setByProperty] = useState<Record<number, number>>({})
  const [error, setError] = useState<string | null>(null)

  // Load the saved homes whenever someone logs in; clear them on logout.
  useEffect(() => {
    if (!user) {
      setByProperty({})
      return
    }
    let cancelled = false
    ;(async () => {
      const map: Record<number, number> = {}
      let page = 1
      for (;;) {
        const res = await api.favourites(page)
        res.results.forEach((f) => (map[f.property] = f.id))
        if (!res.next) break
        page++
      }
      if (!cancelled) setByProperty(map)
    })().catch(() => {
      if (!cancelled) setError("We couldn't load your saved homes.")
    })
    return () => {
      cancelled = true
    }
  }, [user?.id])

  // Error messages disappear on their own.
  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(null), 4000)
    return () => clearTimeout(timer)
  }, [error])

  const toggle = useCallback(
    async (propertyId: number) => {
      const existing = byProperty[propertyId]
      if (existing === PENDING) return // wait for the server to answer first
      setError(null)
      if (existing !== undefined) {
        // un-save: update the heart straight away, undo if the server says no
        setByProperty(({ [propertyId]: _removed, ...rest }) => rest)
        try {
          await api.removeFavourite(existing)
        } catch {
          setByProperty((c) => ({ ...c, [propertyId]: existing }))
          setError("We couldn't remove that home. Please try again.")
        }
      } else {
        setByProperty((c) => ({ ...c, [propertyId]: PENDING }))
        try {
          const saved = await api.addFavourite(propertyId)
          setByProperty((c) => ({ ...c, [propertyId]: saved.id }))
        } catch {
          setByProperty(({ [propertyId]: _removed, ...rest }) => rest)
          setError("We couldn't save that home. Please try again.")
        }
      }
    },
    [byProperty],
  )

  const ids = Object.keys(byProperty).map(Number)
  return { ids, toggle, error }
}
