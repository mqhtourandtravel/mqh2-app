import Link from 'next/link'

export default function PageHero({ title, breadcrumb, desc }: { title: string; breadcrumb: string; desc?: string }) {
  return (
    <div className="pt-40 pb-10 px-5 md:px-20 max-w-[1280px] mx-auto text-center">
      <p className="text-[12px] text-muted-foreground mb-2">
        <Link href="/" className="hover:text-secondary-hover">Beranda</Link> / {breadcrumb}
      </p>
      <h1 className="font-serif text-[36px] md:text-[48px] font-semibold text-primary mb-3">
        {title}
      </h1>
      {desc && <p className="text-[14.5px] text-muted-foreground max-w-lg mx-auto leading-relaxed">{desc}</p>}
    </div>
  )
}
