'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgePercent, Calculator, MessageCircle, Send, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  kits,
  materialCategories,
  photoClasses,
  products,
  projects,
} from './data/site';
import { dictionary, localeNames, locales, type Locale } from './data/i18n';

type NavItem = {
  label: string;
  href: string;
  index: string;
};

type CategoryCopy = {
  title: string;
  text: string;
  bullets: string[];
};

type CatalogCardLabels = {
  location: string;
  price: string;
  add: string;
};

const navLinks = ['#services', '#approach', '#materials', '#projects', '#contact'] as const;

function useSectionMotion() {
  useEffect(() => {
    const motionSections = Array.from(document.querySelectorAll<HTMLElement>('[data-motion-section]'));
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    let lastScrollY = window.scrollY;
    let frame = 0;

    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      document.documentElement.style.setProperty('--scroll-progress', `${progress * 100}%`);
      document.documentElement.dataset.scrollDirection = window.scrollY >= lastScrollY ? 'down' : 'up';
      lastScrollY = window.scrollY;
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollState);
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-active-section', entry.isIntersecting);
          if (entry.isIntersecting) entry.target.classList.add('has-entered');
        });
      },
      { rootMargin: '-18% 0px -28%', threshold: 0.18 },
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12%', threshold: 0.1 },
    );

    motionSections.forEach((section) => sectionObserver.observe(section));
    revealItems.forEach((item) => revealObserver.observe(item));
    updateScrollState();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      sectionObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);
}

function scrollToId(id: string) {
  if (typeof window === 'undefined') return;
  const target = document.querySelector(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  window.location.href = `/${id}`;
}

function getCatalogSlugFromPath() {
  if (typeof window === 'undefined') return null;
  if (!window.location.pathname.startsWith('/catalog')) return null;
  const slug = window.location.pathname.replace(/^\/catalog\/?/, '');
  return slug ? decodeURIComponent(slug) : 'all';
}

function Header({
  locale,
  onLocaleChange,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const [time, setTime] = useState('');
  const content = dictionary[locale];

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : locale === 'kk' ? 'kk-KZ' : 'ru-RU', {
          timeZone: 'Asia/Almaty',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
      );
    };
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, [locale]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 grid grid-cols-[1fr_auto_1fr] items-start px-7 pt-7 md:items-center md:px-12">
      <Link className="pointer-events-auto text-[22px] font-black tracking-[-.04em] text-white mix-blend-difference" href="/#home">
        ALMABUILD PRO
      </Link>
      <div className="pointer-events-auto col-span-2 mt-4 flex flex-wrap items-center justify-end gap-x-4 gap-y-2 justify-self-end text-xs font-black text-white mix-blend-difference md:col-span-1 md:mt-0 md:justify-self-center">
        <span className="hidden md:inline">{content.timeLabel}: {time}, ALMATY</span>
        <div className="flex items-center gap-2" aria-label="Language">
          {locales.map((item) => (
            <button
              key={item}
              type="button"
              className={[
                'min-h-7 px-1 text-xs font-black transition',
                locale === item ? 'text-orange' : 'text-white/72 hover:text-white',
              ].join(' ')}
              onClick={() => onLocaleChange(item)}
            >
              {localeNames[item]}
            </button>
          ))}
        </div>
      </div>
      <div />
    </header>
  );
}

function ScrollProgress() {
  return (
    <div className="scroll-progress" aria-hidden="true">
      <span />
    </div>
  );
}

function SceneLayer({ photo, dark = false }: { photo: keyof typeof photoClasses; dark?: boolean }) {
  return (
    <>
      <div
        className={`scene-photo ${dark ? 'scene-photo-dark' : ''} ${photoClasses[photo]}`}
        aria-hidden="true"
      />
      <div className={`scene-overlay ${dark ? 'scene-overlay-dark' : ''}`} aria-hidden="true" />
    </>
  );
}

function MaskedTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1 className={`title-mask ${className}`}>
      <span>{children}</span>
    </h1>
  );
}

