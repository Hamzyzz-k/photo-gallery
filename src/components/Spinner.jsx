export default function Spinner() {
  return (
    <div role="status" className="flex flex-col items-center gap-4 py-24 text-white">
      <div className="size-12 animate-spin rounded-full border-4 border-night-soft border-t-rose motion-reduce:animate-none" />
      <p>Loading photos…</p>
    </div>
  )
}
