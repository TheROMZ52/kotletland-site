export function SiteMark({ size = 40 }: { size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="brand-mark" src="/logo-96.webp" width={size} height={size} alt="" decoding="async" />
}

export function SiteLogo() {
  return (
    <span className="brand">
      <SiteMark />
      <span className="brand-word">NexvorDev</span>
    </span>
  )
}