function SideNav({ navItems }: { navItems: NavItem[] }) {
  const [active, setActive] = useState('#services');

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { threshold: 0.45 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navItems]);

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-40 flex gap-2 overflow-x-auto rounded-xl bg-paper/80 p-1 backdrop-blur md:left-auto md:right-12 md:top-12 md:bottom-auto md:grid md:w-40 md:bg-transparent md:p-0">
      {navItems.map((item) => (
        <a
          key={item.href}
          href={`/${item.href}`}
          onClick={(event) => {
            event.preventDefault();
            scrollToId(item.href);
          }}
          className={[
            'grid min-h-12 min-w-[132px] grid-cols-[1fr_auto] items-center gap-4 rounded-lg px-3 text-sm font-black text-white shadow-brutal transition md:min-h-9 md:min-w-0',
            active === item.href ? 'bg-ink' : 'bg-pill hover:bg-ink',
          ].join(' ')}
        >
          <span>{item.label}</span>
          <b className="text-xs">{`[${item.index}]`}</b>
        </a>
      ))}
    </nav>
  );
}

function Section({
  id,
  className = '',
  scene,
  children,
}: {
  id: string;
  className?: string;
  scene?: keyof typeof photoClasses;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-motion-section
      className={`motion-section screen flex flex-col justify-center bg-porcelain px-6 py-24 md:px-12 lg:pr-[230px] ${scene ? 'scene-section' : ''} ${className}`}
    >
      {scene ? <SceneLayer photo={scene} /> : null}
      {children}
    </section>
  );
}

function CTAButton({ children, to }: { children: React.ReactNode; to: string }) {
  return (
    <Button className="btn-black btn-with-arrow h-auto rounded-lg" type="button" onClick={() => scrollToId(to)}>
      <span>{children}</span>
      <ArrowBox />
    </Button>
  );
}

function ArrowBox() {
  return (
    <span className="btn-arrow-box">
      <ArrowRight size={18} />
    </span>
  );
}

function TextField({
  label,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <Label className="field block">
      <span>{label}</span>
      <Input className="control h-12 rounded-lg border-2 border-line bg-transparent text-ink shadow-none" type={type} placeholder={placeholder} required={required} />
    </Label>
  );
}

function TextAreaField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <Label className="field block md:col-span-2">
      <span>{label}</span>
      <Textarea className="control min-h-24 rounded-lg border-2 border-line bg-transparent py-3 text-ink shadow-none" placeholder={placeholder} />
    </Label>
  );
}

function SelectField({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue: string;
}) {
  return (
    <Label className="field block">
      <span>{label}</span>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className="control h-12 w-full rounded-lg border-2 border-line bg-transparent text-ink shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Label>
  );
}

type Product = (typeof products)[number];

function ProductCard({
  product,
  onAdd,
  labels,
  featured = false,
  className = '',
}: {
  product: Product;
  onAdd: (name: string) => void;
  labels: CatalogCardLabels;
  featured?: boolean;
  className?: string;
}) {
  const sizeClass = featured ? 'aspect-[9/16] min-h-0' : 'min-h-[230px]';

  return (
    <Card
      className={`group relative isolate ${sizeClass} overflow-hidden rounded-lg border-2 border-line bg-ink p-0 text-white shadow-none ring-0 ${className}`}
    >
      <div
        className={`absolute inset-0 bg-cover bg-center grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0 ${photoClasses[product.photo]}`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.10)_0%,rgba(0,0,0,.42)_42%,rgba(0,0,0,.88)_100%)]" />
      <div className={`relative z-10 flex ${featured ? 'h-full min-h-0' : sizeClass} flex-col justify-end gap-2 p-4 ${featured ? 'md:p-5' : ''}`}>
        <Badge className="w-fit rounded-md bg-orange px-2 py-1 text-[11px] font-black uppercase text-white hover:bg-orange">
          {product.category}
        </Badge>
        <h2 className={`${featured ? 'text-[clamp(30px,2.3vw,46px)]' : 'text-[clamp(22px,1.45vw,30px)]'} max-w-[92%] font-black leading-[.9] tracking-[-.065em]`}>{product.title}</h2>
        <p className={`${featured ? 'text-base' : 'text-sm'} leading-tight text-white/78`}>{product.spec}</p>
        <div className="flex items-end justify-between gap-3 border-t border-white/25 pt-2 text-xs font-black">
          <span className="max-w-[120px] text-white/72">{labels.location}</span>
          <strong className="text-right text-sm text-white">{labels.price}</strong>
        </div>
        <Button
          className="mt-1 min-h-10 rounded-md bg-white px-3 text-sm font-black text-ink transition hover:bg-orange hover:text-white"
          onClick={() => onAdd(product.title)}
        >
          {labels.add}
        </Button>
      </div>
    </Card>
  );
}

