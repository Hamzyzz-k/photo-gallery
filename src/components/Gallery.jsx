import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { useFetchPhotos } from '../hooks/useFetchPhotos'
import {
  STORAGE_KEY,
  favouritesReducer,
  loadFavourites,
} from '../state/favouritesReducer'
import Marquee from './Marquee'
import PhotoCard from './PhotoCard'
import SearchBar from './SearchBar'
import Spinner from './Spinner'

export default function Gallery() {
  const { photos, loading, error, reload } = useFetchPhotos()
  const [query, setQuery] = useState('')
  const [favourites, dispatch] = useReducer(favouritesReducer, [], loadFavourites)

  // Save favourites every time they change, so they survive a refresh.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
    } catch {
      // Storage can be full or blocked. The app still works without saving.
    }
  }, [favourites])

  // Stable function identity, so the memoized SearchBar does not re-render
  // when something unrelated (like a heart toggle) changes.
  const handleSearch = useCallback((event) => {
    setQuery(event.target.value)
  }, [])

  // dispatch never changes, so this function is created once. Without it every
  // PhotoCard would re-render on each toggle instead of just the one that changed.
  const handleToggle = useCallback((id) => {
    dispatch({ type: 'TOGGLE', id })
  }, [])

  // Clears the search too, so an old search cannot hide the new photos.
  function handleReload() {
    setQuery('')
    reload()
  }

  // Only re-filters when photos or query change, not on every render.
  const filteredPhotos = useMemo(() => {
    const term = query.trim().toLowerCase()
    return photos.filter((photo) => photo.author.toLowerCase().includes(term))
  }, [photos, query])

  return (
    <main>
      <div className="scroll-progress fixed top-0 left-0 z-20 h-1 w-full origin-left bg-rose" />

      <header className="flex items-end px-4 pt-8 pb-6 md:px-8 md:pt-12 md:pb-8 lg:min-h-[70svh] lg:px-10 lg:pb-10">
        <h1 className="scroll-hero origin-bottom-left text-[28vw] md:text-[min(22vw,30svh)] lg:text-[min(20vw,16rem)] leading-[0.85] font-extrabold tracking-tight">
          {/* The padding gives ascenders and descenders room inside the clip. */}
          <span className="-mt-[0.1em] block overflow-clip pt-[0.1em] pb-[0.2em]">
            <span className="block motion-safe:animate-rise">Photo</span>
          </span>
          <span className="-mt-[0.2em] block overflow-clip pt-[0.1em] pb-[0.2em]">
            <span className="block motion-safe:animate-rise motion-safe:[animation-delay:150ms] md:pl-[12vw]">
              gallery
            </span>
          </span>
        </h1>
      </header>

      <Marquee photos={photos} />

      <div className="sticky top-0 z-10 flex items-center gap-3 bg-night/85 px-4 py-3 backdrop-blur-md md:gap-6 md:px-8 md:py-4 lg:px-10">
        <SearchBar value={query} onChange={handleSearch} />
        <button
          type="button"
          onClick={handleReload}
          disabled={loading}
          aria-label="Load new photos"
          className="flex shrink-0 items-center gap-2 rounded-full border-2 border-white p-3 transition-colors hover:bg-white hover:text-night focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-marigold disabled:cursor-wait motion-reduce:transition-none md:px-5"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`size-5 fill-none stroke-current ${loading ? 'animate-spin motion-reduce:animate-none' : ''}`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 12a8 8 0 1 1-2.5-5.8M20 3v5h-5" />
          </svg>
          <span className="hidden font-medium md:inline">New photos</span>
        </button>
      </div>

      <div className="px-4 pt-6 pb-20 md:px-8 md:pt-8 md:pb-28 lg:px-10 lg:pt-10 lg:pb-32">
        {loading && <Spinner />}

        {error && (
          <p role="alert" className="max-w-xl bg-rose/20 p-5 text-lg motion-safe:animate-settle">
            {error}
          </p>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <p
            role="status"
            className="inline-block rounded-full bg-rose/20 px-4 py-2 text-sm motion-safe:animate-settle"
          >
            No photo found for “{query.trim()}”.
          </p>
        )}

        {filteredPhotos.length > 0 && (
          <ul className="grid grid-cols-1 items-start gap-x-5 gap-y-8 md:gap-y-12 lg:gap-x-6 lg:gap-y-14 md:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.includes(photo.id)}
                onToggle={handleToggle}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
