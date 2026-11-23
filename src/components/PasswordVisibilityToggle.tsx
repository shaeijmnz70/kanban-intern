type PasswordVisibilityToggleProps = {
  label: string
  onToggle: () => void
  visible: boolean
}

function PasswordVisibilityToggle({ label, onToggle, visible }: PasswordVisibilityToggleProps) {
  return (
    <button
      className="grid size-9 shrink-0 place-items-center rounded-lg text-[#7890a8] transition-colors hover:bg-[#eff6fc] hover:text-[#4389d5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4389d5] motion-reduce:transition-none"
      type="button"
      onClick={onToggle}
      aria-label={visible ? `Hide ${label}` : `Show ${label}`}
      aria-pressed={visible}
    >
      <svg aria-hidden="true" className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
        {visible && <path d="m3 3 18 18" />}
      </svg>
    </button>
  )
}

export default PasswordVisibilityToggle