function CatalogPage({
  activeSlug,
  locale,
  onOpenCatalog,
  onBack,
  onAddMaterial,
}: {
  activeSlug: string;
  locale: Locale;
  onOpenCatalog: (slug?: string) => void;
  onBack: () => void;
  onAddMaterial: (name: string) => void;
}) {
  const content = dictionary[locale];
  const categoryCopy = content.categories as Record<string, CategoryCopy>;
  const localizedCategories = materialCategories.map((category) => ({
    ...category,
    ...categoryCopy[category.slug],
  }));
  const activeCategory = localizedCategories.find((category) => category.slug === activeSlug);
  const visibleProducts = activeSlug === 'all'
    ? products
    : products.filter((product) => product.categorySlug === activeSlug);

  return (
    <main>
      <section className="min-h-svh bg-porcelain px-6 pb-28 pt-24 md:px-12 lg:pr-[230px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="tag">{content.catalog.tag}</p>
          <Button variant="ghost" className="btn-line h-auto rounded-none hover:bg-transparent" type="button" onClick={onBack}>
            {content.catalog.back}
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(360px,.45fr)]">
          <h1 className="text-[clamp(56px,8.5vw,160px)] font-black leading-[.78] tracking-tightest">
            {activeCategory ? activeCategory.title : content.catalog.title}
          </h1>
          <div className="self-end">
            <p className="text-[clamp(18px,1.25vw,24px)] leading-tight text-muted">
              {content.catalog.text}
            </p>
            <Button className="btn-black btn-with-arrow mt-5 h-auto rounded-lg" type="button" onClick={() => scrollToId('#project-estimate')}>
              <span>{content.catalog.toEstimate}</span>
              <ArrowBox />
            </Button>
          </div>
        </div>

        <div className="my-7 flex gap-2 overflow-x-auto pb-2">
          <Button
            className={`min-h-11 shrink-0 rounded-lg px-4 font-black ${activeSlug === 'all' ? 'bg-ink text-white' : 'bg-pill text-white hover:bg-ink'}`}
            type="button"
            onClick={() => onOpenCatalog()}
          >
            {content.catalog.all}
          </Button>
          {localizedCategories.map((category) => (
            <Button
              key={category.slug}
              className={`min-h-11 shrink-0 rounded-lg px-4 font-black ${activeSlug === category.slug ? 'bg-ink text-white' : 'bg-pill text-white hover:bg-ink'}`}
              type="button"
              onClick={() => onOpenCatalog(category.slug)}
            >
              {category.title}
            </Button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.title} product={product} onAdd={onAddMaterial} labels={content.catalog} />
          ))}
        </div>
      </section>
    </main>
  );
}

