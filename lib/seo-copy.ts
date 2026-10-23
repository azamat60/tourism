import type { Locale } from './content';

export const pagePaths = {
  home: '/',
  tours: '/tours/',
  departures: '/open-tours/',
  about: '/about/',
  faq: '/faq/',
  booking: '/booking/',
  blog: '/blog/',
  proposals: '/proposals/',
} as const;
export type PageKey = keyof typeof pagePaths;
type SeoText = { title: string; description: string };

export const seoCopy: Record<Locale, Partial<Record<PageKey, SeoText>>> = {
  en: {
    home: {
      title: 'Kyrgyzstan Horse Trekking & Tours',
      description:
        'Explore Kyrgyzstan on horseback with local guides. Compare Song-Kul and Kel-Suu tours, yurt stays, itineraries, prices and group departures.',
    },
    tours: {
      title: 'Kyrgyzstan Tours: Song-Kul Horse Treks & Kel-Suu',
      description:
        'Compare guided horse treks to Song-Kul and multi-day Kyrgyzstan tours to Kel-Suu, Issyk-Kul and Karakol. See routes, prices and what is included.',
    },
    departures: {
      title: 'Kyrgyzstan Group Tours & Horse Trek Departures',
      description:
        'Find scheduled Kyrgyzstan tours and join a horse trekking group. Check departure dates, available places and group prices for each route.',
    },
    about: {
      title: 'Local Kyrgyzstan Tour Guides & Our Story',
      description:
        'Meet Nomad Discovery Tours, local nomads and horse lovers sharing Kyrgyzstan through guided horse treks, mountain adventures and yurt stays.',
    },
    faq: {
      title: 'Kyrgyzstan Horse Trekking FAQ: Packing & Yurt Stays',
      description:
        'Plan your Kyrgyzstan horse trek: riding experience, packing, seasons, accommodation, meals and booking. Answers from Nomad Discovery Tours.',
    },
    booking: {
      title: 'Plan a Private Kyrgyzstan Tour or Horse Trek',
      description:
        'Plan your Kyrgyzstan adventure with local guides. Tell us your dates, group size and preferred route for a private tour or horse trek.',
    },
    blog: {
      title: 'Kyrgyzstan Horse Trekking Guides & Travel Tips',
      description:
        'Prepare for horse trekking in Kyrgyzstan. Read practical guides to packing for the mountains, your first horse trek and staying in a Kyrgyz yurt.',
    },
    proposals: {
      title: 'Kyrgyzstan Marriage Proposals: Song-Kul & Kel-Suu',
      description:
        'Plan a private marriage proposal in Kyrgyzstan: Song-Kul sunsets, Kel-Suu mountain scenery and yurt stays. Discuss your ideas with our local team.',
    },
  },
  ru: {
    home: {
      title: 'Конные туры по Кыргызстану: Сон-Куль и Кель-Суу',
      description:
        'Конные туры по Кыргызстану с местными гидами. Сон-Куль, Кель-Суу, ночёвки в юртах. Сравните маршруты, цены и даты групповых выездов.',
    },
    tours: {
      title: 'Туры по Кыргызстану: Сон-Куль, Кель-Суу, Иссык-Куль',
      description:
        'Выберите конный тур на Сон-Куль или путешествие к Кель-Суу, Иссык-Кулю и Караколу. Программы по дням, цены и включённые услуги.',
    },
    departures: {
      title: 'Групповые туры по Кыргызстану: даты и свободные места',
      description:
        'Присоединяйтесь к группе для конного тура по Кыргызстану. Проверьте даты выездов, свободные места и стоимость выбранного маршрута.',
    },
    about: {
      title: 'Местные гиды по Кыргызстану — наша команда',
      description:
        'Nomad Discovery Tours: местные гиды, кочевая культура и любовь к лошадям. Организуем конные туры и путешествия по горам Кыргызстана.',
    },
    faq: {
      title: 'Конные туры по Кыргызстану: вопросы и подготовка',
      description:
        'Что взять в конный поход, нужен ли опыт верховой езды, как устроены ночёвки в юртах и питание. Ответы перед поездкой в Кыргызстан.',
    },
    booking: {
      title: 'Заказать индивидуальный тур по Кыргызстану',
      description:
        'Спланируйте конный тур или индивидуальное путешествие по Кыргызстану. Укажите даты, состав группы и желаемый маршрут — обсудим детали.',
    },
    blog: {
      title: 'Конные походы по Кыргызстану: советы и путеводители',
      description:
        'Подготовка к конному походу по Кыргызстану: что взять в горы, чего ждать от первого маршрута и как проходит ночёвка в кыргызской юрте.',
    },
    proposals: {
      title: 'Предложение руки и сердца в горах Кыргызстана',
      description:
        'Организуйте предложение руки и сердца на Сон-Куле или Кель-Суу. Обсудите с местной командой маршрут, ночёвку в юрте и детали сюрприза.',
    },
  },
  es: {
    home: {
      title: 'Rutas a caballo y viajes por Kirguistán',
      description:
        'Descubre Kirguistán a caballo con guías locales. Compara rutas a Song-Kul y Kel-Suu, noches en yurta, itinerarios, precios y salidas en grupo.',
    },
    tours: {
      title: 'Viajes por Kirguistán: Song-Kul y Kel-Suu',
      description:
        'Compara rutas a caballo a Song-Kul y viajes a Kel-Suu, Issyk-Kul y Karakol. Consulta itinerarios, precios y servicios incluidos.',
    },
    departures: {
      title: 'Viajes en grupo por Kirguistán: fechas y plazas',
      description:
        'Únete a una ruta a caballo por Kirguistán. Consulta fechas de salida, plazas disponibles y precios de grupo para cada itinerario.',
    },
  },
  fr: {
    home: {
      title: 'Randonnées à cheval et voyages au Kirghizistan',
      description:
        'Explorez le Kirghizistan à cheval avec des guides locaux. Song-Kul, Kel-Suu, nuits en yourte : comparez itinéraires, prix et départs en groupe.',
    },
    tours: {
      title: 'Voyages au Kirghizistan : Song-Kul et Kel-Suu',
      description:
        'Comparez les randonnées à cheval à Song-Kul et les circuits à Kel-Suu, Issyk-Kul et Karakol. Itinéraires, tarifs et prestations incluses.',
    },
    departures: {
      title: 'Voyages en groupe au Kirghizistan : départs et places',
      description:
        'Rejoignez un groupe pour une randonnée à cheval au Kirghizistan. Consultez les dates, les places disponibles et les tarifs par itinéraire.',
    },
  },
  it: {
    home: {
      title: 'Trekking a cavallo e viaggi in Kirghizistan',
      description:
        'Esplora il Kirghizistan a cavallo con guide locali. Confronta Song-Kul e Kel-Suu, notti in yurta, itinerari, prezzi e partenze di gruppo.',
    },
    tours: {
      title: 'Tour in Kirghizistan: Song-Kul e Kel-Suu',
      description:
        'Confronta trekking a cavallo a Song-Kul e tour a Kel-Suu, Issyk-Kul e Karakol. Scopri itinerari, prezzi e servizi inclusi.',
    },
    departures: {
      title: 'Tour di gruppo in Kirghizistan: date e posti',
      description:
        'Unisciti a un trekking a cavallo in Kirghizistan. Consulta date di partenza, posti disponibili e prezzi di gruppo per ogni itinerario.',
    },
  },
  ge: {
    home: {
      title: 'Reittrekking und Rundreisen in Kirgisistan',
      description:
        'Entdecke Kirgisistan zu Pferd mit lokalen Guides. Vergleiche Song-Kul und Kel-Suu, Jurtenübernachtungen, Routen, Preise und Gruppenreisen.',
    },
    tours: {
      title: 'Kirgisistan Reisen: Reittouren am Song-Kul und Kel-Suu',
      description:
        'Vergleiche Reittouren zum Song-Kul und Rundreisen nach Kel-Suu, Issyk-Kul und Karakol. Reiseverläufe, Preise und enthaltene Leistungen.',
    },
    departures: {
      title: 'Kirgisistan Gruppenreisen: Termine und freie Plätze',
      description:
        'Schließe dich einer Reittrekking-Gruppe in Kirgisistan an. Prüfe Reisetermine, freie Plätze und Gruppenpreise für jede Route.',
    },
  },
  zh: {
    home: {
      title: '吉尔吉斯斯坦骑马徒步与旅行',
      description:
        '跟随当地向导骑马探索吉尔吉斯斯坦。比较松库尔湖、克尔苏湖行程、毡房住宿、价格与拼团出发日期。',
    },
    tours: {
      title: '吉尔吉斯斯坦旅行：松库尔湖骑马与克尔苏湖',
      description:
        '比较松库尔湖骑马徒步，以及克尔苏湖、伊塞克湖和卡拉科尔多日游。查看每日行程、价格和包含的服务。',
    },
    departures: {
      title: '吉尔吉斯斯坦拼团游：出发日期与余位',
      description:
        '加入吉尔吉斯斯坦骑马旅行团。查看各条路线的出发日期、剩余名额和团体价格。',
    },
  },
  ar: {
    home: {
      title: 'رحلات الخيل والجولات في قرغيزستان',
      description:
        'اكتشف قرغيزستان على ظهور الخيل مع مرشدين محليين. قارن رحلات سونغ كول وكيل سو والإقامة في اليورت والأسعار ومواعيد المجموعات.',
    },
    tours: {
      title: 'جولات قرغيزستان: سونغ كول وكيل سو',
      description:
        'قارن رحلات الخيل إلى سونغ كول والجولات إلى كيل سو وإيسيك كول وكاراكول. اطّلع على البرامج اليومية والأسعار والخدمات المشمولة.',
    },
    departures: {
      title: 'رحلات جماعية في قرغيزستان: المواعيد والأماكن',
      description:
        'انضم إلى مجموعة لرحلة خيل في قرغيزستان. تحقّق من مواعيد الانطلاق والأماكن المتاحة وأسعار المجموعات لكل مسار.',
    },
  },
};
