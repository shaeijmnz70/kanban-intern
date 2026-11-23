import type { AnchorHTMLAttributes } from 'react'

type GlassActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>

function GlassActionLink({ className = '', children, ...props }: GlassActionLinkProps) {
  return (
    <a
      className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-[7px] rounded-[14px] border border-white/90 bg-white/80 px-4 text-[13px] font-medium text-[#3278bc] no-underline shadow-[0_6px_18px_#31567c14] backdrop-blur-xl transition-[background-color,box-shadow,transform] hover:-translate-y-px hover:bg-white hover:shadow-[0_10px_24px_#31567c20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4389d5] motion-reduce:transition-none ${className}`}
      {...props}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  )
}

export default GlassActionLink
