export const STORAGE_KEY = 'gallery:favourites'

// Runs once, when the reducer is first set up. Falls back to an empty list
// if storage is blocked or holds something that is not a list.
export function loadFavourites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

// state is an array of favourite photo ids.
export function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      return state.includes(action.id)
        ? state.filter((id) => id !== action.id)
        : [...state, action.id]
    default:
      return state
  }
}
