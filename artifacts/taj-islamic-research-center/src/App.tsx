import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Facebook,
  GraduationCap,
  Instagram,
  Library,
  Linkedin,
  Menu,
  Newspaper,
  Presentation,
  Search,
  Target,
  Users,
  X,
  Youtube,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  {
    label: 'About Us',
    href: '#about',
    children: [
      { label: 'Our Vision & Mission', href: '#vision-mission' },
      { label: 'Advisory Board', href: '#advisory-board' },
      { label: 'Our Team', href: '#our-team' },
      { label: 'Our Researchers', href: '#research' },
    ],
  },
  {
    label: 'Our Programs',
    href: '#programs',
    children: [
      {
        label: 'Youth Empowerment Programs',
        href: '#programs',
        children: [
          { label: 'Youth Leadership Camp', href: '#programs' },
          { label: 'Study Circles', href: '#programs' },
          { label: 'Exam Preparation', href: '#programs' },
          { label: 'Competitions', href: '#programs' },
          { label: 'Diversity Tours', href: '#programs' },
        ],
      },
      {
        label: 'Short Courses',
        href: '#programs',
        children: [
          { label: 'Saylani Mass I.T. Training', href: '#programs' },
          { label: 'Religious Courses', href: '#programs' },
          { label: 'Languages', href: '#programs' },
        ],
      },
      { label: 'Seminar & Workshops', href: '#programs' },
    ],
  },
  {
    label: 'Research & Publications',
    href: '#research',
    children: [
      { label: 'Books', href: '#research', children: [{ label: 'Year 2025', href: '#research' }] },
      { label: 'Taj Magazine', href: '#research', children: [{ label: 'Year 2026', href: '#research' }] },
      {
        label: 'Taj Islamicus Journal',
        href: '#research',
        children: [
          { label: 'Year 2027', href: '#research' },
          { label: 'Year 2028', href: '#research' },
        ],
      },
    ],
  },
  { label: 'E-Library', href: '#research' },
  { label: 'Events', href: '#programs' },
  {
    label: 'Impact',
    href: '#impact',
    children: [
      { label: 'Alumni Spotlight', href: '#impact' },
      {
        label: 'Opportunities',
        href: '#impact',
        children: [
          { label: 'Volunteer Opportunities', href: '#impact' },
          { label: 'Collaboration', href: '#impact' },
          { label: 'Internship', href: '#impact' },
        ],
      },
      { label: 'Student Success Stories', href: '#impact' },
    ],
  },
  {
    label: 'Media',
    href: '#media',
    children: [
      { label: 'Gallery', href: '#media' },
      { label: 'Videos', href: '#media' },
    ],
  },
  { label: 'Contact Us', href: '#contact' },
];

const socials = [
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
];

const aboutCards = [
  { id: 'vision-mission', title: 'Our Vision', image: '/original-assets/image_1787473586930.png', icon: Target },
  { id: 'mission', title: 'Our Mission', image: '/original-assets/image_1787473593354.png', icon: Search },
  { id: 'advisory-board', title: 'Advisory Board', image: '/original-assets/image_1787473599431.png', icon: Users },
  { id: 'our-team', title: 'Our Team', image: '/original-assets/image_1787473607185.png', icon: GraduationCap },
];

const programCards = [
  { title: 'Research & Publications', image: '/original-assets/image_1787473617665.png', icon: BookMarked },
  { title: 'Seminars & Workshops', image: '/original-assets/image_1787473625400.png', icon: Presentation },
  { title: 'Youth Empowerment', image: '/original-assets/image_1787473645668.png', icon: Users },
  { title: 'Short Courses', image: '/original-assets/image_1787473656116.png', icon: GraduationCap },
];

const researchCards = [
  { title: 'Books', icon: BookOpen },
  { title: 'E-Library', icon: Library },
  { title: 'Taj Magazine', icon: Newspaper },
  { title: 'Taj Islamicus Journal', icon: BookMarked },
];

