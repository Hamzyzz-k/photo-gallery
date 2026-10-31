import { memo } from 'react'

// Decorative, so it is hidden from screen readers. The cards already name every author.
function Marquee({ photos }) {
  // A Set removes duplicates, since one author can have many photos.
  const authors = [...new Set(photos.map((photo) => photo.author))]

  return (
    <div aria-hidden="true" className="h-10 overflow-clip border-y border-white/30 md:h-12">
      <div className="flex h-full w-max motion-safe:animate-marquee">
        {[0, 1, 2, 3].map((copy) => (
          <div key={copy} className="flex items-center">
            {authors.map((author) => (
              <span key={author} className="px-4 text-lg font-medium whitespace-nowrap md:px-6 md:text-2xl">
                {author}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(Marquee)
