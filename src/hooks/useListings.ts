import { useCallback, useEffect, useState } from "react"
import { api } from "../api"
import { describeError, LoadError } from "../lib/errors"
import { Listing, mapProperty } from "../lib/mapProperty"

type State<T> = { data: T | null; loading: boolean; error: LoadError | null }

/**
 * Runs `load` whenever `key` changes and tracks loading / error / data.
 * Old data stays on screen while new data loads, so lists don't flash empty.
 */
function useFetch<T>(load: () => Promise<T>, key: string, enabled = true) {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: enabled,
    error: null,
  })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, loading: false, error: null })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    load()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: describeError(err) })
      })
    return () => {
      cancelled = true // ignore answers that arrive after the filters changed
    }
  }, [key, tick, enabled])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}

export type ListingsPage = {
  items: Listing[]
  count: number
}

/** One page of listings. `query` is a query string such as "city=Bath&page=2". */
export function useListings(query = "", enabled = true) {
  return useFetch<ListingsPage>(
    async () => {
      const page = await api.properties(query)
      return { items: page.results.map(mapProperty), count: page.count }
    },
    query,
    enabled,
  )
}

/** A single listing by id. A missing one gives error.status === 404. */
export function useListing(id: number) {
  return useFetch<Listing>(
    async () => mapProperty(await api.property(id)),
    String(id),
  )
}

/** Several listings by id (used for saved homes). Missing ones are skipped. */
export function useListingsByIds(ids: number[], enabled = true) {
  return useFetch<Listing[]>(
    async () => {
      const found = await Promise.all(
        ids.map((id) =>
          api
            .property(id)
            .then(mapProperty)
            .catch(() => null),
        ),
      )
      return found.filter((p): p is Listing => p !== null)
    },
    ids.join(","),
    enabled,
  )
}

/** Returns `value` only after it has stopped changing for `delay` ms. */
export function useDebounce<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}
