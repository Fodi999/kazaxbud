import { materialCategories } from './site';

export const locales = ['ru', 'kk', 'en'] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  ru: 'RU',
  kk: 'KZ',
  en: 'EN',
};

type LocalizedCategory = {
  title: string;
  text: string;
  bullets: string[];
};

const categories: Record<Locale, Record<string, LocalizedCategory>> = {
  ru: Object.fromEntries(
    materialCategories.map((category) => [
      category.slug,
      { title: category.title, text: category.text, bullets: category.bullets },
    ]),
  ),
  kk: {
    'gipsokarton-profili': {
      title: 'Гипсокартон және профильдер',
      text: 'Қабырғалар мен төбелерге арналған ГКЛ, бағыттаушы және тірек профильдер, аспалар, бекіткіштер.',
      bullets: ['ГКЛ парақтары', 'Профильдер', 'Аспалар мен бекіткіштер', 'Жинақтаушы бөлшектер'],
    },
    'sukhie-smesi': {
      title: 'Құрғақ қоспалар',
      text: 'Сылақ, шпаклевка, өздігінен тегістелетін еден, плитка желімі, праймер және шығын материалдары.',
      bullets: ['Сылақ пен шпаклевка', 'Плитка желімі', 'Құйма еден', 'Праймерлер'],
    },
    'poly-plitka': {
      title: 'Еден және плитка',
      text: 'Керамогранит, плитка, кварцвинил, ламинат, плинтус және төсеуге арналған материалдар.',
      bullets: ['Керамогранит', 'Кварцвинил және ламинат', 'Плинтус пен табалдырық', 'Желім мен затирка'],
    },
    'elektrika-osveshchenie': {
      title: 'Электрика және жарық',
      text: 'Кабель, автоматтар, розеткалар, трек жарығы, шамдар және дүкендерге арналған LED шешімдер.',
      bullets: ['Кабельдер', 'Автоматтар мен қалқандар', 'Розетка және қосқыштар', 'LED жарық'],
    },
    'potolochnye-sistemy': {
      title: 'Төбе жүйелері',
      text: 'Армстронг, грильято, гипсокартон төбелері, аспалы жүйелер және комплектілер.',
      bullets: ['Армстронг және грильято', 'Гипсокартон төбелері', 'Аспалы жүйелер', 'Комплектілер'],
    },
    'osb-fanera-uteplitel': {
      title: 'OSB, фанера және жылу оқшаулау',
      text: 'OSB, фанера, минералды мақта, гидрооқшаулау, мембраналар және жылу оқшаулағыш материалдар.',
      bullets: ['OSB және фанера', 'Минералды мақта', 'Гидрооқшаулау', 'Мембраналар'],
    },
  },
  en: {
    'gipsokarton-profili': {
      title: 'Drywall and profiles',
      text: 'Gypsum boards, tracks, studs, hangers, fasteners and accessories for partitions and ceilings.',
      bullets: ['Drywall sheets', 'Profiles and tracks', 'Hangers and fasteners', 'Accessories'],
    },
    'sukhie-smesi': {
      title: 'Dry mixes',
      text: 'Plaster, putty, self-leveling floors, tile adhesive, primers and consumables.',
      bullets: ['Plaster and putty', 'Tile adhesive', 'Self-leveling floors', 'Primers'],
    },
    'poly-plitka': {
      title: 'Flooring and tile',
      text: 'Porcelain tile, ceramic tile, vinyl flooring, laminate, skirting and installation materials.',
      bullets: ['Porcelain and tile', 'Vinyl and laminate', 'Skirting and thresholds', 'Grout and adhesives'],
    },
    'elektrika-osveshchenie': {
      title: 'Electrical and lighting',
      text: 'Cable, breakers, sockets, track lighting, fixtures and LED solutions for retail spaces.',
      bullets: ['Cable and wires', 'Breakers and panels', 'Sockets and switches', 'LED lighting'],
    },
    'potolochnye-sistemy': {
      title: 'Ceiling systems',
      text: 'Armstrong, grilyato, drywall ceilings, suspended systems and accessories.',
      bullets: ['Armstrong and grilyato', 'Drywall ceilings', 'Suspended systems', 'Accessories'],
    },
    'osb-fanera-uteplitel': {
      title: 'OSB, plywood and insulation',
      text: 'OSB, plywood, mineral wool, waterproofing, membranes and thermal insulation materials.',
      bullets: ['OSB and plywood', 'Mineral wool', 'Waterproofing', 'Membranes'],
    },
  },
};

