# Photo Gallery

A React + Vite + Tailwind photo gallery. It fetches 30 photos from the Picsum API, lets you search by author and keep favourites that persist across refreshes.

## Run

```
npm install
npm run dev
```

## Structure

- `src/hooks/useFetchPhotos.js`: fetch logic, returns `photos`, `loading`, `error`
- `src/state/favouritesReducer.js`: `useReducer` reducer and `localStorage` loader
- `src/components/Gallery.jsx`: uses the hook, the reducer, `useCallback` and `useMemo`
- `src/components/PhotoCard.jsx`, `SearchBar.jsx`, `Spinner.jsx`: presentation
