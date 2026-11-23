type BrandLogoProps = {
  variant?: 'site' | 'auth'
}

function BrandLogo({ variant = 'site' }: BrandLogoProps) {
  const isAuth = variant === 'auth'

  return (
    <div className="flex items-center text-[#244361]">
      <span className={`font-['Manrope'] font-extrabold leading-none ${isAuth ? 'text-xl max-[700px]:text-lg' : 'text-[21px]'}`}>
        <b className="text-[#4389d5]">Med</b>Track
        {!isAuth && <small className="mt-1 block font-['DM_Sans'] text-[10px] font-medium tracking-[0.1px] text-[#8393a8]">Pharmacy Inventory System</small>}
      </span>
    </div>
  )
}

export default BrandLogo