export function App({ initialCatalogSlug = null }: { initialCatalogSlug?: string | null }) {
  useSectionMotion();

  const [locale, setLocale] = useState<Locale>('ru');
  const [catalogSlug, setCatalogSlug] = useState<string | null>(initialCatalogSlug);
  const [estimateItems, setEstimateItems] = useState<string[]>([]);
  const estimateCount = estimateItems.length;
  const content = dictionary[locale];
  const navItems = useMemo<NavItem[]>(
    () =>
      navLinks.map((href, index) => ({
        href,
        index: String(index + 1).padStart(2, '0'),
        label: content.nav[index],
      })),
    [content.nav],
  );
  const localizedServices = content.services.items.map(([title, text], index) => ({
    index: `[0:${index + 1}]`,
    title,
    text,
  }));
  const localizedCategories = materialCategories.map((category) => ({
    ...category,
    ...(content.categories as Record<string, CategoryCopy>)[category.slug],
  }));

  const addMaterial = (name: string) => {
    setEstimateItems((items) => [...items, name]);
  };

  const submitMessage = (event: FormEvent<HTMLFormElement>, text: string) => {
    event.preventDefault();
    const form = event.currentTarget;
    const output = form.querySelector<HTMLParagraphElement>('[data-form-message]');
    if (output) output.textContent = text;
    form.reset();
  };

  useEffect(() => {
    const syncRoute = () => setCatalogSlug(getCatalogSlugFromPath());
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem('almabuild-locale');
    if (!savedLocale || !locales.includes(savedLocale as Locale)) return;

    const frame = window.requestAnimationFrame(() => {
      setLocale(savedLocale as Locale);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem('almabuild-locale', locale);
  }, [locale]);

  const openCatalog = (slug = 'all') => {
    const path = slug === 'all' ? '/catalog' : `/catalog/${slug}`;
    window.history.pushState({}, '', path);
    setCatalogSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToMaterials = () => {
    window.history.pushState({}, '', '/#materials');
    setCatalogSlug(null);
    window.setTimeout(() => scrollToId('#materials'), 0);
  };

  const productCards = useMemo(
    () =>
      products.slice(0, 6).map((product) => (
        <ProductCard
          key={product.title}
          product={product}
          onAdd={addMaterial}
          labels={content.catalog}
          featured
          className="w-[min(88vw,680px)] min-w-[min(88vw,680px)] shrink-0 sm:w-[600px] sm:min-w-[600px] lg:w-[680px] lg:min-w-[680px]"
        />
      )),
    [content.catalog],
  );

  return (
    <>
      <Header locale={locale} onLocaleChange={setLocale} />
      <ScrollProgress />
      <SideNav navItems={navItems} />
      <Button
        className="fixed bottom-[82px] right-5 z-50 inline-flex min-h-12 items-center gap-3 rounded-lg bg-ink px-4 font-black text-white shadow-brutal md:bottom-8 md:right-12"
        type="button"
        onClick={() => scrollToId('#project-estimate')}
      >
        {content.estimateButton} <b className="grid size-8 place-items-center rounded-md bg-orange">{estimateCount}</b>
      </Button>

      {catalogSlug !== null ? (
        <CatalogPage
          activeSlug={catalogSlug}
          locale={locale}
          onOpenCatalog={openCatalog}
          onBack={backToMaterials}
          onAddMaterial={addMaterial}
        />
      ) : (
      <main>
        <section id="home" data-motion-section className="motion-section scene-section screen grid content-center gap-6 bg-ink px-6 py-24 text-white md:px-12 lg:pr-[230px]">
          <SceneLayer photo="photo-building" dark />
          <MaskedTitle className="max-w-[1180px] text-[clamp(56px,5.85vw,116px)] font-black leading-[.88] tracking-tightest">
            {content.home.title}
          </MaskedTitle>
          <div className="grid gap-7 lg:grid-cols-[1fr_minmax(420px,.65fr)]">
            <p className="tag">{content.home.tag}</p>
            <div>
              <p className="max-w-2xl text-[clamp(20px,1.35vw,26px)] leading-tight tracking-[-.035em] text-white/82">
                {content.home.text}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <CTAButton to="#contact">{content.home.primary}</CTAButton>
                <Button variant="ghost" className="btn-line h-auto rounded-none hover:bg-transparent" type="button" onClick={() => scrollToId('#projects')}>
                  {content.home.secondary}
                </Button>
              </div>
            </div>
          </div>
          <p className="font-black text-orange">{content.home.city}</p>
        </section>

        <Section id="services" scene="photo-retail">
          <p className="tag">{content.services.tag}</p>
          <MaskedTitle className="my-4 text-[clamp(82px,12vw,210px)] font-black leading-[.78] tracking-tightest">{content.services.title}</MaskedTitle>
          <div className="mb-5 grid gap-8 lg:grid-cols-[1fr_minmax(360px,.65fr)]">
            <p className="text-[clamp(20px,1.35vw,26px)] leading-tight text-muted">
              {content.services.text}
            </p>
            <CTAButton to="#contact">{content.services.cta}</CTAButton>
          </div>
          <div className="grid gap-2">
            {localizedServices.map((service) => (
              <article key={service.index} data-reveal className="grid items-end gap-4 border-b-2 border-line py-3 lg:grid-cols-[120px_1fr_minmax(280px,.5fr)]">
                <b className="text-4xl tracking-tightest">{service.index}</b>
                <h2 className="text-[clamp(34px,3.4vw,64px)] font-black leading-none tracking-[-.07em]">{service.title}</h2>
                <p className="text-muted">{service.text}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="approach" scene="photo-plans">
          <p className="tag">{content.approach.tag}</p>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <MaskedTitle className="text-[clamp(46px,5vw,92px)] font-medium leading-[.92] tracking-[-.075em]">{content.approach.title}</MaskedTitle>
            <p className="self-end text-[clamp(20px,1.35vw,26px)] leading-tight text-muted">
              {content.approach.text}
            </p>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {content.approach.items.map((item, index) => (
              <Card key={item} data-reveal className="card-line grid min-h-28 content-between p-4 shadow-none ring-0">
                <span className="font-black text-orange">{String(index + 1).padStart(2, '0')}</span>
                <b className="text-2xl tracking-[-.05em]">{item}</b>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="materials" scene="material-drywall" className="!h-auto !min-h-svh !overflow-visible gap-5">
          <p className="tag">{content.materials.tag}</p>
          <MaskedTitle className="max-w-[1120px] text-[clamp(44px,5vw,92px)] font-medium leading-[.9] tracking-[-.075em]">{content.materials.title}</MaskedTitle>
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(360px,.42fr)]">
            <p className="max-w-3xl text-[clamp(18px,1.1vw,22px)] leading-tight text-muted">
              {content.materials.text}
            </p>
            <div className="flex flex-wrap gap-3">
              <CTAButton to="#project-estimate">{content.materials.add}</CTAButton>
              <Button variant="ghost" className="btn-line h-auto rounded-none hover:bg-transparent" type="button" onClick={() => openCatalog()}>
                {content.materials.price}
              </Button>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <div className="mb-3 grid grid-cols-[auto_1fr_auto] items-center gap-4">
                <h2 className="text-[clamp(22px,1.65vw,32px)] font-black tracking-[-.06em]">{content.materials.categoriesTitle}</h2>
                <span className="h-px bg-line" />
                <Button variant="ghost" className="btn-line h-auto rounded-none hover:bg-transparent" type="button" onClick={() => openCatalog()}>
                  {content.materials.allCategories} <ArrowRight size={18} />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {localizedCategories.map((category) => (
                  <Button
                    variant="ghost"
                    key={category.index}
                    data-reveal
                    className="group relative isolate grid h-[260px] w-full overflow-hidden rounded-xl border border-ink/70 bg-ink p-0 text-left text-white shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-orange hover:bg-ink"
                    type="button"
                    onClick={() => openCatalog(category.slug)}
                  >
                    <div className={`pointer-events-none absolute inset-0 bg-cover bg-center opacity-80 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 ${photoClasses[category.photo]}`} />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.18)_0%,rgba(0,0,0,.46)_45%,rgba(0,0,0,.88)_100%)]" />
                    <div className="relative z-10 flex h-full min-w-0 flex-col overflow-hidden p-5 pr-16">
                      <div className="min-w-0">
                        <b className="text-[20px] font-black leading-none text-orange">{category.index}</b>
                        <h3 className="mt-4 max-w-[360px] whitespace-normal break-words text-[clamp(24px,1.65vw,34px)] font-black leading-[.9] tracking-[-.06em] text-white [overflow-wrap:anywhere]">{category.title}</h3>
                      </div>
                      <ul className="mt-auto grid min-w-0 gap-0.5 overflow-hidden pt-4 text-[13px] font-semibold leading-tight text-white/78">
                        {category.bullets.map((item) => (
                          <li key={item} className="line-clamp-1 break-words [overflow-wrap:anywhere]">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <span className="absolute bottom-5 right-5 z-20 grid size-11 place-items-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-orange group-hover:text-white">
                      <ArrowRight size={18} />
                    </span>
                  </Button>
                ))}
              </div>
            </div>
            <Card className="card-line sticky top-8 grid h-fit content-between gap-5 p-6 shadow-none ring-0">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-3xl font-black leading-none tracking-[-.06em]">{content.estimate.title}</h2>
                  <b className="grid size-10 place-items-center rounded-md bg-orange text-xl text-white">{estimateCount}</b>
                </div>
                <p className="mt-4 text-sm font-bold leading-tight text-muted">{content.estimate.note}</p>
              </div>
              <div className="grid gap-4 border-y border-line py-4">
                {[
                  [Calculator, 'Быстрый расчёт', 'Считаем материалы и сроки поставки'],
                  [BadgePercent, 'Лучшие цены', 'Работаем напрямую с поставщиками'],
                  [Truck, 'Доставка по Алматы', 'Привозим материалы на объект'],
                ].map(([Icon, title, text]) => (
                  <div key={title as string} className="grid grid-cols-[32px_1fr] gap-3">
                    <span className="grid size-8 place-items-center rounded-md border border-line">
                      <Icon size={18} />
                    </span>
                    <p className="text-sm leading-tight">
                      <b className="block">{title as string}</b>
                      <span className="text-muted">{text as string}</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3">
                <Button className="btn-black btn-with-arrow h-auto w-full rounded-lg" type="button" onClick={() => scrollToId('#project-estimate')}>
                  <span>{content.estimate.open}</span>
                  <ArrowBox />
                </Button>
                <Button variant="ghost" className="btn-line h-auto w-full justify-between rounded-none hover:bg-transparent" type="button" onClick={() => scrollToId('#approach')}>
                  {content.estimate.how} <ArrowRight size={18} />
                </Button>
              </div>
            </Card>
          </div>
        </Section>

        <Section id="material-products" scene="photo-city">
          <p className="tag">{content.catalog.tag}</p>
          <MaskedTitle className="my-3 text-[clamp(64px,6.8vw,126px)] font-black leading-[.78] tracking-tightest">{content.catalog.title}</MaskedTitle>
          <div className="mb-4 flex flex-wrap gap-3">
            <Button className="btn-black btn-with-arrow h-auto rounded-lg" type="button" onClick={() => openCatalog()}>
              <span>{content.catalog.open}</span>
              <ArrowBox />
            </Button>
          </div>
          <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-4 pt-1 md:-mx-12 md:px-12 lg:-mr-[230px] lg:pr-[230px] [scrollbar-width:thin]">
            {productCards}
          </div>
        </Section>

        <Section id="material-kits" scene="material-ceiling">
          <p className="tag">[КОМПЛЕКТЫ]</p>
          <MaskedTitle className="mb-5 text-[clamp(44px,4.8vw,88px)] font-medium leading-[.92] tracking-[-.075em]">Комплекты под объект</MaskedTitle>
          <div className="grid gap-3 md:grid-cols-3">
            {kits.map((kit) => (
              <Card key={kit.title} data-reveal className="card-line grid min-h-48 grid-rows-[auto_auto_1fr_auto] p-4 shadow-none ring-0">
                <h2 className="text-3xl font-black leading-none tracking-[-.06em]">{kit.title}</h2>
                <p className="my-3 text-muted">{kit.text}</p>
                <ul className="grid gap-1">
                  {kit.items.map((item) => (
                    <li key={item} className="border-t border-ink/20 pt-1 text-sm text-muted">{item}</li>
                  ))}
                </ul>
                <Button className="mt-3 min-h-10 rounded-md bg-ink px-3 font-black text-white hover:bg-orange" onClick={() => addMaterial(kit.title)}>
                  Рассчитать комплект
                </Button>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="project-estimate" scene="material-mixes">
          <p className="tag">[{content.estimate.title.toUpperCase()}]</p>
          <MaskedTitle className="mb-5 text-[clamp(44px,4.8vw,88px)] font-medium leading-[.92] tracking-[-.075em]">Материалы + работы в одном договоре</MaskedTitle>
          <div className="grid gap-5 lg:grid-cols-[minmax(320px,.78fr)_minmax(0,1fr)]">
            <Card className="card-line p-5 shadow-none ring-0">
              <h2 className="text-4xl font-black tracking-[-.06em]">{content.estimate.title}</h2>
              <p className="my-4 text-muted">Выбранные материалы попадут в заявку на расчёт. Мы уточним количество, поставку стройматериалов Алматы, монтаж и сроки.</p>
              <ul className="grid max-h-56 gap-1 overflow-auto">
                {estimateItems.length === 0 ? (
                  <li className="border-t border-ink/20 pt-2 text-muted">{content.estimate.empty}</li>
                ) : (
                  estimateItems.map((item, index) => <li className="border-t border-ink/20 pt-2 text-muted" key={`${item}-${index}`}>{index + 1}. {item}</li>)
                )}
              </ul>
            </Card>
            <form className="grid min-w-0 gap-2 md:grid-cols-2" onSubmit={(event) => submitMessage(event, `${content.estimate.sent} ${estimateCount}.`)}>
              <TextField label="Количество / объём" placeholder="Например: 120 м² перегородок" />
              <TextField label="Площадь объекта" type="number" placeholder="150" />
              <SelectField label="Тип объекта" defaultValue="Магазин" options={['Магазин', 'Аптека', 'Салон', 'Шоурум']} />
              <TextField label="Район Алматы" placeholder="Медеуский" />
              <SelectField label="Срок начала работ" defaultValue="В течение 7 дней" options={['В течение 7 дней', 'В течение месяца', 'Планируем']} />
              <TextField label="Телефон" type="tel" required placeholder="+7 (___) ___-__-__" />
              <TextAreaField label="Комментарий" placeholder="Материалы для ремонта магазина, сроки, особенности объекта" />
              <Button className="btn-black btn-with-arrow h-auto rounded-lg md:col-span-2" type="submit">
                <span>Отправить на расчёт</span>
                <ArrowBox />
              </Button>
              <p className="min-h-6 font-black text-orange md:col-span-2" data-form-message />
            </form>
          </div>
        </Section>

        <Section id="material-calc" scene="material-electric">
          <p className="tag">[РАСЧЁТ МАТЕРИАЛОВ]</p>
          <MaskedTitle className="mb-5 text-[clamp(44px,4.8vw,88px)] font-medium leading-[.92] tracking-[-.075em]">Рассчитать материалы по площади</MaskedTitle>
          <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
            <Card className="card-line p-5 shadow-none ring-0">
              <form className="grid min-w-0 gap-3 md:grid-cols-2" onSubmit={(event) => submitMessage(event, 'Заявка на расчёт материалов принята.')}>
                <SelectField label="Тип работ" defaultValue="Перегородки" options={['Перегородки', 'Потолки', 'Плиточные работы', 'Электрика и освещение']} />
                <TextField label="Площадь, м²" type="number" placeholder="100" />
                <TextField label="Высота потолка" type="number" placeholder="3.2" />
                <SelectField label="Нужен монтаж" defaultValue="Да" options={['Да', 'Нет']} />
                <TextField label="Телефон" type="tel" required placeholder="+7 (___) ___-__-__" />
                <Button className="btn-black btn-with-arrow h-auto rounded-lg md:col-span-2" type="submit">
                  <span>Получить расчёт материалов</span>
                  <ArrowBox />
                </Button>
                <p className="min-h-6 font-black text-orange md:col-span-2" data-form-message />
              </form>
            </Card>
            <Card className="card-line grid content-center gap-5 p-5 shadow-none ring-0">
              <h2 className="text-4xl font-black tracking-[-.06em]">Материалы + работы в одном договоре</h2>
              <p className="text-[clamp(20px,1.35vw,28px)] leading-tight text-muted">
                Мы можем не только поставить материалы, но и выполнить отделку, электрику, потолки, полы и перегородки под ключ. Это помогает контролировать сроки, качество и бюджет объекта.
              </p>
              <p className="text-muted">Стройматериалы в Алматы, гипсокартон Алматы, сухие смеси Алматы, освещение для магазинов, ремонт торговых помещений Алматы и отделка магазинов под ключ.</p>
              <Button variant="ghost" className="btn-line h-auto rounded-none hover:bg-transparent" type="button" onClick={() => scrollToId('#contact')}>Обсудить объект</Button>
            </Card>
          </div>
        </Section>

        <Section id="projects" scene="photo-office">
          <p className="tag">[{content.nav[3].toUpperCase()}]</p>
          <div className="mb-6 grid items-end gap-6 lg:grid-cols-[1fr_minmax(340px,.42fr)]">
            <MaskedTitle className="text-[clamp(82px,12vw,210px)] font-black leading-[.78] tracking-tightest">{content.nav[3]}</MaskedTitle>
            <p className="text-[clamp(18px,1.15vw,24px)] leading-tight text-muted">
              Коммерческие помещения, где мы закрывали отделку, материалы, электрику и сроки запуска.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {projects.map((project, index) => (
              <Card
                key={project.title}
                data-reveal
                className="group relative isolate min-h-[360px] overflow-hidden rounded-lg border-2 border-line bg-ink p-0 text-white shadow-none ring-0"
              >
                <div className={`absolute inset-0 bg-cover bg-center grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0 ${photoClasses[project.photo]}`} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.08)_0%,rgba(0,0,0,.35)_42%,rgba(0,0,0,.88)_100%)]" />
                <div className="relative z-10 flex min-h-[360px] flex-col justify-between p-5">
                  <div className="flex items-center justify-between border-b border-white/25 pb-3 text-sm font-black">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-orange">ALMATY</span>
                  </div>
                  <div>
                    <h2 className="text-[clamp(36px,3vw,64px)] font-black leading-[.86] tracking-[-.075em]">{project.title}</h2>
                    <p className="mt-2 text-base font-bold text-white/76">{project.meta}</p>
                    <p className="mt-4 border-t border-white/25 pt-3 text-sm font-black leading-tight">
                      Отделка · электрика · потолки · материалы
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <section id="contact" data-motion-section className="motion-section relative isolate flex min-h-svh flex-col justify-between overflow-visible bg-[#191918] px-6 pb-36 pt-24 text-white [scroll-snap-align:start] md:px-12 lg:pr-[230px]">
          <SceneLayer photo="photo-city" dark />
          <div className="pointer-events-none absolute inset-0 opacity-[.18] [background-image:radial-gradient(circle_at_30%_20%,rgba(255,255,255,.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,.08)_0%,transparent_35%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[.08] [background-image:linear-gradient(0deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:100%_140px]" />
          <div className="relative z-10">
            <p className="tag">{content.contact.tag}</p>
            <MaskedTitle className="mt-10 text-[clamp(56px,7vw,132px)] font-medium leading-[.88] tracking-[-.075em] text-white">
              {content.contact.title}
            </MaskedTitle>
            <a
              className="mt-5 inline-flex max-w-full items-center gap-3 border-b border-white/55 pb-3 text-[clamp(30px,3.4vw,64px)] font-medium leading-none tracking-[-.055em] text-white transition hover:text-orange"
              href="mailto:info@almabuild.pro"
            >
              <ArrowRight className="rotate-45" size={42} />
              <span className="break-all">info@almabuild.pro</span>
            </a>
          </div>

          <div className="relative z-10 mt-14 grid gap-10 lg:grid-cols-[minmax(0,.95fr)_minmax(280px,.42fr)_minmax(240px,.32fr)]">
            <nav className="grid">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={`/${item.href}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToId(item.href);
                  }}
                  className="grid grid-cols-[52px_1fr_auto] items-center border-b border-white/30 py-4 text-white transition hover:border-orange hover:text-orange"
                >
                  <span className="text-sm font-black text-white/80">[{item.index}]</span>
                  <span className="text-[clamp(34px,3.1vw,58px)] font-medium leading-none tracking-[-.055em]">{item.label}</span>
                  <ArrowRight size={26} />
                </a>
              ))}
            </nav>

            <div className="grid content-start gap-7 text-[clamp(18px,1.1vw,22px)] leading-tight">
              <div>
                <p className="mb-5 text-sm font-black uppercase tracking-wide text-white/38">{content.contact.office}</p>
                <p className="font-black uppercase">Almaty</p>
                <p className="mt-2 text-white/78">{content.contact.city}</p>
                <p className="mt-3 text-white/78">Tel: +7 708 111 22 33</p>
              </div>
              <p className="text-white/56">{content.contact.text}</p>
            </div>

            <div className="grid content-start gap-7 text-[clamp(18px,1.1vw,22px)] leading-tight">
              <div>
                <p className="mb-5 text-sm font-black uppercase tracking-wide text-white/38">{content.contact.hours}</p>
                <p className="text-white/78">9:00 - 18:00</p>
                <p className="text-white/78">Monday to Friday.</p>
                <p className="text-white/78">Weekend by appointment.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  ['Instagram', <span key="instagram" className="text-sm font-black">IG</span>],
                  ['Facebook', <span key="facebook" className="text-sm font-black">FB</span>],
                  ['WhatsApp', <MessageCircle key="whatsapp" size={22} />],
                  ['Telegram', <Send key="telegram" size={22} />],
                ].map(([label, icon]) => (
                  <a
                    key={label as string}
                    aria-label={label as string}
                    className="grid size-11 place-items-center rounded-md border border-white/35 text-white transition hover:border-orange hover:bg-orange hover:text-white"
                    href="#contact"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-16 grid gap-6 border-t border-white/12 pt-8 text-white/38 md:grid-cols-[minmax(0,.95fr)_1fr]">
            <p className="max-w-3xl text-[clamp(18px,1.2vw,24px)] leading-tight">
              {content.contact.footer}
            </p>
            <p className="self-end text-sm leading-tight">
              ALMABUILD PRO · Commercial fit-out and materials supply<br />
              © 2026 All Rights Reserved.
            </p>
          </div>
        </section>
      </main>
      )}
    </>
  );
}
