import { memo, useState } from 'react'

function PhotoCard({ photo, isFavourite, onToggle }) {
  const [loaded, setLoaded] = useState(false)
  // True only between a click that favourites the photo and the end of its ring
  // animation, so saved favourites do not animate when the page loads.
  const [bursting, setBursting] = useState(false)

  function handleClick() {
    if (!isFavourite) setBursting(true)
    onToggle(photo.id)
  }

  return (
    <li className="md:even:mt-12 lg:even:mt-20">
      {/* overflow-clip, not overflow-hidden: hidden would make this frame the
          scroll container, and the parallax would stop following the page. */}
      <div className="scroll-reveal aspect-[4/5] overflow-clip bg-night-soft">
        {/* A 600x750 version loads far faster than the full-size download_url. */}
        <img
          src={`https://picsum.photos/id/${photo.id}/600/750`}
          alt={`Photo by ${photo.author}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`scroll-parallax size-full scale-125 object-cover transition duration-700 hover:scale-[1.32] motion-reduce:transition-none ${
            loaded ? 'blur-[0px] opacity-100 grayscale-0' : 'opacity-0 blur-lg grayscale'
          }`}
        />
      </div>
      <div className="flex items-center justify-between gap-3 pt-3">
        <p className="truncate text-base font-medium md:text-lg">{photo.author}</p>
        <button
          type="button"
          onClick={handleClick}
          aria-pressed={isFavourite}
          aria-label={
            isFavourite
              ? `Remove ${photo.author}'s photo from favourites`
              : `Add ${photo.author}'s photo to favourites`
          }
          className="relative shrink-0 rounded-full p-2 transition-transform active:scale-125 motion-reduce:transition-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-marigold"
        >
          {bursting && (
            <span
              onAnimationEnd={() => setBursting(false)}
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-rose opacity-0 motion-safe:animate-burst"
            />
          )}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`size-7 transition-colors motion-reduce:transition-none ${isFavourite ? 'fill-rose stroke-rose' : 'fill-transparent stroke-white'}`}
            strokeWidth="2"
            strokeLinejoin="round"
          >
            <path d="M12 20.5s-8-4.7-8-10.6A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 8 2.5c0 5.9-8 10.6-8 10.6Z" />
          </svg>
        </button>
      </div>
    </li>
  )
}

export default memo(PhotoCard)
