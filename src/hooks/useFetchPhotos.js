import { useCallback, useEffect, useState } from 'react'

// The API has 33 full pages of 30 photos.
const PAGE_COUNT = 33

// Picks a random page, skipping the current one so new photos always differ.
function randomPage(currentPage) {
  let next
  do {
    next = Math.floor(Math.random() * PAGE_COUNT) + 1
  } while (next === currentPage)
  return next
}

export function useFetchPhotos() {
  // The arrow function means the first page is only picked once, on first render.
  const [page, setPage] = useState(() => randomPage())
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Runs on first load and again whenever page changes.
  useEffect(() => {
    // Cancels this request if the component unmounts or a newer page is requested.
    const controller = new AbortController()

    async function loadPhotos() {
      setPhotos([])
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `https://picsum.photos/v2/list?page=${page}&limit=30`,
          { signal: controller.signal },
        )
        // fetch only rejects on network failure, so HTTP errors are checked by hand.
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        setPhotos(await response.json())
      } catch (err) {
        if (err.name === 'AbortError') return
        setError("We couldn't load the photos. Check your connection and try again.")
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadPhotos()
    return () => controller.abort()
  }, [page])

  const reload = useCallback(() => {
    setPage((current) => randomPage(current))
  }, [])

  return { photos, loading, error, reload }
}
