'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

/* ============================================================
   Inline global styles (globals.css is empty)
   ============================================================ */

const STYLES = `
  html { scroll-behavior: smooth; }

  body {
    background: #03060d;
    color: #e9eef8;
    font-family: var(--font-sans), system-ui, sans-serif;
    font-weight: 300;
    letter-spacing: 0.005em;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .font-serif, .font-display {
    font-family: var(--font-serif), Georgia, serif;
  }
  .font-sans, .font-body {
    font-family: var(--font-sans), system-ui, sans-serif;
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9998;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  ::selection { background: #d9b26a; color: #03060d; }

  ::-webkit-scrollbar { width: 9px; }
  ::-webkit-scrollbar-track { background: #03060d; }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(#132648, #0a1428);
    border-radius: 20px;
    border: 2px solid #03060d;
  }
  ::-webkit-scrollbar-thumb:hover { background: #a8843f; }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-9px); }
  }
  @keyframes railRun {
    0%    { top: -48px; }
    60%,100% { top: 48px; }
  }
  @keyframes scrollX {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes pulseRing {
    0%        { transform: scale(0.9); opacity: 0.7; }
    80%, 100% { transform: scale(1.6); opacity: 0; }
  }
  .anim-float { animation: float 6s ease-in-out infinite; }
  .anim-rail  { animation: railRun 2.2s ease-in-out infinite; }
  .anim-scroll{ animation: scrollX 42s linear infinite; }
  .anim-pulse { animation: pulseRing 2.6s ease-out infinite; }
  .marquee-hover:hover .anim-scroll { animation-play-state: paused; }
`

/* ============================================================
   Shared bits
   ============================================================ */

function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <span
      className={`mb-4 inline-flex items-center gap-3 text-[0.64rem] font-medium uppercase tracking-[0.32em] text-[#d9b26a] ${center ? 'after:h-px after:w-7 after:bg-gradient-to-l after:from-transparent after:to-[#d9b26a]' : ''
        }`}
    >
      {!center && <span className="h-px w-7 bg-gradient-to-r from-transparent to-[#d9b26a]" />}
      {children}
    </span>
  )
}

function GoldRule() {
  return <div className="my-5 h-px w-14 bg-gradient-to-r from-[#d9b26a] to-transparent" />
}

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={`h-3 w-3 transition-transform duration-500 group-hover:translate-x-1.5 ${className}`}
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  )
}

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/* ============================================================
   Navigation
   ============================================================ */

const NAV_LINKS: [string, string][] = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Services', '#services'],
  ['Menus', '#menus'],
  ['Experiences', '#experiences'],
  ['Portfolio', '#portfolio'],
  ['Contact', '#contact'],
]

function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[1000] border-b transition-all duration-500 ${scrolled
            ? 'border-white/[0.075] bg-[rgba(3,6,13,0.85)] py-2.5 backdrop-blur-xl backdrop-saturate-150'
            : 'border-transparent py-4'
          }`}
      >
        <div className="mx-auto flex w-[min(1280px,92vw)] items-center justify-between gap-5">
          <a href="#home" className="group flex items-center gap-3 font-serif text-[1.2rem] leading-none tracking-[0.08em]">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#d9b26a]/35 text-[0.72rem] text-[#d9b26a] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-[#d9b26a] group-hover:text-[#03060d]">
              CA
            </span>
            <span className="flex flex-col">
              Chef Adex
              <small className="mt-0.5 font-sans text-[0.5rem] font-normal uppercase tracking-[0.32em] text-[#63748f]">
                Private Chef · Lagos
              </small>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map(([label, href]) => {
              const id = href.slice(1)
              if (label === 'Services') {
                return (
                  <div
                    key={href}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <a
                      href={href}
                      className={`flex items-center gap-1 py-1 text-[0.68rem] uppercase tracking-[0.2em] transition-colors ${active === id ? 'text-[#f0d6a0]' : 'text-[#8b9cbb] hover:text-[#f0d6a0]'
                        }`}
                    >
                      Services
                      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </a>
                    <div
                      className={`absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 transition-all duration-300 ${servicesOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                        }`}
                    >
                      <div className="overflow-hidden rounded-sm border border-white/[0.075] bg-[rgba(5,11,22,0.96)] p-1.5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                        {[
                          ['Private Dining', '#private-dining'],
                          ['Culinary Classes', '#culinary-classes'],
                          ['Restaurant Menu Curation', '#menu-curation'],
                          ['Consulting & Training', '#services'],
                        ].map(([label, href]) => (
                          <a
                            key={label}
                            href={href}
                            className="block rounded-sm px-3.5 py-2.5 text-[0.8rem] text-[#8b9cbb] transition-colors hover:bg-[#d9b26a]/5 hover:text-[#f0d6a0]"
                          >
                            {label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }
              return (
                <a
                  key={href}
                  href={href}
                  className={`py-1 text-[0.68rem] uppercase tracking-[0.2em] transition-colors ${active === id ? 'text-[#f0d6a0]' : 'text-[#8b9cbb] hover:text-[#f0d6a0]'
                    }`}
                >
                  {label}
                </a>
              )
            })}
          </nav>

          <a
            href="#contact"
            className="group hidden items-center gap-2 rounded-sm bg-gradient-to-br from-[#d9b26a] to-[#a8843f] px-5 py-2.5 text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[#03060d] shadow-[0_10px_30px_-12px_rgba(217,178,106,0.55)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-14px_rgba(217,178,106,0.72)] lg:inline-flex"
          >
            Book an Experience
            <Arrow />
          </a>

          <button
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-sm border border-white/10 lg:hidden"
          >
            <span className={`block h-[1.5px] w-5 bg-[#e9eef8] transition-all duration-500 ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-[#e9eef8] transition-all duration-500 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-[#e9eef8] transition-all duration-500 ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-2 bg-[rgba(3,6,13,0.97)] backdrop-blur-xl transition-all duration-500 lg:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
      >
        {NAV_LINKS.map(([label, href], i) => (
          <a
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? `${0.05 * (i + 1)}s` : '0s' }}
            className={`py-1.5 font-serif text-2xl text-[#e9eef8] transition-all duration-500 hover:text-[#d9b26a] ${open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
          >
            {label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          style={{ transitionDelay: open ? '0.42s' : '0s' }}
          className={`mt-2 rounded-sm bg-gradient-to-br from-[#d9b26a] to-[#a8843f] px-7 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#03060d] transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
        >
          Book an Experience
        </a>
      </div>
    </>
  )
}

/* ============================================================
   WhatsApp Float
   ============================================================ */

function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/2348000000000?text=Hi%20Chef%20Adex%2C%20I%27d%20like%20to%20enquire%20about%20an%20experience."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-5 right-5 z-[1001] flex items-center gap-2.5 rounded-full bg-[#25D366] py-2.5 pl-2.5 pr-4 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_-12px_rgba(37,211,102,0.65)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-12px_rgba(37,211,102,0.85)]"
    >
      <span className="relative grid h-8 w-8 place-items-center">
        <span className="anim-pulse absolute inset-0 rounded-full bg-white/40" />
        <WhatsAppIcon className="relative h-5 w-5" />
      </span>
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  )
}

/* ============================================================
   Hero
   ============================================================ */

