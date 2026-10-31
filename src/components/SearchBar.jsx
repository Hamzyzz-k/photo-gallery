import { memo } from 'react'

// memo skips re-rendering when props are unchanged. That only works if
// onChange keeps the same identity between renders, which useCallback ensures.
function SearchBar({ value, onChange }) {
  return (
    <div className="min-w-0 grow">
      <label htmlFor="author-search" className="sr-only">
        Search by author
      </label>
      <input
        id="author-search"
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Search by author"
        autoComplete="off"
        className="w-full min-w-0 border-b-2 border-white bg-transparent py-2 text-lg text-white transition-colors placeholder:text-white focus:border-marigold focus:outline-none motion-reduce:transition-none md:text-2xl"
      />
    </div>
  )
}

export default memo(SearchBar)
