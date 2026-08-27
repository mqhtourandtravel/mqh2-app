import Link from 'next/link'

export default function PageHero({ title, breadcrumb, desc }: { title: string; breadcrumb: string; desc?: string }) {
  return (
    <div className="pt-40 pb-10 px-5 md:px-20 max-w-[1280px] mx-auto text-center">
      <nav aria-label="Breadcrumb" className="text-[12px] text-muted-foreground mb-2">
        <ol className="flex items-center justify-center gap-1">
          <li><Link href="/" className="hover:text-secondary-hover">Beranda</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{breadcrumb}</li>
        </ol>
      </nav>
      <h1 className="font-serif text-[30px] md:text-[38px] font-bold leading-[1.15] text-primary mb-3 tracking-[-0.02em]">
        {title}
      </h1>
      {desc && <p className="text-[14.5px] text-muted-foreground max-w-lg mx-auto leading-relaxed">{desc}</p>}
    </div>
  )
}