function Hero() {
  return (
    <section id="home" className="relative flex min-h-svh items-center overflow-hidden pt-[120px] pb-[70px]">
      <div className="absolute inset-0 bg-[radial-gradient(900px_620px_at_78%_22%,rgba(26,49,96,0.6),transparent_62%),radial-gradient(700px_520px_at_8%_82%,rgba(217,178,106,0.08),transparent_65%),linear-gradient(180deg,#050b16_0%,#03060d_100%)]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, #000 20%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, #000 20%, transparent 78%)',
        }}
      />

      <div className="relative z-10 mx-auto grid w-[min(1280px,92vw)] items-center gap-[clamp(34px,5vw,72px)] lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.075] bg-white/[0.028] px-4 py-2 pl-2.5 text-[0.62rem] uppercase tracking-[0.2em] text-[#8b9cbb] backdrop-blur-md">
            <span className="inline-flex gap-0.5 text-[0.68rem] text-[#d9b26a]">✦ ✦ ✦</span>
            Private Dining · Lagos &amp; Beyond
          </div>

          <h1 className="mb-5 font-serif text-[clamp(2.4rem,5.6vw,4.6rem)] font-normal leading-[1.02] tracking-[-0.025em]">
            Private dining,
            <br />
            <em className="bg-gradient-to-r from-[#f0d6a0] to-[#a8843f] bg-clip-text font-light not-italic text-transparent">
              curated by Chef Adex.
            </em>
          </h1>

          <p className="mb-8 max-w-[52ch] text-[clamp(0.94rem,1.2vw,1.04rem)] leading-[1.8] text-[#8b9cbb]">
            Exceptional dining experiences brought to your table — private dinners, hands-on culinary classes, and menus designed for restaurants that want to be remembered.
          </p>

          <div className="mb-11 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-sm bg-gradient-to-br from-[#d9b26a] to-[#a8843f] px-7 py-3.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#03060d] shadow-[0_10px_34px_-12px_rgba(217,178,106,0.55)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_46px_-14px_rgba(217,178,106,0.72)]"
            >
              Book an Experience
              <Arrow />
            </a>
            <a
              href="#services"
              className="group inline-flex items-center gap-2.5 rounded-sm border border-white/15 px-7 py-3.5 text-[0.7rem] uppercase tracking-[0.2em] text-[#e9eef8] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#d9b26a] hover:bg-[#d9b26a]/5 hover:text-[#d9b26a]"
            >
              Explore Services
            </a>
          </div>

          <div className="flex flex-wrap gap-[clamp(24px,3.4vw,46px)] border-t border-white/[0.075] pt-6">
            {[
              { n: '10', sup: '+', l: 'Years in kitchens' },
              { n: '450', sup: '+', l: 'Dinners curated' },
              { n: '30', sup: '+', l: 'Restaurants advised' },
            ].map((s) => (
              <div key={s.l}>
                <div className="flex items-baseline gap-0.5 font-serif text-[1.75rem] leading-none text-[#f0d6a0]">
                  {s.n}
                  {s.sup && <sup className="text-[0.8rem] text-[#d9b26a]">{s.sup}</sup>}
                </div>
                <span className="mt-1.5 block text-[0.58rem] uppercase tracking-[0.22em] text-[#63748f]">
                  {s.l}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[460px] justify-self-center lg:justify-self-end">
          <span className="pointer-events-none absolute -inset-[14px] -z-10 border border-[#d9b26a]/25 [inset:-14px_-14px_14px_14px]" />
          <div className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-gradient-to-br from-[#0e1c37] to-[#050b16] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
            <Image
              src="https://www.foodandwine.com/thmb/2jtU6vko25_uXKddmk1fFAhyc0o=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/grilled-quail-with-sweet-and-sour-plum-glaze-FT-RECIPE0721-c49143a72ef44475982b6e8109363b14.jpg"
              alt="Grilled quail with sweet and sour plum glaze — signature plating by Chef Adex"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 460px"
              className="object-cover brightness-90 contrast-[1.06] saturate-[0.9] transition-all duration-1000 group-hover:scale-[1.045] group-hover:brightness-95 group-hover:saturate-100"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050b16]/10 via-[#050b16]/55 to-[#050b16]/90" />
          </div>

          <div className="anim-float absolute -left-5 bottom-8 flex items-center gap-3 rounded-sm border border-white/[0.075] border-l-2 border-l-[#d9b26a] bg-[rgba(7,14,30,0.9)] px-4 py-3 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:-left-6">
            <div className="font-serif text-[1.7rem] leading-none text-[#d9b26a]">1:1</div>
            <div className="text-[0.6rem] uppercase leading-relaxed tracking-[0.16em] text-[#8b9cbb]">
              Crafted
              <br />
              for you
            </div>
          </div>
        </div>
      </div>

      <a
        href="#intro"
        aria-label="Scroll"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.55rem] uppercase tracking-[0.3em] text-[#63748f] md:flex"
      >
        <span className="relative h-12 w-px overflow-hidden bg-gradient-to-b from-[#d9b26a] to-transparent">
          <span className="anim-rail absolute left-0 h-12 w-full bg-[#f0d6a0]" />
        </span>
        Scroll
      </a>
    </section>
  )
}

/* ============================================================
   Marquee
   ============================================================ */

function Marquee() {
  const words = [
    'Private Dining', 'Culinary Classes', 'Menu Curation', 'Lagos', 'Executive Dinners',
    'Celebrations', 'Hands-on Training', 'Bespoke Menus', 'Restaurant Consulting', 'Intimate Events',
  ]
  return (
    <div className="marquee-hover relative overflow-hidden border-y border-white/[0.075] bg-gradient-to-r from-[#050b16] via-[#070e1e] to-[#050b16] py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#050b16] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#050b16] to-transparent" />
      <div className="anim-scroll flex w-max">
        {[...words, ...words].map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-7 whitespace-nowrap px-7 font-serif text-[clamp(0.98rem,1.8vw,1.34rem)] tracking-[0.06em] text-[#e9eef8]/35"
          >
            {w}
            <i className="text-[0.55rem] not-italic text-[#d9b26a] opacity-75">◆</i>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   Intro + 3 Core Services
   ============================================================ */

const CORE_SERVICES = [
  {
    n: '01',
    title: 'Private Dining',
    text: 'Personalised dining experiences for intimate occasions, celebrations and special events.',
    href: '#private-dining',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
  },
  {
    n: '02',
    title: 'Culinary Classes',
    text: 'Hands-on cooking experiences designed around your interests, goals and skill level.',
    href: '#culinary-classes',
    img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80',
  },
  {
    n: '03',
    title: 'Menu Curation',
    text: 'Professional menu development and culinary consulting for restaurants and food businesses.',
    href: '#menu-curation',
    img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80',
  },
]

function Intro() {
  return (
    <section id="intro" className="bg-gradient-to-b from-[#03060d] to-[#050b16] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto w-[min(1280px,92vw)]">
        <div className="mb-12 grid items-end gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>Introduction</Eyebrow>
            <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
              Elevated dining.{' '}
              <em className="not-italic text-[#f0d6a0]">Personalised to you.</em>
            </h2>
          </div>
          <p className="max-w-[58ch] text-[0.95rem] leading-[1.8] text-[#8b9cbb]">
            Chef Adex brings restaurant-quality dining, culinary expertise and personalised experiences to every table — whether it&apos;s an intimate dinner for two, a milestone celebration, a hands-on class, or a full menu for a restaurant.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {CORE_SERVICES.map((s) => (
            <a
              key={s.n}
              href={s.href}
              className="group relative overflow-hidden rounded-sm border border-white/[0.075] bg-gradient-to-b from-[#0a1428]/70 to-[#03060d]/50 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d9b26a]/30 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover brightness-[0.78] saturate-[0.85] transition-all duration-1000 group-hover:scale-[1.06] group-hover:brightness-95 group-hover:saturate-100"
                />
                <span className="absolute left-3.5 top-3.5 rounded-full border border-[#d9b26a]/30 bg-[rgba(3,6,13,0.72)] px-2.5 py-0.5 text-[0.55rem] uppercase tracking-[0.22em] text-[#f0d6a0] backdrop-blur-md">
                  {s.n}
                </span>
              </div>
              <div className="p-5">
                <h3 className="mb-2 font-serif text-[1.35rem] text-[#e9eef8]">{s.title}</h3>
                <p className="mb-4 text-[0.86rem] leading-[1.7] text-[#8b9cbb]">{s.text}</p>
                <span className="inline-flex items-center gap-2 text-[0.64rem] uppercase tracking-[0.2em] text-[#d9b26a] transition-all duration-500 group-hover:gap-3">
                  Explore
                  <Arrow />
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#services"
            className="group inline-flex items-center gap-2.5 rounded-sm border border-[#d9b26a]/35 px-7 py-3.5 text-[0.7rem] uppercase tracking-[0.2em] text-[#d9b26a] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#d9b26a] hover:text-[#03060d]"
          >
            Explore Our Services
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   About
   ============================================================ */

const CREDENTIALS = [
  { ic: '★', t: '10+ Years Experience', s: 'Fine dining, private cheffing & consulting' },
  { ic: '✦', t: 'Culinary Trained', s: 'Formal classical & modern technique' },
  { ic: '✿', t: 'Global Influences', s: 'West African roots, French discipline' },
  { ic: '◈', t: 'Trusted by Brands', s: 'Restaurants, hotels & private clients' },
]

function About() {
  return (
    <section id="about" className="bg-gradient-to-b from-[#050b16] to-[#03060d] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto grid w-[min(1280px,92vw)] items-center gap-[clamp(34px,5vw,72px)] lg:grid-cols-[1fr_1.05fr]">
        <div className="relative grid grid-cols-2 grid-rows-[auto_auto] gap-3">
          <div className="group relative col-start-1 row-span-2 aspect-[3/4.4] overflow-hidden rounded-sm bg-gradient-to-br from-[#0e1c37] to-[#050b16]">
            <Image
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=80"
              alt="Chef Adex portrait"
              fill
              sizes="(max-width: 1024px) 50vw, 340px"
              className="object-cover brightness-[0.88] contrast-[1.05] saturate-[0.85] transition-all duration-1000 group-hover:scale-[1.06] group-hover:brightness-95 group-hover:saturate-100"
            />
          </div>
          <div className="group relative aspect-square overflow-hidden rounded-sm bg-gradient-to-br from-[#0e1c37] to-[#050b16]">
            <Image
              src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=600&q=80"
              alt="Chef in the kitchen"
              fill
              sizes="(max-width: 1024px) 50vw, 240px"
              className="object-cover brightness-[0.88] contrast-[1.05] saturate-[0.85] transition-all duration-1000 group-hover:scale-[1.06] group-hover:brightness-95 group-hover:saturate-100"
            />
          </div>
          <div className="group relative aspect-square overflow-hidden rounded-sm bg-gradient-to-br from-[#0e1c37] to-[#050b16]">
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
              alt="Plated dish by Chef Adex"
              fill
              sizes="(max-width: 1024px) 50vw, 240px"
              className="object-cover brightness-[0.88] contrast-[1.05] saturate-[0.85] transition-all duration-1000 group-hover:scale-[1.06] group-hover:brightness-95 group-hover:saturate-100"
            />
          </div>

          <div className="absolute -bottom-3 -right-3 z-10 grid h-[100px] w-[100px] place-items-center rounded-full border border-[#d9b26a]/30 bg-[#03060d] text-center font-serif leading-tight">
            <div>
              <b className="block font-sans text-[0.5rem] font-normal tracking-[0.26em] text-[#63748f]">SINCE</b>
              <i className="not-italic text-[1.4rem] text-[#d9b26a]">2014</i>
            </div>
          </div>
        </div>

        <div>
          <Eyebrow>Meet the Chef</Eyebrow>
          <h2 className="mb-4 font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
            Bringing restaurant-quality dining to{' '}
            <em className="not-italic text-[#f0d6a0]">every table.</em>
          </h2>
          <GoldRule />

          <p className="max-w-[58ch] text-[0.95rem] leading-[1.8] text-[#8b9cbb]">
            Chef Adex is a private chef, culinary educator and menu consultant based in Lagos. His cooking draws on classical French discipline and modern global technique, layered over the bold, generous flavours of West African cooking.
          </p>
          <p className="mt-3 max-w-[58ch] text-[0.95rem] leading-[1.8] text-[#8b9cbb]">
            He has cooked in fine-dining kitchens, trained private clients and restaurant brigades, and consulted on menus for businesses across Nigeria.
          </p>

          <blockquote className="mt-7 rounded-r-sm border-l-2 border-[#d9b26a] bg-[rgba(217,178,106,0.045)] px-5 py-4 font-serif text-[1rem] italic leading-[1.65] text-[#8b9cbb]">
            &ldquo;Great food is not about showing off. It&apos;s about listening to the people at the table — then cooking for them, not at them.&rdquo;
          </blockquote>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CREDENTIALS.map((c) => (
              <div key={c.t} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#d9b26a]/30 text-[0.8rem] text-[#d9b26a]">
                  {c.ic}
                </span>
                <div>
                  <strong className="block font-serif text-[0.95rem] font-medium text-[#e9eef8]">{c.t}</strong>
                  <p className="text-[0.78rem] leading-snug text-[#63748f]">{c.s}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-sm bg-gradient-to-br from-[#d9b26a] to-[#a8843f] px-7 py-3.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#03060d] shadow-[0_10px_34px_-12px_rgba(217,178,106,0.55)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_46px_-14px_rgba(217,178,106,0.72)]"
            >
              Discover Chef Adex
              <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Services
   ============================================================ */

const DINING_CATEGORIES = [
  { t: 'Romantic Dining', d: 'Date nights, anniversaries, proposals and intimate dinners for two.', ic: '❤' },
  { t: 'Celebration Dining', d: 'Birthdays, milestones and dinner parties in your space.', ic: '✦' },
  { t: 'Luxury Private Dining', d: 'Multi-course experiences with curated menus, served in-home.', ic: '♛' },
  { t: 'Corporate & Executive', d: 'Corporate dinners, executive entertaining and private business events.', ic: '◈' },
  { t: 'Special Events', d: 'Custom private events, small gatherings and bespoke dining experiences.', ic: '◆' },
]

const CLASS_CATEGORIES = [
  { t: 'Private 1-on-1 Classes', d: 'Personalised sessions for skill development and cuisine-specific training.', ic: '01' },
  { t: 'Private Group Classes', d: 'Friends, family, couples and small private groups — hands-on, together.', ic: '02' },
  { t: 'Specialised Classes', d: 'Focused sessions on specific cuisines, techniques and signature dishes.', ic: '03' },
]

const CURATION_CATEGORIES = [
  { t: 'Menu Development', d: 'New menu creation, signature dishes and concept-driven menus.', ic: '01' },
  { t: 'Menu Refresh', d: 'Existing menu improvement, new dishes and seasonal updates.', ic: '02' },
  { t: 'Restaurant Consulting', d: 'Concept development, menu positioning and recipe standardisation.', ic: '03' },
  { t: 'Kitchen Training', d: 'Staff training, recipe execution, consistency and presentation.', ic: '04' },
]

function CategoryGrid({
  items,
  columns = 'lg:grid-cols-3',
}: {
  items: { t: string; d: string; ic: string }[]
  columns?: string
}) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${columns}`}>
      {items.map((it) => (
        <div
          key={it.t}
          className="group relative overflow-hidden rounded-sm border border-white/[0.075] bg-gradient-to-b from-[#0a1428]/60 to-[#03060d]/30 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#d9b26a]/30 hover:from-[#132648]/60"
        >
          <span className="absolute inset-x-0 top-0 h-px -translate-x-full bg-gradient-to-r from-transparent via-[#d9b26a] to-transparent transition-transform duration-700 group-hover:translate-x-0" />
          <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d9b26a]/30 font-serif text-[0.85rem] text-[#d9b26a] transition-all duration-500 group-hover:-rotate-[10deg] group-hover:bg-[#d9b26a] group-hover:text-[#03060d]">
            {it.ic}
          </div>
          <h4 className="mb-1.5 font-serif text-[1.12rem] text-[#e9eef8]">{it.t}</h4>
          <p className="text-[0.84rem] leading-[1.65] text-[#8b9cbb]">{it.d}</p>
        </div>
      ))}
    </div>
  )
}

function Services() {
  return (
    <section id="services" className="bg-[#03060d] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto w-[min(1280px,92vw)]">
        {/* PRIVATE DINING */}
        <div id="private-dining" className="scroll-mt-20">
          <div className="mb-9 grid items-end gap-7 lg:grid-cols-2">
            <div>
              <Eyebrow>Service 01 · Private Dining</Eyebrow>
              <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
                A dining experience,{' '}
                <em className="not-italic text-[#f0d6a0]">created around you.</em>
              </h2>
            </div>
            <p className="max-w-[58ch] text-[0.94rem] leading-[1.8] text-[#8b9cbb]">
              Whether it&apos;s an intimate dinner for two, a milestone celebration or a corporate gathering, Chef Adex creates personalised dining experiences around the occasion, guests and location.
            </p>
          </div>
          <CategoryGrid items={DINING_CATEGORIES} />
          <div className="mt-9 flex justify-center">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-sm border border-[#d9b26a]/35 px-7 py-3.5 text-[0.7rem] uppercase tracking-[0.2em] text-[#d9b26a] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#d9b26a] hover:text-[#03060d]"
            >
              Plan Your Private Dining Experience
              <Arrow />
            </a>
          </div>
        </div>

        <div className="my-[clamp(56px,7vw,96px)] h-px w-full bg-gradient-to-r from-transparent via-white/[0.075] to-transparent" />

        {/* CULINARY CLASSES */}
        <div id="culinary-classes" className="scroll-mt-20">
          <div className="mb-9 grid items-end gap-7 lg:grid-cols-2">
            <div>
              <Eyebrow>Service 02 · Culinary Classes</Eyebrow>
              <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
                Learn. Create.{' '}
                <em className="not-italic text-[#f0d6a0]">Master.</em>
              </h2>
            </div>
            <p className="max-w-[58ch] text-[0.94rem] leading-[1.8] text-[#8b9cbb]">
              Private, hands-on culinary experiences designed around your interests, goals and skill level — for complete beginners, passionate home cooks and aspiring professionals.
            </p>
          </div>
          <CategoryGrid items={CLASS_CATEGORIES} />
          <div className="mt-9 flex justify-center">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-sm border border-[#d9b26a]/35 px-7 py-3.5 text-[0.7rem] uppercase tracking-[0.2em] text-[#d9b26a] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#d9b26a] hover:text-[#03060d]"
            >
              Book a Culinary Class
              <Arrow />
            </a>
          </div>
        </div>

        <div className="my-[clamp(56px,7vw,96px)] h-px w-full bg-gradient-to-r from-transparent via-white/[0.075] to-transparent" />

        {/* MENU CURATION */}
        <div id="menu-curation" className="scroll-mt-20">
          <div className="mb-9 grid items-end gap-7 lg:grid-cols-2">
            <div>
              <Eyebrow>Service 03 · Restaurant Menu Curation</Eyebrow>
              <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
                Create a menu people{' '}
                <em className="not-italic text-[#f0d6a0]">come back for.</em>
              </h2>
            </div>
            <p className="max-w-[58ch] text-[0.94rem] leading-[1.8] text-[#8b9cbb]">
              Chef Adex works with restaurants and food businesses to develop menus that are creative, commercially viable and aligned with their brand.
            </p>
          </div>
          <CategoryGrid items={CURATION_CATEGORIES} columns="lg:grid-cols-4" />
          <div className="mt-9 flex justify-center">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-sm border border-[#d9b26a]/35 px-7 py-3.5 text-[0.7rem] uppercase tracking-[0.2em] text-[#d9b26a] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#d9b26a] hover:text-[#03060d]"
            >
              Work With Chef Adex
              <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Menus
   ============================================================ */

const SAMPLE_MENU = [
  { course: 'Amuse-Bouche', dish: 'Smoked Pepper Tartlet', desc: 'Crisp pastry, roasted red pepper, goat cheese, basil oil' },
  { course: 'Starter', dish: 'Seared Scallop & Suya Butter', desc: 'Pan-seared scallop, spiced suya butter, cauliflower, citrus' },
  { course: 'Main Course', dish: 'Slow-Braised Short Rib', desc: 'Red wine braised short rib, jollof risotto, charred greens, jus' },
  { course: 'Dessert', dish: 'Dark Chocolate & Hibiscus', desc: '70% chocolate ganache, hibiscus sorbet, toasted coconut' },
]

function Menus() {
  return (
    <section id="menus" className="bg-gradient-to-b from-[#03060d] to-[#050b16] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto grid w-[min(1280px,92vw)] items-start gap-[clamp(34px,5vw,72px)] lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Eyebrow>A Sample Menu</Eyebrow>
          <h2 className="mb-4 font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
            Curated menus.{' '}
            <em className="not-italic text-[#f0d6a0]">Exceptional flavours.</em>
          </h2>
          <GoldRule />
          <p className="max-w-[52ch] text-[0.94rem] leading-[1.8] text-[#8b9cbb]">
            Every menu begins with a conversation — your tastes, your guests, the season and the story you want the evening to tell.
          </p>

          <div className="mt-7 space-y-3">
            <div className="rounded-sm border border-[#d9b26a]/25 bg-[rgba(217,178,106,0.045)] p-5">
              <p className="text-[0.9rem] leading-[1.7] text-[#8b9cbb]">
                Looking for something more personal? Custom menus are available based on your preferences, dietary requirements and occasion.
              </p>
              <a
                href="#contact"
                className="group mt-4 inline-flex items-center gap-2 text-[0.64rem] uppercase tracking-[0.2em] text-[#d9b26a] transition-all duration-500 hover:gap-3"
              >
                Request a Custom Menu
                <Arrow />
              </a>
            </div>
            <p className="text-[0.8rem] text-[#63748f]">
              For restaurant clients, selected menus and dishes developed by Chef Adex can also be showcased here on request.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-3 -z-10 hidden rounded-sm border border-[#d9b26a]/20 lg:block" />
          <div className="overflow-hidden rounded-sm border border-white/[0.075] bg-gradient-to-b from-[#0a1428]/70 to-[#03060d]/60">
            <div className="flex items-center justify-between border-b border-white/[0.075] px-6 py-4">
              <span className="font-serif text-[1.05rem] tracking-[0.06em] text-[#f0d6a0]">
                Tasting Menu · Winter
              </span>
              <span className="text-[0.58rem] uppercase tracking-[0.22em] text-[#63748f]">
                4 Courses
              </span>
            </div>
            <ul>
              {SAMPLE_MENU.map((m, i, arr) => (
                <li
                  key={m.course}
                  className={`px-6 py-5 ${i !== arr.length - 1 ? 'border-b border-white/[0.075]' : ''}`}
                >
                  <span className="mb-1 block text-[0.56rem] uppercase tracking-[0.26em] text-[#d9b26a]">
                    {m.course}
                  </span>
                  <h3 className="mb-1 font-serif text-[1.15rem] text-[#e9eef8]">{m.dish}</h3>
                  <p className="text-[0.84rem] leading-[1.65] text-[#8b9cbb]">{m.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Experiences
   ============================================================ */

const EXPERIENCES = [
  {
    n: '01',
    name: 'The Intimate Experience',
    range: 'For 2–4 guests',
    desc: 'A private, four-course dining experience for two to four guests — quiet, considered, and completely centred on the table.',
    features: ['4-course menu', 'In-home or chosen venue', 'Wine suggestions included'],
    featured: false,
  },
  {
    n: '02',
    name: 'The Celebration Experience',
    range: 'For birthdays, anniversaries & milestones',
    desc: 'A celebratory multi-course dinner with a personalised menu built around the person and the occasion.',
    features: ['5–6 course menu', 'Personalised dessert moment', 'Full table service'],
    featured: false,
  },
  {
    n: '03',
    name: 'The Signature Experience',
    range: 'Multi-course private dining',
    desc: 'Chef Adex&apos;s signature multi-course dining experience — the dishes he is best known for, served at your table.',
    features: ['7-course signature menu', 'Optional wine pairing', 'Full service team'],
    featured: true,
  },
  {
    n: '04',
    name: 'The Bespoke Experience',
    range: 'Completely personalised',
    desc: 'A fully bespoke dining experience designed from scratch — location, menu, styling, and every detail around you.',
    features: ['Fully custom menu & format', 'Styling & table design', 'Any location, on request'],
    featured: false,
  },
]

function Experiences() {
  return (
    <section id="experiences" className="bg-[#03060d] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto w-[min(1280px,92vw)]">
        <div className="mb-12 flex flex-col items-center text-center">
          <Eyebrow center>Experiences</Eyebrow>
          <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
            Choose the shape of{' '}
            <em className="not-italic text-[#f0d6a0]">your evening.</em>
          </h2>
          <p className="mt-4 max-w-[58ch] text-[0.94rem] leading-[1.8] text-[#8b9cbb]">
            Every experience is priced according to your date, location, guest count and menu. Request a quote and Chef Adex will design a proposal that fits.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {EXPERIENCES.map((e) => (
            <div
              key={e.n}
              className={`group relative flex flex-col overflow-hidden rounded-sm border p-6 transition-all duration-500 hover:-translate-y-1.5 ${e.featured
                  ? 'border-[#d9b26a]/40 bg-gradient-to-b from-[rgba(217,178,106,0.09)] to-[#03060d]/40 shadow-[0_40px_80px_-40px_rgba(217,178,106,0.35)]'
                  : 'border-white/[0.075] bg-gradient-to-b from-[#0a1428]/60 to-[#03060d]/30 hover:border-[#d9b26a]/30'
                }`}
            >
              {e.featured && (
                <span className="absolute right-3 top-3 rounded-full border border-[#d9b26a]/40 bg-[rgba(3,6,13,0.85)] px-2.5 py-0.5 text-[0.52rem] uppercase tracking-[0.22em] text-[#d9b26a]">
                  Most Requested
                </span>
              )}
              <span className="mb-4 font-serif text-[0.8rem] tracking-[0.06em] text-[#a8843f]">
                {e.n}
              </span>
              <h3 className="mb-1.5 font-serif text-[1.22rem] leading-tight text-[#e9eef8]">
                {e.name}
              </h3>
              <span className="mb-4 text-[0.58rem] uppercase tracking-[0.22em] text-[#63748f]">
                {e.range}
              </span>
              <p className="mb-5 text-[0.84rem] leading-[1.7] text-[#8b9cbb]">{e.desc}</p>
              <ul className="mb-6 mt-auto space-y-2">
                {e.features.map((f) => (
                  <li key={f} className="flex gap-2 text-[0.8rem] text-[#8b9cbb]">
                    <span className="text-[#d9b26a]">·</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`group/btn mt-auto inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-[0.64rem] uppercase tracking-[0.2em] transition-all duration-500 ${e.featured
                    ? 'bg-gradient-to-br from-[#d9b26a] to-[#a8843f] text-[#03060d] hover:shadow-[0_18px_40px_-14px_rgba(217,178,106,0.72)]'
                    : 'border border-white/15 text-[#e9eef8] hover:border-[#d9b26a] hover:bg-[#d9b26a]/5 hover:text-[#d9b26a]'
                  }`}
              >
                Request a Quote
                <Arrow />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Occasions
   ============================================================ */

const OCCASIONS = [
  { t: 'A Romantic Dinner', d: 'For intimate evenings and special moments.', ic: '❤' },
  { t: 'A Birthday', d: 'Create a memorable dining experience for someone special.', ic: '✦' },
  { t: 'An Anniversary', d: 'Celebrate your story with an intimate private dinner.', ic: '∞' },
  { t: 'A Proposal', d: 'A beautifully curated experience for an unforgettable moment.', ic: '◇' },
  { t: 'A Special Celebration', d: 'For milestones, gatherings and everything worth celebrating.', ic: '✧' },
  { t: 'A Corporate Dinner', d: 'Elevated dining for clients, executives and teams.', ic: '◈' },
]

function Occasions() {
  return (
    <section className="bg-gradient-to-b from-[#03060d] to-[#050b16] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto w-[min(1280px,92vw)]">
        <div className="mb-12 flex flex-col items-center text-center">
          <Eyebrow center>For Your Occasion</Eyebrow>
          <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
            What are you{' '}
            <em className="not-italic text-[#f0d6a0]">celebrating?</em>
          </h2>
          <p className="mt-4 max-w-[58ch] text-[0.94rem] leading-[1.8] text-[#8b9cbb]">
            Tell us the moment. Chef Adex will shape the experience around it.
          </p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {OCCASIONS.map((o) => (
            <a
              key={o.t}
              href="#contact"
              className="group flex items-start gap-4 rounded-sm border border-white/[0.075] bg-gradient-to-b from-[#0a1428]/50 to-[#03060d]/30 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#d9b26a]/30 hover:from-[#132648]/50"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#d9b26a]/30 text-[1rem] text-[#d9b26a] transition-all duration-500 group-hover:-rotate-[10deg] group-hover:bg-[#d9b26a] group-hover:text-[#03060d]">
                {o.ic}
              </span>
              <div className="flex-1">
                <h3 className="mb-1.5 font-serif text-[1.1rem] text-[#e9eef8]">{o.t}</h3>
                <p className="text-[0.82rem] leading-[1.6] text-[#8b9cbb]">{o.d}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Portfolio
   ============================================================ */

const PORTFOLIO = [
  { cat: 'dining', src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80', alt: 'Plated dish' },
  { cat: 'dining', src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80', alt: 'Table setting' },
  { cat: 'dining', src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80', alt: 'Private dining' },
  { cat: 'classes', src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80', alt: 'Culinary class' },
  { cat: 'classes', src: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?auto=format&fit=crop&w=900&q=80', alt: 'Hands-on cooking' },
  { cat: 'classes', src: 'https://images.unsplash.com/photo-1565895405138-6c3a1555da6a?auto=format&fit=crop&w=900&q=80', alt: 'Students cooking' },
  { cat: 'restaurant', src: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80', alt: 'Restaurant dish' },
  { cat: 'restaurant', src: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80', alt: 'Menu development' },
  { cat: 'restaurant', src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80', alt: 'Plated dish' },
]

const FILTERS: { id: 'all' | 'dining' | 'classes' | 'restaurant'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'dining', label: 'Private Dining' },
  { id: 'classes', label: 'Culinary Classes' },
  { id: 'restaurant', label: 'Restaurant Projects' },
]

function Portfolio() {
  const [filter, setFilter] = useState<'all' | 'dining' | 'classes' | 'restaurant'>('all')

  const visible = useMemo(
    () => (filter === 'all' ? PORTFOLIO : PORTFOLIO.filter((p) => p.cat === filter)),
    [filter]
  )

  return (
    <section id="portfolio" className="bg-[#050b16] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto w-[min(1280px,92vw)]">
        <div className="mb-9 flex flex-col items-center text-center">
          <Eyebrow center>Portfolio</Eyebrow>
          <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
            The full{' '}
            <em className="not-italic text-[#f0d6a0]">experience.</em>
          </h2>
          <p className="mt-4 max-w-[58ch] text-[0.94rem] leading-[1.8] text-[#8b9cbb]">
            Dishes, tables, students, projects — a visual record of the experiences Chef Adex has created with clients.
          </p>
        </div>

        <div className="mb-7 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.2em] transition-all duration-500 ${filter === f.id
                  ? 'border-[#d9b26a] bg-[#d9b26a] text-[#03060d]'
                  : 'border-white/15 text-[#8b9cbb] hover:border-[#d9b26a]/40 hover:text-[#d9b26a]'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {visible.map((p, i) => (
            <figure
              key={p.src}
              className={`group relative m-0 overflow-hidden rounded-sm bg-[#0a1428] ${i === 0 && filter === 'all' ? 'col-span-2 aspect-[16/10] lg:row-span-2 lg:aspect-auto' : 'aspect-square'
                }`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 400px"
                className="object-cover brightness-[0.82] saturate-[0.85] transition-all duration-1000 group-hover:scale-[1.06] group-hover:brightness-100 group-hover:saturate-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03060d]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Testimonials
   ============================================================ */

const TESTIMONIALS = [
  {
    cat: 'Private Dining',
    q: 'Chef Adex completely transformed our anniversary dinner. The menu felt like it was written for us — because it was.',
    a: 'Tolu & Adaeze',
    r: '10th Anniversary, Ikoyi',
  },
  {
    cat: 'Culinary Student',
    q: 'I went from burning rice to plating dishes I was proud to serve. The classes are patient, structured and genuinely fun.',
    a: 'Chidera O.',
    r: 'Private Class Student',
  },
  {
    cat: 'Restaurant Client',
    q: 'Chef Adex rebuilt our entire menu in three weeks. Food cost came down, guest reviews went up.',
    a: 'Marc E.',
    r: 'General Manager, VI Bistro',
  },
  {
    cat: 'Private Dining',
    q: 'The level of care from first message to final course was exceptional. Guests are still talking about the short rib.',
    a: 'Ifeoma A.',
    r: 'Milestone Birthday, Lekki',
  },
  {
    cat: 'Culinary Student',
    q: 'As a couple we wanted to learn to cook together. Chef Adex tailored every session to us. Worth every minute.',
    a: 'Kunle & Sade',
    r: 'Couples Class',
  },
  {
    cat: 'Restaurant Client',
    q: 'He trained our line cooks for two full weeks. Consistency and presentation are now the strongest part of our kitchen.',
    a: 'Yusuf B.',
    r: 'Executive Chef, Lagos Grill',
  },
]

function Testimonials() {
  const [tab, setTab] = useState<'all' | 'Private Dining' | 'Culinary Student' | 'Restaurant Client'>('all')

  const visible = useMemo(
    () => (tab === 'all' ? TESTIMONIALS : TESTIMONIALS.filter((t) => t.cat === tab)),
    [tab]
  )

  const tabs: { id: 'all' | 'Private Dining' | 'Culinary Student' | 'Restaurant Client'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'Private Dining', label: 'Private Dining' },
    { id: 'Culinary Student', label: 'Students' },
    { id: 'Restaurant Client', label: 'Restaurants' },
  ]

  return (
    <section className="bg-gradient-to-b from-[#050b16] to-[#03060d] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto w-[min(1280px,92vw)]">
        <div className="mb-9 flex flex-col items-center text-center">
          <Eyebrow center>Testimonials</Eyebrow>
          <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
            Can you trust Chef Adex with{' '}
            <em className="not-italic text-[#f0d6a0]">your evening?</em>
          </h2>
        </div>

        <div className="mb-7 flex flex-wrap justify-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full border px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.2em] transition-all duration-500 ${tab === t.id
                  ? 'border-[#d9b26a] bg-[#d9b26a] text-[#03060d]'
                  : 'border-white/15 text-[#8b9cbb] hover:border-[#d9b26a]/40 hover:text-[#d9b26a]'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {visible.map((t, i) => (
            <blockquote
              key={i}
              className="group relative m-0 flex flex-col rounded-sm border border-white/[0.075] bg-gradient-to-b from-[#132648]/30 to-[#03060d]/20 px-6 pb-6 pt-10 transition-all duration-500 hover:-translate-y-1 hover:border-[#d9b26a]/30"
            >
              <span className="absolute left-5 top-1 font-serif text-[4rem] leading-none text-[#a8843f]/40">&ldquo;</span>
              <span className="mb-3 text-[0.56rem] uppercase tracking-[0.22em] text-[#d9b26a]">{t.cat}</span>
              <p className="mb-5 flex-1 font-serif text-[1rem] italic leading-[1.6] text-[#e9eef8]">{t.q}</p>
              <footer className="flex flex-col gap-0.5 border-t border-white/[0.075] pt-4">
                <strong className="font-serif text-[0.95rem] font-medium tracking-[0.02em] text-[#f0d6a0]">{t.a}</strong>
                <span className="text-[0.62rem] uppercase tracking-[0.22em] text-[#63748f]">{t.r}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   How It Works
   ============================================================ */

const STEPS = [
  { n: '01', t: 'Tell Us About Your Experience', d: 'Submit your date, location, number of guests and occasion through the enquiry form or WhatsApp.' },
  { n: '02', t: 'Create Your Experience', d: 'Chef Adex works with you to curate the menu and dining experience — every course, every detail.' },
  { n: '03', t: 'Confirm Your Booking', d: 'Once the details are finalised and the deposit is received, your experience is confirmed.' },
  { n: '04', t: 'Enjoy Your Experience', d: 'Chef Adex takes care of the rest — sourcing, cooking, service and clean-up.' },
]

function HowItWorks() {
  return (
    <section className="bg-[#03060d] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto w-[min(1280px,92vw)]">
        <div className="mb-12 flex flex-col items-center text-center">
          <Eyebrow center>How It Works</Eyebrow>
          <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
            Booking is{' '}
            <em className="not-italic text-[#f0d6a0]">simple.</em>
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="h-full rounded-sm border border-white/[0.075] bg-gradient-to-b from-[#0a1428]/50 to-[#03060d]/30 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#d9b26a]/30">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-serif text-[2rem] leading-none text-[#d9b26a]">{s.n}</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-[#d9b26a]/50 to-transparent" />
                </div>
                <h3 className="mb-2 font-serif text-[1.1rem] leading-snug text-[#e9eef8]">{s.t}</h3>
                <p className="text-[0.82rem] leading-[1.65] text-[#8b9cbb]">{s.d}</p>
              </div>
              {i < STEPS.length - 1 && (
                <span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-[#d9b26a]/40 lg:block">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Locations
   ============================================================ */

function Locations() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#03060d] to-[#050b16] py-[clamp(56px,7vw,96px)]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(217,178,106,0.06), transparent 40%), radial-gradient(circle at 80% 70%, rgba(26,49,96,0.5), transparent 45%)',
        }}
      />
      <div className="relative mx-auto grid w-[min(1280px,92vw)] items-center gap-[clamp(34px,5vw,72px)] lg:grid-cols-2">
        <div>
          <Eyebrow>Service Locations</Eyebrow>
          <h2 className="mb-4 font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
            Private dining across{' '}
            <em className="not-italic text-[#f0d6a0]">Lagos &amp; beyond.</em>
          </h2>
          <GoldRule />
          <p className="max-w-[52ch] text-[0.94rem] leading-[1.8] text-[#8b9cbb]">
            Chef Adex is available for private dining experiences in Lagos and select destinations by request — including Abuja, Port Harcourt, Accra and other cities across West Africa.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {['Lagos', 'Abuja', 'Port Harcourt', 'Accra', 'By Request', 'Destination'].map((c) => (
              <div key={c} className="flex items-center gap-2.5 text-[0.88rem] text-[#8b9cbb]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d9b26a]" />
                {c}
              </div>
            ))}
          </div>

          <div className="mt-7">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-sm border border-[#d9b26a]/35 px-7 py-3.5 text-[0.7rem] uppercase tracking-[0.2em] text-[#d9b26a] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#d9b26a] hover:text-[#03060d]"
            >
              Check Availability in Your City
              <Arrow />
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-white/[0.075] bg-[#0a1428]">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
            alt="Chef Adex in Lagos"
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover brightness-[0.85] saturate-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#03060d]/70 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 rounded-sm border border-[#d9b26a]/30 bg-[rgba(3,6,13,0.85)] px-3.5 py-2 text-[0.6rem] uppercase tracking-[0.22em] text-[#d9b26a] backdrop-blur-md">
            Based in Lagos, Nigeria
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   FAQ
   ============================================================ */

const FAQS = [
  { q: 'How far in advance should I book?', a: 'For private dining we recommend 2–3 weeks in advance, and 4–6 weeks for larger events or peak dates. We do our best to accommodate last-minute requests when the calendar allows.' },
  { q: 'How many guests can you accommodate?', a: 'Intimate dinners for 2 are common, and we comfortably serve seated dinners up to 30 guests and cocktail-style events up to 60 guests with additional support.' },
  { q: 'Do you provide the ingredients?', a: 'Yes. Sourcing, shopping and preparation are all included unless you prefer a specific sourcing arrangement — we will discuss this during the planning stage.' },
  { q: 'Can I request a custom menu?', a: 'Absolutely. Every menu is customised to your preferences, dietary requirements and the occasion. Nothing is off a fixed list.' },
  { q: 'Do you accommodate dietary restrictions?', a: 'Yes — allergies, halal, vegetarian, vegan, gluten-free and other requirements are fully accommodated. Please share them at enquiry.' },
  { q: 'Do you travel outside Lagos?', a: 'Yes. Chef Adex regularly travels for events in Abuja, Port Harcourt and select international destinations. Travel and accommodation are quoted separately.' },
  { q: 'Do you provide table setup and styling?', a: 'Basic plating and service styling is included. Full table styling, rentals and floral are available as an add-on.' },
  { q: 'How do culinary classes work?', a: 'Classes are private and hands-on, tailored to your goals and skill level. They can be held at your home or a partner kitchen, and run from 2 hours to full-day sessions.' },
  { q: 'Can you develop a menu for an existing restaurant?', a: 'Yes. Chef Adex develops new menus, refreshes existing ones and repositions concepts. This includes recipe standardisation and costing.' },
  { q: 'Do you train restaurant kitchen teams?', a: 'Yes — from line cooks to head chefs, on-site training is available on technique, consistency, presentation and service flow.' },
  { q: 'Is a deposit required to secure a booking?', a: 'A 50% deposit secures your date. The balance is due 48 hours before the experience. Deposits are transferable to a new date with at least 7 days notice.' },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-[#03060d] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto w-[min(1280px,92vw)]">
        <div className="mb-10 grid items-end gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
              Questions,{' '}
              <em className="not-italic text-[#f0d6a0]">answered.</em>
            </h2>
          </div>
          <p className="max-w-[58ch] text-[0.94rem] leading-[1.8] text-[#8b9cbb]">
            Everything clients usually ask before booking. If your question isn&apos;t here, message Chef Adex directly on WhatsApp.
          </p>
        </div>

        <div className="mx-auto max-w-[900px] divide-y divide-white/[0.075] border-y border-white/[0.075]">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-5 py-5 text-left transition-colors duration-300"
                >
                  <span
                    className={`font-serif text-[1.02rem] transition-colors duration-300 sm:text-[1.15rem] ${isOpen ? 'text-[#f0d6a0]' : 'text-[#e9eef8]'
                      }`}
                  >
                    {f.q}
                  </span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ${isOpen
                        ? 'rotate-45 border-[#d9b26a] bg-[#d9b26a] text-[#03060d]'
                        : 'border-white/15 text-[#d9b26a]'
                      }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-500 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[70ch] pb-5 pr-10 text-[0.9rem] leading-[1.75] text-[#8b9cbb]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Enquiry Form
   ============================================================ */

type ServiceKey = 'private' | 'class' | 'consulting'

const SERVICE_TABS: { id: ServiceKey; label: string }[] = [
  { id: 'private', label: 'Private Dining' },
  { id: 'class', label: 'Culinary Class' },
  { id: 'consulting', label: 'Restaurant Consulting' },
]

function EnquiryForm() {
  const [service, setService] = useState<ServiceKey>('private')
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const inputCls =
    'w-full border-b border-white/[0.075] bg-transparent px-1 py-3 font-serif text-[0.98rem] text-[#e9eef8] transition-colors focus:border-[#d9b26a] focus:outline-none placeholder:font-sans placeholder:text-[0.85rem] placeholder:text-[#63748f]'
  const selectCls = inputCls + ' appearance-none'

  return (
    <section id="contact" className="bg-gradient-to-b from-[#050b16] to-[#03060d] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto w-[min(1280px,92vw)]">
        <div className="mb-9 flex flex-col items-center text-center">
          <Eyebrow center>Enquire</Eyebrow>
          <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] tracking-[-0.01em]">
            How can Chef Adex{' '}
            <em className="not-italic text-[#f0d6a0]">work with you?</em>
          </h2>
          <p className="mt-4 max-w-[58ch] text-[0.94rem] leading-[1.8] text-[#8b9cbb]">
            Choose the service that fits. The form adapts to what you need — and you can always reach Chef Adex directly on WhatsApp.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[0.9fr_1.4fr] lg:gap-11">
          <div>
            <ul className="space-y-3">
              {[
                ['Response time', 'Within 1 business day'],
                ['WhatsApp', '+234 800 000 0000'],
                ['Email', 'hello@chefadex.com'],
                ['Based in', 'Lagos, Nigeria'],
              ].map(([label, value]) => (
                <li key={label} className="rounded-sm border border-white/[0.075] bg-gradient-to-b from-[#0a1428]/50 to-[#03060d]/20 p-4">
                  <span className="mb-0.5 block text-[0.56rem] uppercase tracking-[0.26em] text-[#63748f]">{label}</span>
                  <span className="font-serif text-[1rem] text-[#e9eef8]">{value}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://wa.me/2348000000000?text=Hi%20Chef%20Adex%2C%20I%27d%20like%20to%20enquire."
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 flex items-center justify-center gap-2.5 rounded-sm bg-[#25D366] px-5 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white shadow-[0_12px_34px_-14px_rgba(37,211,102,0.65)] transition-all duration-500 hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Message on WhatsApp
            </a>

            <p className="mt-5 text-[0.78rem] leading-relaxed text-[#63748f]">
              Prefer to skip the form? WhatsApp is the fastest way to reach Chef Adex directly — voice notes welcome.
            </p>
          </div>

          <div className="rounded-sm border border-white/[0.075] bg-gradient-to-b from-[#132648]/35 to-[#03060d]/30 p-6 sm:p-9">
            {sent ? (
              <div className="py-10 text-center">
                <span className="mb-5 inline-grid h-12 w-12 place-items-center rounded-full border border-[#d9b26a]/30 bg-[#d9b26a]/10 text-[1.2rem] text-[#d9b26a]">✓</span>
                <h3 className="mb-2 font-serif text-[1.7rem] text-[#f0d6a0]">Thank you.</h3>
                <p className="mx-auto max-w-[42ch] text-[0.9rem] leading-[1.7] text-[#8b9cbb]">
                  Your request has been received. Chef Adex or the team will reply within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="mb-7 flex flex-wrap gap-2">
                  {SERVICE_TABS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setService(t.id)}
                      className={`rounded-full border px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] transition-all duration-500 ${service === t.id
                          ? 'border-[#d9b26a] bg-[#d9b26a] text-[#03060d]'
                          : 'border-white/15 text-[#8b9cbb] hover:border-[#d9b26a]/40 hover:text-[#d9b26a]'
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {service === 'private' && (
                  <>
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Full Name"><input required type="text" placeholder="Your name" className={inputCls} /></Field>
                      <Field label="Email"><input required type="email" placeholder="you@email.com" className={inputCls} /></Field>
                    </div>
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Phone / WhatsApp"><input required type="tel" placeholder="+234…" className={inputCls} /></Field>
                      <Field label="Event Date"><input required type="date" className={inputCls} /></Field>
                    </div>
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Location"><input required type="text" placeholder="City / venue" className={inputCls} /></Field>
                      <Field label="Number of Guests"><input required type="number" min={1} placeholder="e.g. 6" className={inputCls} /></Field>
                    </div>
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Occasion">
                        <select required defaultValue="" className={selectCls}>
                          <option value="" disabled>Select</option>
                          <option>Romantic dinner</option>
                          <option>Birthday</option>
                          <option>Anniversary</option>
                          <option>Proposal</option>
                          <option>Special celebration</option>
                          <option>Corporate dinner</option>
                          <option>Other</option>
                        </select>
                      </Field>
                      <Field label="Preferred Experience">
                        <select required defaultValue="" className={selectCls}>
                          <option value="" disabled>Select</option>
                          <option>The Intimate Experience</option>
                          <option>The Celebration Experience</option>
                          <option>The Signature Experience</option>
                          <option>The Bespoke Experience</option>
                          <option>Not sure yet</option>
                        </select>
                      </Field>
                    </div>
                    <Field label="Dietary Requirements" className="mb-4">
                      <input type="text" placeholder="Allergies, halal, vegan…" className={inputCls} />
                    </Field>
                    <Field label="Additional Information" className="mb-6">
                      <textarea rows={3} placeholder="Anything else we should know?" className={inputCls + ' resize-y'} />
                    </Field>
                  </>
                )}

                {service === 'class' && (
                  <>
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Full Name"><input required type="text" placeholder="Your name" className={inputCls} /></Field>
                      <Field label="Email"><input required type="email" placeholder="you@email.com" className={inputCls} /></Field>
                    </div>
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Preferred Date"><input required type="date" className={inputCls} /></Field>
                      <Field label="Number of Participants"><input required type="number" min={1} placeholder="e.g. 2" className={inputCls} /></Field>
                    </div>
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Cuisine / Skill of Interest">
                        <select required defaultValue="" className={selectCls}>
                          <option value="" disabled>Select</option>
                          <option>West African classics</option>
                          <option>French technique</option>
                          <option>Pastry & desserts</option>
                          <option>Knife skills</option>
                          <option>Plating & presentation</option>
                          <option>Complete beginner</option>
                          <option>Other</option>
                        </select>
                      </Field>
                      <Field label="Location"><input required type="text" placeholder="City / preferred kitchen" className={inputCls} /></Field>
                    </div>
                    <Field label="Additional Information" className="mb-6">
                      <textarea rows={3} placeholder="Goals, allergies, occasion…" className={inputCls + ' resize-y'} />
                    </Field>
                  </>
                )}

                {service === 'consulting' && (
                  <>
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Restaurant / Business"><input required type="text" placeholder="e.g. VI Bistro" className={inputCls} /></Field>
                      <Field label="Contact Name"><input required type="text" placeholder="Your name" className={inputCls} /></Field>
                    </div>
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Email"><input required type="email" placeholder="you@business.com" className={inputCls} /></Field>
                      <Field label="Location"><input required type="text" placeholder="City" className={inputCls} /></Field>
                    </div>
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Type of Restaurant">
                        <select required defaultValue="" className={selectCls}>
                          <option value="" disabled>Select</option>
                          <option>Fine dining</option>
                          <option>Casual dining</option>
                          <option>Bistro / cafe</option>
                          <option>Hotel restaurant</option>
                          <option>Cloud kitchen</option>
                          <option>Other</option>
                        </select>
                      </Field>
                      <Field label="Desired Timeline"><input type="text" placeholder="e.g. Next 6 weeks" className={inputCls} /></Field>
                    </div>
                    <Field label="Current Concept" className="mb-4">
                      <input type="text" placeholder="Brief description of your current concept" className={inputCls} />
                    </Field>
                    <Field label="Services Required" className="mb-4">
                      <select required defaultValue="" className={selectCls}>
                        <option value="" disabled>Select</option>
                        <option>New menu development</option>
                        <option>Menu refresh</option>
                        <option>Full consulting</option>
                        <option>Kitchen training</option>
                        <option>Combination</option>
                      </select>
                    </Field>
                    <Field label="Additional Information" className="mb-6">
                      <textarea rows={3} placeholder="Goals, budget range, current challenges…" className={inputCls + ' resize-y'} />
                    </Field>
                  </>
                )}

                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-gradient-to-br from-[#d9b26a] to-[#a8843f] px-7 py-3.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#03060d] shadow-[0_10px_34px_-12px_rgba(217,178,106,0.55)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_46px_-14px_rgba(217,178,106,0.72)]"
                >
                  {service === 'consulting' ? 'Request a Consultation' : 'Request Your Experience'}
                  <Arrow />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[0.58rem] uppercase tracking-[0.24em] text-[#63748f]">{label}</span>
      {children}
    </label>
  )
}

/* ============================================================
   Footer
   ============================================================ */

function Footer() {
  return (
    <footer className="border-t border-white/[0.075] bg-[#03060d] pb-6 pt-14">
      <div className="mx-auto grid w-[min(1280px,92vw)] gap-8 pb-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <div className="mb-4 flex items-center gap-3 font-serif text-[1.2rem] tracking-[0.06em]">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[#d9b26a]/30 text-[0.75rem] text-[#d9b26a]">CA</span>
            <span className="flex flex-col">
              Chef Adex
              <small className="mt-0.5 font-sans text-[0.5rem] font-normal uppercase tracking-[0.32em] text-[#63748f]">
                Private Chef · Lagos
              </small>
            </span>
          </div>
          <p className="max-w-[34ch] text-[0.85rem] leading-[1.75] text-[#63748f]">
            Restaurant-quality private dining, culinary classes and menu curation — created around you.
          </p>
          <div className="mt-5 flex gap-2.5">
            {['Instagram', 'YouTube', 'TikTok'].map((s) => (
              <a
                key={s}
                href="#"
                aria-label={s}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.075] text-[0.56rem] uppercase tracking-wider text-[#8b9cbb] transition-all duration-500 hover:border-[#d9b26a] hover:text-[#d9b26a]"
              >
                {s[0]}
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Explore">
          {[
            ['About', '#about'],
            ['Services', '#services'],
            ['Menus', '#menus'],
            ['Experiences', '#experiences'],
            ['Portfolio', '#portfolio'],
          ].map(([t, h]) => (
            <li key={t}>
              <a href={h} className="font-serif text-[0.95rem] text-[#8b9cbb] transition-colors hover:text-[#d9b26a]">{t}</a>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Services">
          {[
            ['Private Dining', '#private-dining'],
            ['Culinary Classes', '#culinary-classes'],
            ['Menu Curation', '#menu-curation'],
            ['Consulting', '#menu-curation'],
          ].map(([t, h]) => (
            <li key={t}>
              <a href={h} className="font-serif text-[0.95rem] text-[#8b9cbb] transition-colors hover:text-[#d9b26a]">{t}</a>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact">
          <li className="font-serif text-[0.95rem] text-[#8b9cbb]">hello@chefadex.com</li>
          <li className="font-serif text-[0.95rem] text-[#8b9cbb]">+234 800 000 0000</li>
          <li className="font-serif text-[0.95rem] text-[#8b9cbb]">Lagos, Nigeria</li>
          <li>
            <a href="#contact" className="font-serif text-[0.95rem] text-[#d9b26a] transition-colors hover:text-[#f0d6a0]">
              Book an Experience →
            </a>
          </li>
        </FooterColumn>
      </div>

      <div className="mx-auto flex w-[min(1280px,92vw)] flex-wrap justify-between gap-4 border-t border-white/[0.075] pt-6 text-[0.7rem] tracking-[0.06em] text-[#63748f]">
        <span>© {new Date().getFullYear()} Chef Adex. All rights reserved.</span>
        <span>Lagos · Abuja · Accra · By request</span>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 font-sans text-[0.62rem] font-medium uppercase tracking-[0.26em] text-[#63748f]">{title}</h4>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  )
}

/* ============================================================
   Page
   ============================================================ */

export default function Home() {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100
      setProgress(p)

      const ids = ['home', 'intro', 'about', 'services', 'menus', 'experiences', 'portfolio', 'contact']
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top < 220 && top > -el.offsetHeight + 220) {
          setActive(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div
        className="fixed left-0 top-0 z-[2000] h-[2px] bg-gradient-to-r from-[#a8843f] to-[#f0d6a0] shadow-[0_0_14px_rgba(217,178,106,0.6)] transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />

      <Nav active={active} />
      <WhatsAppFloat />

      <main>
        <Hero />
        <Marquee />
        <Intro />
        <About />
        <Services />
        <Menus />
        <Experiences />
        <Occasions />
        <Portfolio />
        <Testimonials />
        <HowItWorks />
        <Locations />
        <FAQ />
        <EnquiryForm />
      </main>

      <Footer />
    </>
  )
}