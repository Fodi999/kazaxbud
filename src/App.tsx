'use client';

import { FormEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Menu, Phone, Search, ShoppingBag, Sun, X } from 'lucide-react';
import { defaultSiteContent, type Product, type SiteContent } from './data/site';
import { dictionary, localeNames, locales, type Locale } from './data/i18n';

type CategoryCopy = {
  title: string;
  text: string;
  bullets: string[];
};

const navAnchors = ['#services', '#materials', '#projects', '#estimate', '#contact'] as const;
const backendUrl = (process.env.NEXT_PUBLIC_KAZAXBUD_BACKEND_URL || 'https://ministerial-yetta-fodi999-c58d8823.koyeb.app').replace(/\/+$/, '');
const navLabels: Record<Locale, string[]> = {
  ru: ['Услуги', 'Материалы', 'Проекты', 'Смета', 'Контакты'],
  kk: ['Қызметтер', 'Материалдар', 'Жобалар', 'Смета', 'Байланыс'],
  en: ['Services', 'Materials', 'Projects', 'Estimate', 'Contact'],
};

function scrollToId(id: string) {
  const target = document.querySelector(id);
  if (!target) {
    window.location.href = `/${id}`;
    return;
  }
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getCatalogSlugFromPath() {
  if (typeof window === 'undefined') return null;
  if (!window.location.pathname.startsWith('/catalog')) return null;
  const slug = window.location.pathname.replace(/^\/catalog\/?/, '');
  return slug ? decodeURIComponent(slug) : 'all';
}

function MonoLogo() {
  return (
    <button className="brand-mark" type="button" onClick={() => scrollToId('#home')} aria-label="ALMABUILD PRO">
      <span>ALMA</span>
      <b>BUILD</b>
    </button>
  );
}

function Header({
  locale,
  theme,
  onLocaleChange,
  onCatalog,
  onEstimate,
  onThemeToggle,
}: {
  locale: Locale;
  theme: 'dark' | 'light';
  onLocaleChange: (locale: Locale) => void;
  onCatalog: () => void;
  onEstimate: () => void;
  onThemeToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const items = navAnchors.map((href, index) => ({
    href,
    label: navLabels[locale][index],
  }));

  return (
    <header className="site-header">
      <MonoLogo />
      <nav className="desktop-nav" aria-label="Главная навигация">
        {items.map((item) => (
          <a key={item.href} href={item.href} onClick={(event) => { event.preventDefault(); scrollToId(item.href); }}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button className="header-link" type="button" onClick={onCatalog}>Каталог</button>
        <button className="theme-toggle" type="button" onClick={onThemeToggle} aria-label="Переключить тему" title="Переключить тему">
          <Sun size={18} />
        </button>
        <div className="locale-switch" aria-label="Язык">
          {locales.map((item) => (
            <button key={item} className={locale === item ? 'active' : ''} type="button" onClick={() => onLocaleChange(item)}>
              {localeNames[item]}
            </button>
          ))}
        </div>
        <button className="icon-btn" type="button" aria-label="Открыть каталог" title="Открыть каталог" onClick={onCatalog}><Search size={20} /></button>
        <button className="icon-btn mobile-menu-btn" type="button" aria-label="Меню" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open ? (
        <div className="mobile-nav">
          {items.map((item) => (
            <a key={item.href} href={item.href} onClick={(event) => { event.preventDefault(); setOpen(false); scrollToId(item.href); }}>
              {item.label}
            </a>
          ))}
          <button type="button" onClick={() => { setOpen(false); onCatalog(); }}>Открыть каталог</button>
          <a className="mobile-phone-link" href="tel:+77081112233">+7 708 111 22 33</a>
          <button className="mobile-estimate-link" type="button" onClick={() => { setOpen(false); onEstimate(); }}>Рассчитать смету</button>
          <div className="mobile-nav-tools">
            <button type="button" onClick={onThemeToggle}>Тема: {theme === 'dark' ? 'молочная' : 'темная'}</button>
            <div>
              {locales.map((item) => (
                <button key={item} className={locale === item ? 'active' : ''} type="button" onClick={() => onLocaleChange(item)}>
                  {localeNames[item]}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Marquee() {
  return (
    <div className="ticker" aria-hidden="true">
      <div>
        <span>отделка магазинов под ключ</span>
        <span>+7 708 111 22 33</span>
        <span>стройматериалы Алматы</span>
        <span>смета и поставка</span>
        <span>коммерческие помещения</span>
      </div>
    </div>
  );
}

function ProductArt({ product, tall = false }: { product: Product; tall?: boolean }) {
  return (
    <div className={`product-art ${tall ? 'product-art-tall' : ''}`}>
      <div className="art-board">
        <span>{product.category}</span>
        <b>{product.title}</b>
        <small>{product.spec}</small>
      </div>
      <div className="art-card art-card-one" />
      <div className="art-card art-card-two" />
    </div>
  );
}

function ProductTile({
  product,
  onAdd,
  large = false,
}: {
  product: Product;
  onAdd: (name: string) => void;
  large?: boolean;
}) {
  return (
    <article className={`product-tile ${large ? 'product-tile-large' : ''}`}>
      <ProductArt product={product} tall={large} />
      <div className="product-copy">
        <p>{product.category}</p>
        <h3>{product.title}</h3>
        <span>{product.spec}</span>
        <button type="button" onClick={() => onAdd(product.title)}>Добавить в смету</button>
      </div>
    </article>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 560px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isMobile;
}

function InteractiveMaterialsWindow({
  items,
  onAdd,
}: {
  items: Product[];
  onAdd: (name: string) => void;
}) {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeProduct = activeIndex === null ? null : items[activeIndex];

  if (isMobile) {
    return (
      <div className="materials-carousel" aria-label="Материалы">
        {items.map((product) => (
          <article className="materials-carousel-card" key={product.title}>
            <ProductArt product={product} />
            <div>
              <span>{product.category}</span>
              <h3>{product.title}</h3>
              <p>{product.spec}</p>
              <button type="button" onClick={() => onAdd(product.title)}>Добавить в смету</button>
            </div>
          </article>
        ))}
      </div>
    );
  }

  function moveCursor(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--cursor-x', x.toFixed(3));
    event.currentTarget.style.setProperty('--cursor-y', y.toFixed(3));
  }

  function shiftActive(step: number) {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + step + items.length) % items.length);
  }

  return (
    <div className="materials-window" onMouseMove={moveCursor} onMouseLeave={(event) => {
      event.currentTarget.style.setProperty('--cursor-x', '0');
      event.currentTarget.style.setProperty('--cursor-y', '0');
    }}>
      {activeProduct ? (
        <article className="material-detail">
          <button className="material-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Назад к материалам">
            <X size={19} />
          </button>
          <button className="material-arrow left" type="button" onClick={() => shiftActive(-1)} aria-label="Предыдущая карточка">
            <ArrowLeft size={24} />
          </button>
          <button className="material-arrow right" type="button" onClick={() => shiftActive(1)} aria-label="Следующая карточка">
            <ArrowRight size={24} />
          </button>
          <div className="material-detail-main">
            <div>
              <span>{activeProduct.category}</span>
              <h3>{activeProduct.title}</h3>
              <p>{activeProduct.spec}</p>
              <p>
                Материал для коммерческой отделки, перегородок, потолков и подготовки объекта к открытию. Подбираем объем, доставку и монтаж под проект.
              </p>
            </div>
            <ProductArt product={activeProduct} />
          </div>
          <div className="material-detail-grid">
            <div>
              <b>Характеристики</b>
              <p>Категория: {activeProduct.category}</p>
              <p>Формат: поставка / монтаж</p>
              <p>Подходит для торговых помещений</p>
            </div>
            <div>
              <b>Применение</b>
              <p>Магазины, аптеки, салоны, шоурумы и технические зоны.</p>
            </div>
            <div>
              <b>Наличие</b>
              <p>Алматы</p>
              <p>Под заказ / по складу</p>
            </div>
          </div>
          <div className="material-detail-actions">
            <button className="text-button" type="button" onClick={() => setActiveIndex(null)}>← назад к материалам</button>
            <button type="button" onClick={() => onAdd(activeProduct.title)}>Добавить в смету <span>+</span></button>
          </div>
        </article>
      ) : (
        <div className="material-cards-stage">
          {items.slice(0, 3).map((product, index) => (
            <button
              key={product.title}
              className={`floating-material-card card-${index + 1}`}
              type="button"
              onClick={() => setActiveIndex(index)}
            >
              <span>{product.category}</span>
              <h3>{product.title}</h3>
              <p>{product.spec}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileBottomBar({
  estimateCount,
  onEstimate,
}: {
  estimateCount: number;
  onEstimate: () => void;
}) {
  return (
    <div className="mobile-bottom-bar">
      <a href="tel:+77081112233"><Phone size={18} />Позвонить</a>
      <button type="button" onClick={onEstimate}>Смета <span>{estimateCount}</span></button>
    </div>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="section-title">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <span>{text}</span> : null}
    </div>
  );
}

function CatalogView({
  slug,
  locale,
  siteContent,
  onOpenCatalog,
  onBack,
  onAdd,
}: {
  slug: string;
  locale: Locale;
  siteContent: SiteContent;
  onOpenCatalog: (slug?: string) => void;
  onBack: () => void;
  onAdd: (name: string) => void;
}) {
  const content = dictionary[locale];
  const categories = content.categories as Record<string, CategoryCopy>;
  const localizedCategories = siteContent.materialCategories.map((category) => ({
    ...category,
    ...categories[category.slug],
  }));
  const activeCategory = localizedCategories.find((category) => category.slug === slug);
  const visibleProducts = slug === 'all' ? siteContent.products : siteContent.products.filter((product) => product.categorySlug === slug);

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <button className="text-button" type="button" onClick={onBack}>Назад на сайт</button>
        <p>{content.catalog.tag}</p>
        <h1>{activeCategory?.title || content.catalog.title}</h1>
        <span>{content.catalog.text}</span>
      </section>
      <div className="category-strip">
        <button className={slug === 'all' ? 'active' : ''} type="button" onClick={() => onOpenCatalog()}>Все</button>
        {localizedCategories.map((category) => (
          <button key={category.slug} className={slug === category.slug ? 'active' : ''} type="button" onClick={() => onOpenCatalog(category.slug)}>
            {category.title}
          </button>
        ))}
      </div>
      <section className="catalog-grid">
        {visibleProducts.map((product) => <ProductTile key={product.title} product={product} onAdd={onAdd} />)}
      </section>
    </main>
  );
}

function ContactForm({ estimateItems }: { estimateItems: string[] }) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('Отправляем заявку...');

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(`${backendUrl}/public/almabuild/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(formData.get('name') || ''),
          phone: String(formData.get('phone') || ''),
          type: String(formData.get('type') || ''),
          area: String(formData.get('area') || ''),
          comment: String(formData.get('comment') || ''),
          items: formData.getAll('items').map((item) => String(item)).filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error('Lead submit failed');
      }

      setMessage(`Заявка сохранена в CRM. Выбрано позиций: ${estimateItems.length}.`);
      event.currentTarget.reset();
    } catch {
      setMessage('Не удалось отправить заявку. Проверьте телефон и попробуйте еще раз.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="estimate-form" onSubmit={submit}>
      {estimateItems.map((item, index) => (
        <input key={`${item}-${index}`} type="hidden" name="items" value={item} />
      ))}
      <label>
        <span>Имя</span>
        <input name="name" placeholder="Дмитрий" />
      </label>
      <label>
        <span>Телефон</span>
        <input name="phone" required placeholder="+7 (___) ___-__-__" />
      </label>
      <label>
        <span>Тип объекта</span>
        <select defaultValue="Магазин" name="type">
          <option>Магазин</option>
          <option>Аптека</option>
          <option>Салон</option>
          <option>Шоурум</option>
        </select>
      </label>
      <label>
        <span>Площадь</span>
        <input name="area" type="number" placeholder="120 м2" />
      </label>
      <label className="wide">
        <span>Что нужно сделать</span>
        <textarea name="comment" placeholder="Отделка, материалы, электрика, сроки открытия" />
      </label>
      <button type="submit" disabled={submitting}>{submitting ? 'Отправляем' : 'Отправить заявку'} <ArrowRight size={18} /></button>
      <p>{message}</p>
    </form>
  );
}

export function App({
  initialCatalogSlug = null,
  initialContent = defaultSiteContent,
}: {
  initialCatalogSlug?: string | null;
  initialContent?: SiteContent;
}) {
  const [locale, setLocale] = useState<Locale>('ru');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [catalogSlug, setCatalogSlug] = useState<string | null>(initialCatalogSlug);
  const [siteContent, setSiteContent] = useState<SiteContent>(initialContent);
  const [estimateItems, setEstimateItems] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const content = dictionary[locale];

  const localizedCategories = useMemo(() => {
    const categories = content.categories as Record<string, CategoryCopy>;
    return siteContent.materialCategories.map((category) => ({
      ...category,
      ...categories[category.slug],
    }));
  }, [content.categories, siteContent.materialCategories]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedLocale = window.localStorage.getItem('almabuild-locale');
      if (savedLocale && locales.includes(savedLocale as Locale)) {
        setLocale(savedLocale as Locale);
      }

      const savedTheme = window.localStorage.getItem('almabuild-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadContent() {
      try {
        const response = await fetch(`${backendUrl}/public/almabuild/content`, {
          cache: 'no-store',
        });

        if (response.ok && active) {
          setSiteContent(await response.json() as SiteContent);
        }
      } catch {
        // Build-time content remains visible if backend is unavailable.
      }
    }

    void loadContent();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem('almabuild-locale', locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('almabuild-theme', theme);
  }, [theme]);

  useEffect(() => {
    const syncRoute = () => setCatalogSlug(getCatalogSlugFromPath());
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function openCatalog(slug = 'all') {
    const path = slug === 'all' ? '/catalog' : `/catalog/${slug}`;
    window.history.pushState({}, '', path);
    setCatalogSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function backToSite() {
    window.history.pushState({}, '', '/#materials');
    setCatalogSlug(null);
    window.requestAnimationFrame(() => scrollToId('#materials'));
  }

  function goToEstimate() {
    window.history.pushState({}, '', '/#estimate');
    setCatalogSlug(null);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => scrollToId('#estimate'));
    });
  }

  function addMaterial(name: string) {
    setEstimateItems((items) => [...items, name]);
    setToast(`Добавлено в смету: ${name}`);
  }

  return (
    <>
      <Header
        locale={locale}
        theme={theme}
        onLocaleChange={setLocale}
        onCatalog={() => openCatalog()}
        onEstimate={goToEstimate}
        onThemeToggle={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}
      />
      {toast ? <div className="site-toast" role="status">{toast}</div> : null}
      <MobileBottomBar estimateCount={estimateItems.length} onEstimate={goToEstimate} />
      {catalogSlug !== null ? (
        <CatalogView
          slug={catalogSlug}
          locale={locale}
          siteContent={siteContent}
          onOpenCatalog={openCatalog}
          onBack={backToSite}
          onAdd={addMaterial}
        />
      ) : (
        <main>
          <section className="hero-section" id="home">
            <Marquee />
            <div className="hero-grid">
              <div className="hero-copy">
                <p>{content.home.tag}</p>
                <h1>{content.home.title}</h1>
                <span>{content.home.text}</span>
                <div className="hero-actions">
                  <button type="button" onClick={() => scrollToId('#estimate')}>{content.home.primary} <ArrowRight size={20} /></button>
                  <button type="button" onClick={() => scrollToId('#projects')}>{content.home.secondary}</button>
                </div>
              </div>
              <div className="hero-panel">
                <ProductArt product={siteContent.products[2] || siteContent.products[0]} tall />
                <div>
                  <b>ALMATY</b>
                  <span>materials / fit-out / launch</span>
                </div>
              </div>
            </div>
            <div className="mega-word" aria-hidden="true">ALMABUILD</div>
          </section>

          <section className="split-section" id="services">
            <SectionTitle eyebrow={content.services.tag} title={content.services.title} text={content.services.text} />
            <div className="service-list">
              {content.services.items.map(([title, text], index) => (
                <article key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="shop-section" id="materials">
            <SectionTitle eyebrow={content.materials.tag} title={content.materials.title} text={content.materials.text} />
            <div className="category-grid">
              {localizedCategories.map((category) => (
                <button key={category.slug} type="button" onClick={() => openCatalog(category.slug)}>
                  <span>{category.index}</span>
                  <h3>{category.title}</h3>
                  <p>{category.text}</p>
                  <b><ArrowRight size={18} /></b>
                </button>
              ))}
            </div>
          </section>

          <section className="products-section">
            <div className="section-row">
              <h2>Сопутствующие товары</h2>
              <button className="text-button" type="button" onClick={() => openCatalog()}>Все товары</button>
            </div>
            <InteractiveMaterialsWindow items={siteContent.products.slice(2, 7)} onAdd={addMaterial} />
            <div className="product-grid">
              {siteContent.products.slice(0, 8).map((product, index) => (
                <ProductTile key={product.title} product={product} onAdd={addMaterial} large={index === 1 || index === 4} />
              ))}
            </div>
          </section>

          <section className="project-section" id="projects">
            <SectionTitle eyebrow="[ПРОЕКТЫ]" title="Коммерческие пространства" text="Магазины, аптеки и салоны, где материалы, сроки и работы собраны в управляемый процесс." />
            <div className="project-grid">
              {siteContent.projects.map((project, index) => (
                <article key={project.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{project.title}</h3>
                  <p>{project.meta}</p>
                  <b>fit-out / supply / control</b>
                </article>
              ))}
            </div>
          </section>

          <section className="kits-section">
            <SectionTitle eyebrow="[КОМПЛЕКТЫ]" title="Готовые наборы под объект" />
            <div className="kit-grid">
              {siteContent.kits.map((kit) => (
                <article key={kit.title}>
                  <BriefcaseBusiness size={22} />
                  <h3>{kit.title}</h3>
                  <p>{kit.text}</p>
                  <ul>{kit.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  <button type="button" onClick={() => addMaterial(kit.title)}>В смету</button>
                </article>
              ))}
            </div>
          </section>

          <section className="estimate-section" id="estimate">
            <div className="estimate-summary">
              <SectionTitle eyebrow="[СМЕТА]" title="Собираем материалы и работы в один расчет" text="Добавляйте позиции из каталога, оставляйте площадь объекта и получайте расчет под запуск коммерческого пространства." />
              <div className="estimate-box">
                <b>{estimateItems.length}</b>
                <span>позиций в смете</span>
                {estimateItems.length ? (
                  <ul>{estimateItems.slice(-6).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
                ) : <p>Материалы пока не выбраны</p>}
              </div>
            </div>
            <ContactForm estimateItems={estimateItems} />
          </section>

          <footer className="site-footer" id="contact">
            <div>
              <MonoLogo />
              <p>{content.contact.footer}</p>
            </div>
            <div className="footer-columns">
              <nav>
                <b>Магазин</b>
                <button type="button" onClick={() => openCatalog()}>Каталог</button>
                <button type="button" onClick={() => scrollToId('#materials')}>Материалы</button>
                <button type="button" onClick={() => scrollToId('#estimate')}>Смета</button>
              </nav>
              <nav>
                <b>Связаться</b>
                <a href="mailto:info@almabuild.pro">info@almabuild.pro</a>
                <a href="tel:+77081112233">+7 708 111 22 33</a>
                <span>Алматы, Казахстан</span>
              </nav>
            </div>
            <div className="footer-bottom">
              <span>© 2026, ALMABUILD PRO</span>
              <span><ShoppingBag size={16} /> commercial fit-out</span>
            </div>
          </footer>
        </main>
      )}
    </>
  );
}