export const dictionary = {
  ru: {
    timeLabel: 'ВРЕМЯ',
    nav: ['Услуги', 'Подход', 'Материалы', 'Проекты', 'Контакты'],
    estimateButton: 'Смета проекта',
    home: {
      title: 'Отделка и строительство магазинов в Алматы под ключ',
      tag: '[СМЕТА / МАТЕРИАЛЫ / СРОКИ]',
      text: 'Делаем внутреннюю отделку коммерческих помещений, считаем смету, поставляем материалы, контролируем сроки и сдаём объект к открытию.',
      primary: 'Рассчитать смету',
      secondary: 'Посмотреть проекты',
      city: 'Алматы, Казахстан',
    },
    services: {
      tag: '[УСЛУГИ]',
      title: 'Услуги',
      text: 'Строительство магазинов под ключ, ремонт торговых помещений и комплектация объектов материалами.',
      cta: 'Обсудить проект',
      items: [
        ['Отделка магазинов', 'Внутренняя отделка магазинов, бутиков, салонов, аптек, шоурумов и торговых помещений под ключ.'],
        ['Поставка материалов', 'Комплектация объекта материалами, логистика, закупка, контроль поставок и доставка по Алматы.'],
        ['Инженерные работы', 'Электрика, освещение, перегородки, потолки, полы и технические зоны.'],
      ],
    },
    approach: {
      tag: '[ПОДХОД]',
      title: 'Смета, сроки и качество должны быть управляемыми',
      text: 'Мы фиксируем этапы, считаем материалы, контролируем подрядчиков и помогаем запускать коммерческие пространства без хаоса на объекте.',
      items: ['Прозрачная смета', 'Контроль сроков', 'Подбор материалов', 'Работа по договору', 'Фотоотчёты по этапам', 'Сдача объекта под открытие'],
    },
    materials: {
      tag: '[МАТЕРИАЛЫ]',
      title: 'Материалы для коммерческой отделки',
      text: 'Комплектуем объекты материалами для ремонта магазинов, салонов, аптек и торговых помещений в Алматы. Подбираем, поставляем и считаем материалы вместе со сметой работ.',
      add: 'Добавить материалы в смету',
      price: 'Запросить прайс',
      categoriesTitle: 'Категории материалов',
      allCategories: 'Все категории',
    },
    catalog: {
      tag: '[СТРОЙМАТЕРИАЛЫ В АЛМАТЫ]',
      title: 'Каталог материалов',
      text: 'Выберите стройматериалы в Алматы и добавьте позиции в смету проекта. Мы уточним наличие, объём, доставку и монтаж под ваш объект.',
      toEstimate: 'Перейти к смете',
      all: 'Все товары',
      open: 'Открыть страницу каталога',
      back: 'Назад на сайт',
      location: 'Алматы / под заказ',
      price: 'по запросу',
      add: 'Добавить в смету',
    },
    estimate: {
      title: 'Смета проекта',
      note: 'Добавьте материалы в смету для расчёта.',
      empty: 'Материалы пока не выбраны',
      open: 'Открыть смету',
      how: 'Как это работает?',
      sent: 'Смета проекта отправлена на расчёт. Выбрано позиций:',
    },
    contact: {
      tag: '[CONTACT US]',
      title: 'Get in touch with us',
      office: 'Office',
      city: 'Алматы, Казахстан',
      text: 'Работаем с магазинами, аптеками, салонами и коммерческими помещениями по Алматы.',
      hours: 'Opening hours',
      footer: 'ALMABUILD PRO помогает коммерческим пространствам открываться вовремя, с контролем материалов и работ.',
    },
    categories: categories.ru,
  },
  kk: {
    timeLabel: 'УАҚЫТ',
    nav: ['Қызметтер', 'Тәсіл', 'Материалдар', 'Жобалар', 'Байланыс'],
    estimateButton: 'Жоба сметасы',
    home: {
      title: 'Алматыдағы дүкендерді әрлеу және салу толық циклмен',
      tag: '[СМЕТА / МАТЕРИАЛ / МЕРЗІМ]',
      text: 'Коммерциялық нысандардың ішкі әрлеуін жасаймыз, смета есептейміз, материал жеткіземіз, мерзімді бақылап, объектіні ашылуға дайындаймыз.',
      primary: 'Смета есептеу',
      secondary: 'Жобаларды көру',
      city: 'Алматы, Қазақстан',
    },
    services: {
      tag: '[ҚЫЗМЕТТЕР]',
      title: 'Қызметтер',
      text: 'Дүкендерді толық салу, сауда орындарын жөндеу және объектілерді материалдармен қамтамасыз ету.',
      cta: 'Жобаны талқылау',
      items: [
        ['Дүкендерді әрлеу', 'Дүкендер, бутиктер, салондар, дәріханалар, шоурумдар және сауда орындарын толық ішкі әрлеу.'],
        ['Материал жеткізу', 'Материал жинақтау, логистика, сатып алу, жеткізуді бақылау және Алматы бойынша жеткізу.'],
        ['Инженерлік жұмыстар', 'Электрика, жарық, қалқалар, төбе, еден және техникалық аймақтар.'],
      ],
    },
    approach: {
      tag: '[ТӘСІЛ]',
      title: 'Смета, мерзім және сапа басқарылатын болуы керек',
      text: 'Біз кезеңдерді бекітеміз, материалдарды есептейміз, мердігерлерді бақылаймыз және коммерциялық кеңістікті ретсіздіксіз іске қосуға көмектесеміз.',
      items: ['Ашық смета', 'Мерзімді бақылау', 'Материал таңдау', 'Келісімшартпен жұмыс', 'Кезеңдік фотоесеп', 'Объектіні ашылуға тапсыру'],
    },
    materials: {
      tag: '[МАТЕРИАЛДАР]',
      title: 'Коммерциялық әрлеуге арналған материалдар',
      text: 'Алматыдағы дүкен, салон, дәріхана және сауда орындарын жөндеуге материалдар жинақтаймыз. Таңдаймыз, жеткіземіз және жұмыс сметасымен бірге есептейміз.',
      add: 'Материалдарды сметаға қосу',
      price: 'Баға сұрау',
      categoriesTitle: 'Материал санаттары',
      allCategories: 'Барлық санаттар',
    },
    catalog: {
      tag: '[АЛМАТЫДАҒЫ ҚҰРЫЛЫС МАТЕРИАЛДАРЫ]',
      title: 'Материалдар каталогы',
      text: 'Құрылыс материалдарын таңдап, жоба сметасына қосыңыз. Біз қолжетімділік, көлем, жеткізу және монтажды нақтылаймыз.',
      toEstimate: 'Сметаға өту',
      all: 'Барлық тауарлар',
      open: 'Каталогты ашу',
      back: 'Сайтқа оралу',
      location: 'Алматы / тапсырыспен',
      price: 'сұраныс бойынша',
      add: 'Сметаға қосу',
    },
    estimate: {
      title: 'Жоба сметасы',
      note: 'Есептеу үшін материалдарды сметаға қосыңыз.',
      empty: 'Материалдар әлі таңдалмады',
      open: 'Сметаны ашу',
      how: 'Бұл қалай жұмыс істейді?',
      sent: 'Жоба сметасы есептеуге жіберілді. Таңдалған позициялар:',
    },
    contact: {
      tag: '[БАЙЛАНЫС]',
      title: 'Бізбен байланысыңыз',
      office: 'Кеңсе',
      city: 'Алматы, Қазақстан',
      text: 'Алматыдағы дүкендер, дәріханалар, салондар және коммерциялық нысандармен жұмыс істейміз.',
      hours: 'Жұмыс уақыты',
      footer: 'ALMABUILD PRO коммерциялық кеңістіктерді уақытында ашуға, материалдар мен жұмыстарды бақылауға көмектеседі.',
    },
    categories: categories.kk,
  },
  en: {
    timeLabel: 'TIME',
    nav: ['Services', 'Approach', 'Materials', 'Projects', 'Contact'],
    estimateButton: 'Project estimate',
    home: {
      title: 'Commercial fit-out and retail construction in Almaty',
      tag: '[ESTIMATE / MATERIALS / TIMELINE]',
      text: 'We deliver interior fit-out for commercial spaces, estimate costs, supply materials, control deadlines and prepare locations for opening.',
      primary: 'Calculate estimate',
      secondary: 'View projects',
      city: 'Almaty, Kazakhstan',
    },
    services: {
      tag: '[SERVICES]',
      title: 'Services',
      text: 'Turnkey retail construction, commercial renovation and material supply for projects in Almaty.',
      cta: 'Discuss project',
      items: [
        ['Retail fit-out', 'Interior fit-out for shops, boutiques, salons, pharmacies, showrooms and commercial spaces.'],
        ['Material supply', 'Material procurement, logistics, purchasing, delivery control and shipment across Almaty.'],
        ['Engineering works', 'Electrical works, lighting, partitions, ceilings, flooring and technical zones.'],
      ],
    },
    approach: {
      tag: '[APPROACH]',
      title: 'Estimate, timing and quality should stay under control',
      text: 'We fix stages, calculate materials, coordinate contractors and help commercial spaces launch without chaos on site.',
      items: ['Transparent estimate', 'Deadline control', 'Material selection', 'Contract-based work', 'Stage photo reports', 'Ready-for-opening handover'],
    },
    materials: {
      tag: '[MATERIALS]',
      title: 'Materials for commercial fit-out',
      text: 'We supply materials for shops, salons, pharmacies and retail spaces in Almaty. We select, deliver and calculate materials together with the work estimate.',
      add: 'Add materials to estimate',
      price: 'Request price list',
      categoriesTitle: 'Material categories',
      allCategories: 'All categories',
    },
    catalog: {
      tag: '[BUILDING MATERIALS IN ALMATY]',
      title: 'Materials catalog',
      text: 'Choose building materials in Almaty and add items to your project estimate. We will confirm availability, volume, delivery and installation.',
      toEstimate: 'Go to estimate',
      all: 'All products',
      open: 'Open catalog',
      back: 'Back to site',
      location: 'Almaty / on request',
      price: 'on request',
      add: 'Add to estimate',
    },
    estimate: {
      title: 'Project estimate',
      note: 'Add materials to calculate the project.',
      empty: 'No materials selected yet',
      open: 'Open estimate',
      how: 'How it works',
      sent: 'Project estimate sent for calculation. Selected items:',
    },
    contact: {
      tag: '[CONTACT US]',
      title: 'Get in touch with us',
      office: 'Office',
      city: 'Almaty, Kazakhstan',
      text: 'We work with shops, pharmacies, salons and commercial spaces across Almaty.',
      hours: 'Opening hours',
      footer: 'ALMABUILD PRO helps commercial spaces open on time, with materials and works under control.',
    },
    categories: categories.en,
  },
} as const;