function scrollToHash(href: string | undefined, close?: () => void) {
  if (!href) return;
  close?.();
  const target = document.querySelector(href);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-2.5'}`}>
      {socials.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          data-testid={`link-social-${label.toLowerCase()}`}
          className={`group flex items-center justify-center border border-[hsl(var(--foreground)/.14)] text-[hsl(var(--foreground)/.75)] transition-colors hover:border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))] ${compact ? 'h-8 w-8' : 'h-9 w-9'}`}
        >
          <Icon size={compact ? 14 : 15} strokeWidth={1.8} />
        </a>
      ))}
    </div>
  );
}

function DesktopMenuItem({
  item,
  activeMenu,
  setActiveMenu,
  activeSection,
}: {
  item: NavItem;
  activeMenu: string | null;
  setActiveMenu: (label: string | null) => void;
  activeSection: string;
}) {
  const hasChildren = Boolean(item.children?.length);
  const open = activeMenu === item.label;
  const active = item.href === `#${activeSection}`;
  return (
    <div
      className="relative"
      onMouseEnter={() => hasChildren && setActiveMenu(item.label)}
      onMouseLeave={() => hasChildren && setActiveMenu(null)}
    >
      <button
        type="button"
        data-testid={`button-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
        aria-expanded={hasChildren ? open : undefined}
        onClick={() => (hasChildren ? setActiveMenu(open ? null : item.label) : scrollToHash(item.href))}
        className={`flex items-center gap-1 px-2.5 py-3 text-[11px] font-semibold tracking-[.01em] transition-colors ${open || active ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--foreground)/.82)] hover:text-[hsl(var(--primary))]'}`}
      >
        {item.label}
        {hasChildren && <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>
      {hasChildren && open && (
        <div className="absolute left-0 top-full z-30 flex min-w-[222px] border border-[hsl(var(--secondary)/.75)] bg-[hsl(var(--accent))] shadow-[0_18px_30px_rgba(20,52,40,.18)]">
          <div className="min-w-[222px] py-1.5">
            {item.children?.map((child) => (
              <DesktopSubItem key={child.label} item={child} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DesktopSubItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(item.children?.length);
  return (
    <div className="relative" onMouseEnter={() => hasChildren && setOpen(true)} onMouseLeave={() => hasChildren && setOpen(false)}>
      <button
        type="button"
        data-testid={`button-subnav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
        onClick={() => (hasChildren ? setOpen(!open) : scrollToHash(item.href))}
        className="flex min-h-9 w-full items-center justify-between border-b border-[hsl(var(--primary-foreground)/.2)] px-3 py-2 text-left font-display text-[13px] leading-tight text-[hsl(var(--foreground))] transition-colors last:border-b-0 hover:bg-[hsl(var(--secondary))]"
      >
        <span>{item.label}</span>
        {hasChildren && <ChevronRight size={14} />}
      </button>
      {hasChildren && open && (
        <div className="absolute left-full top-0 min-w-[190px] border border-[hsl(var(--secondary)/.75)] bg-[hsl(var(--accent))] py-1.5 shadow-[0_18px_30px_rgba(20,52,40,.18)]">
          {item.children?.map((child) => (
            <button
              type="button"
              key={child.label}
              data-testid={`button-subnav-${child.label.toLowerCase().replaceAll(' ', '-')}`}
              onClick={() => scrollToHash(child.href)}
              className="block min-h-9 w-full border-b border-[hsl(var(--primary-foreground)/.2)] px-3 py-2 text-left font-display text-[13px] text-[hsl(var(--foreground))] last:border-0 hover:bg-[hsl(var(--secondary))]"
            >
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileMenuItem({ item, close }: { item: NavItem; close: () => void }) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(item.children?.length);
  return (
    <div className="border-b border-[hsl(var(--sidebar-border))]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          data-testid={`button-mobile-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
          onClick={() => (hasChildren ? setOpen(!open) : scrollToHash(item.href, close))}
          className="flex-1 py-3 text-left text-sm font-semibold text-[hsl(var(--sidebar-foreground))]"
        >
          {item.label}
        </button>
        {hasChildren && (
          <button type="button" aria-label={`Toggle ${item.label}`} onClick={() => setOpen(!open)} className="p-3 text-[hsl(var(--sidebar-foreground)/.65)]">
            <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {hasChildren && open && (
        <div className="mb-2 border-l border-[hsl(var(--secondary))] pl-3">
          {item.children?.map((child) => (
            <MobileMenuItem key={child.label} item={child} close={close} />
          ))}
        </div>
      )}
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setActiveMenu(null);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    const sections = ['home', 'about', 'programs', 'research', 'impact', 'media', 'contact']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-26% 0px -58% 0px', threshold: [0.05, 0.25, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={headerRef} className="nav-shadow sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.96)] backdrop-blur-md">
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center px-5 sm:px-8 lg:px-10">
        <button type="button" onClick={() => scrollToHash('#home')} aria-label="Taj Islamic Research Center home" data-testid="button-logo-home" className="group mr-auto flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden bg-[hsl(var(--sidebar))] ring-1 ring-[hsl(var(--accent)/.65)]">
            <img src="/original-assets/image_1787473574802.png" alt="Taj Islamic Research Center" className="h-full w-full object-cover" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block font-display text-[15px] leading-none text-[hsl(var(--primary))]">Taj Islamic</span>
            <span className="mt-1 block font-mono-ui text-[8px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Research Center</span>
          </span>
        </button>

        <nav className="hidden items-center lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <DesktopMenuItem key={item.label} item={item} activeMenu={activeMenu} setActiveMenu={setActiveMenu} activeSection={activeSection} />
          ))}
        </nav>
        <div className="ml-3 hidden xl:block">
          <SocialLinks compact />
        </div>
        <button
          type="button"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          data-testid="button-mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ml-4 flex h-10 w-10 items-center justify-center border border-[hsl(var(--border))] text-[hsl(var(--primary))] lg:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="border-t border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] px-6 pb-6 pt-2 lg:hidden">
          {navItems.map((item) => (
            <MobileMenuItem key={item.label} item={item} close={() => setMobileOpen(false)} />
          ))}
          <div className="pt-5"><SocialLinks /></div>
        </div>
      )}
    </header>
  );
}

function SectionHeading({ title, id, subtitle }: { title: string; id?: string; subtitle?: string }) {
  return (
    <div className="section-rule mx-auto max-w-3xl text-center">
      <h2 id={id} className="font-display text-4xl leading-[1.05] text-[hsl(var(--primary))] sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-sm leading-7 text-[hsl(var(--muted-foreground))] sm:text-base">{subtitle}</p>}
    </div>
  );
}

function Home() {
  return (
    <div className="tirc-page tirc-noise min-h-[100dvh]">
      <Header />
      <main>
        <section id="home" className="relative isolate bg-[hsl(var(--sidebar))]">
          <div className="absolute inset-0 -z-10 soft-grid opacity-25" />
          <div className="mx-auto grid max-w-[1440px] items-stretch lg:grid-cols-[.9fr_1.1fr]">
            <div className="flex min-h-[570px] flex-col justify-center px-6 py-20 sm:px-12 lg:min-h-[625px] lg:px-16 xl:px-24">
              <div className="reveal flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.24em] text-[hsl(var(--secondary))]">
                <span className="h-px w-8 bg-[hsl(var(--secondary))]" />
                TIRC
              </div>
              <h1 className="reveal reveal-delay-1 mt-7 max-w-2xl font-display text-5xl leading-[.98] text-[hsl(var(--sidebar-foreground))] sm:text-6xl xl:text-7xl">
                Welcome to Taj Islamic Research Center <span className="text-[hsl(var(--secondary))]">(TIRC)</span>
              </h1>
              <p className="reveal reveal-delay-2 mt-8 max-w-xl text-[15px] leading-8 text-[hsl(var(--sidebar-foreground)/.73)]">
                The Taj Islamic Research Centre (TIRC) is dedicated to fostering unity, intellectual growth, and social harmony in Pakistan. Guided by our vision of bridging divides between diverse schools of thought, we create research-driven educational initiatives that promote understanding, reduce sectarian conflicts, and empower youth. Through inclusive community service, dialogue, and cultural exchange, TIRC aims to cultivate a tolerant and peaceful society, while providing platforms for open discourse and knowledge dissemination.
              </p>
              <button
                type="button"
                onClick={() => scrollToHash('#about')}
                data-testid="button-explore-about"
                className="reveal reveal-delay-3 mt-10 flex w-fit items-center gap-4 border-b border-[hsl(var(--secondary))] pb-2 text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--secondary))] transition-[gap] hover:gap-6"
              >
                About Us <ArrowDown size={15} />
              </button>
            </div>
            <div className="relative min-h-[440px] overflow-hidden bg-[hsl(var(--primary))] lg:min-h-[625px]">
              <div className="absolute inset-0 bg-[hsl(var(--primary)/.2)]" />
              <div className="absolute left-7 top-7 z-10 h-20 w-20 border-l border-t border-[hsl(var(--secondary)/.7)] sm:left-12 sm:top-12 sm:h-28 sm:w-28" />
              <div className="absolute bottom-7 right-7 z-10 h-20 w-20 border-b border-r border-[hsl(var(--secondary)/.7)] sm:bottom-12 sm:right-12 sm:h-28 sm:w-28" />
              <img src="/original-assets/image_1787473580327.png" alt="Taj Islamic Research Center community" className="h-full w-full object-cover object-center opacity-95" />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--sidebar)/.78)] via-transparent to-[hsl(var(--primary)/.12)]" />
              <div className="absolute bottom-10 left-8 right-8 flex items-end justify-between sm:bottom-14 sm:left-14 sm:right-14">
                <span className="font-mono-ui text-[10px] uppercase tracking-[.22em] text-[hsl(var(--sidebar-foreground)/.7)]">Taj Islamic Research Center</span>
                <span className="h-2 w-2 bg-[hsl(var(--secondary))]" />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-[hsl(var(--background))] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1240px]">
            <SectionHeading title="About Us" subtitle="We empower individuals through knowledge, faith, and unity, fostering growth for a brighter future" />
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {aboutCards.map(({ id, title, image, icon: Icon }, index) => (
                <article key={title} id={id} className={`group relative ${index % 2 ? 'lg:translate-y-8' : ''}`}>
                  <div className="relative aspect-[1.06] overflow-hidden bg-[hsl(var(--muted))]">
                    <img src={image} alt={title} className="h-full w-full object-cover grayscale-[.1] transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--sidebar)/.76)] via-transparent to-transparent opacity-80" />
                    <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]"><Icon size={17} strokeWidth={1.6} /></div>
                  </div>
                  <div className="flex items-center justify-between border-b border-[hsl(var(--border))] py-5">
                    <h3 className="font-display text-lg text-[hsl(var(--primary))]">{title}</h3>
                    <button type="button" onClick={() => scrollToHash('#contact')} data-testid={`button-read-more-${title.toLowerCase().replaceAll(' ', '-')}`} className="group/button flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--primary))]">
                      Read More <ArrowUpRight size={13} className="transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="programs" className="border-y border-[hsl(var(--border))] bg-[hsl(var(--muted)/.42)] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1240px]">
            <SectionHeading title="Our Programs" subtitle="Explore our diverse programs designed to enlighten, empower, and enrich—rooted in tradition yet crafted for the modern world, each offering provides a unique path to knowledge and personal growth." />
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {programCards.map(({ title, image, icon: Icon }, index) => (
                <button type="button" key={title} onClick={() => scrollToHash('#research')} data-testid={`card-program-${index}`} className="group relative overflow-hidden bg-[hsl(var(--card))] text-left transition-transform duration-300 hover:-translate-y-1">
                  <div className="aspect-[1.42] overflow-hidden">
                    <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex items-center gap-3 px-5 py-5">
                    <span className="flex h-8 w-8 items-center justify-center bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><Icon size={15} /></span>
                    <span className="font-display text-base text-[hsl(var(--primary))]">{title}</span>
                    <ArrowUpRight size={15} className="ml-auto text-[hsl(var(--muted-foreground))] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="research" className="bg-[hsl(var(--background))] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1240px]">
            <SectionHeading title="Research & Publications" subtitle="Our Research & Publications reflect a commitment to advancing knowledge, fostering innovation, and addressing contemporary challenges through rigorous analysis and impactful dissemination." />
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {researchCards.map(({ title, icon: Icon }, index) => (
                <button type="button" key={title} onClick={() => scrollToHash('#contact')} data-testid={`card-research-${index}`} className="group relative flex min-h-[190px] flex-col justify-between border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-left transition-colors hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                  <span className="flex h-11 w-11 items-center justify-center border border-[hsl(var(--accent))] text-[hsl(var(--primary))] transition-colors group-hover:text-[hsl(var(--secondary))]"><Icon size={20} strokeWidth={1.5} /></span>
                  <span className="flex items-end justify-between gap-3 font-display text-xl text-[hsl(var(--primary))] group-hover:text-[hsl(var(--primary-foreground))]">
                    {title}
                    <ArrowUpRight size={17} className="mb-1 shrink-0 text-[hsl(var(--accent))]" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="bg-[hsl(var(--primary))] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <div className="mb-6 h-px w-10 bg-[hsl(var(--secondary))]" />
              <h2 className="font-display text-4xl text-[hsl(var(--primary-foreground))] sm:text-5xl">Our Partners</h2>
            </div>
            <div className="overflow-hidden border border-[hsl(var(--primary-foreground)/.2)] bg-[hsl(var(--primary-foreground)/.96)] p-5 sm:p-8">
              <img src="/reference-assets/partners.png" alt="Our Partners" className="h-auto w-full object-contain mix-blend-multiply" />
            </div>
          </div>
        </section>

        <section id="media" className="bg-[hsl(var(--muted)/.5)] px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-6 border-l-2 border-[hsl(var(--accent))] pl-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-2xl text-[hsl(var(--primary))]">Media</p>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Gallery · Videos</p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => scrollToHash('#media')} data-testid="button-view-gallery" className="flex items-center gap-3 border border-[hsl(var(--primary))] px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]">
                Gallery <ArrowUpRight size={15} />
              </button>
              <button type="button" onClick={() => scrollToHash('#media')} data-testid="button-view-videos" className="flex items-center gap-3 border border-[hsl(var(--primary))] px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]">
                Videos <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-[hsl(var(--sidebar))] px-5 pb-8 pt-16 text-[hsl(var(--sidebar-foreground))] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-12 border-b border-[hsl(var(--sidebar-border))] pb-14 lg:grid-cols-[1.1fr_.9fr_.7fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src="/original-assets/image_1787473574802.png" alt="Taj Islamic Research Center" className="h-12 w-12 object-cover ring-1 ring-[hsl(var(--secondary)/.6)]" />
                <h2 className="font-display text-2xl text-[hsl(var(--sidebar-foreground))]">Contact Us</h2>
              </div>
              <p className="mt-6 max-w-sm font-mono-ui text-[10px] uppercase leading-6 tracking-[.16em] text-[hsl(var(--sidebar-foreground)/.55)]">Taj Islamic Research Center</p>
            </div>
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[hsl(var(--secondary))]">Our Programs</p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-[hsl(var(--sidebar-foreground)/.72)]">
                <button type="button" onClick={() => scrollToHash('#programs')} data-testid="footer-link-programs" className="w-fit hover:text-[hsl(var(--secondary))]">Youth Empowerment</button>
                <button type="button" onClick={() => scrollToHash('#programs')} data-testid="footer-link-courses" className="w-fit hover:text-[hsl(var(--secondary))]">Short Courses</button>
                <button type="button" onClick={() => scrollToHash('#research')} data-testid="footer-link-publications" className="w-fit hover:text-[hsl(var(--secondary))]">Research & Publications</button>
              </div>
            </div>
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[hsl(var(--secondary))]">Social Links</p>
              <div className="mt-5"><SocialLinks /></div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 pt-7 text-[11px] text-[hsl(var(--sidebar-foreground)/.5)] sm:flex-row">
            <span>Copyright © 2025 | Powered by Taj Islamic Research Center</span>
            <button type="button" onClick={() => scrollToHash('#home')} data-testid="button-back-to-top" className="flex items-center gap-2 self-start font-mono-ui uppercase tracking-[.16em] transition-colors hover:text-[hsl(var(--secondary))] sm:self-auto">Top <ArrowDown size={13} className="rotate-180" /></button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;