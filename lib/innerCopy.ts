import type { Locale } from '@/lib/content';

export type InnerCopy = {
  back: string; journeyLabel: string; overview: string; itinerary: string; details: string;
  duration: string; destination: string; format: string; private: string; day: string; days: string; nights: string;
  routeNote: string; planThis: string; planHeading: string; planDescription: string; moreJourneys: string;
  plannerLabel: string; plannerTitle: string; plannerDescription: string; journey: string; custom: string;
  month: string; travelers: string; interests: string; riding: string; yurts: string; landscapes: string; culture: string;
  notes: string; notesPlaceholder: string; summary: string; send: string; optional: string; noMonth: string;
};

export const innerCopy: Record<Locale, InnerCopy> = {
  en: {
    back: 'Back to journeys', journeyLabel: 'THE JOURNEY', overview: 'A closer look', itinerary: 'Suggested itinerary', details: 'At a glance',
    duration: 'Duration', destination: 'Destination', format: 'Format', private: 'Private journey', day: 'Day', days: 'Days', nights: 'nights',
    routeNote: 'This is a suggested route. Timing, accommodation, and activities are confirmed with you before booking.',
    planThis: 'Plan this journey', planHeading: 'Make it yours.', planDescription: 'Tell us your dates, group size, and what matters most. We will shape the route with you.', moreJourneys: 'More journeys',
    plannerLabel: 'DESIGN YOUR ADVENTURE', plannerTitle: 'A journey made for you.', plannerDescription: 'Choose a starting route and share a few details. Your plan opens as a ready-to-send WhatsApp message.',
    journey: 'Starting route', custom: 'Help me choose', month: 'Travel month', travelers: 'Travelers', interests: 'What draws you here?',
    riding: 'Horse riding', yurts: 'Yurt stays', landscapes: 'Mountain lakes', culture: 'Nomadic culture',
    notes: 'Anything else?', notesPlaceholder: 'Your pace, riding experience, must-see places…', summary: 'Your journey', send: 'Send plan on WhatsApp', optional: 'Optional', noMonth: 'Flexible dates',
  },
  es: {
    back: 'Volver a los viajes', journeyLabel: 'EL VIAJE', overview: 'Conoce la ruta', itinerary: 'Itinerario sugerido', details: 'Datos clave',
    duration: 'Duración', destination: 'Destino', format: 'Formato', private: 'Viaje privado', day: 'Día', days: 'Días', nights: 'noches',
    routeNote: 'Esta ruta es una propuesta. Confirmamos horarios, alojamiento y actividades contigo antes de reservar.',
    planThis: 'Planificar este viaje', planHeading: 'Hazlo tuyo.', planDescription: 'Cuéntanos tus fechas, el tamaño del grupo y lo que más te interesa. Diseñaremos la ruta contigo.', moreJourneys: 'Más viajes',
    plannerLabel: 'DISEÑA TU AVENTURA', plannerTitle: 'Un viaje a tu medida.', plannerDescription: 'Elige una ruta inicial y comparte algunos detalles. Tu plan se abrirá como mensaje de WhatsApp listo para enviar.',
    journey: 'Ruta inicial', custom: 'Ayúdame a elegir', month: 'Mes del viaje', travelers: 'Viajeros', interests: '¿Qué te atrae?',
    riding: 'Montar a caballo', yurts: 'Dormir en yurtas', landscapes: 'Lagos de montaña', culture: 'Cultura nómada',
    notes: '¿Algo más?', notesPlaceholder: 'Tu ritmo, experiencia a caballo, lugares imprescindibles…', summary: 'Tu viaje', send: 'Enviar plan por WhatsApp', optional: 'Opcional', noMonth: 'Fechas flexibles',
  },
  fr: {
    back: 'Retour aux voyages', journeyLabel: 'LE VOYAGE', overview: 'Découvrir le parcours', itinerary: 'Itinéraire suggéré', details: 'En bref',
    duration: 'Durée', destination: 'Destination', format: 'Formule', private: 'Voyage privé', day: 'Jour', days: 'Jours', nights: 'nuits',
    routeNote: 'Cet itinéraire est une suggestion. Dates, hébergements et activités sont confirmés avec vous avant réservation.',
    planThis: 'Planifier ce voyage', planHeading: 'À votre image.', planDescription: 'Indiquez vos dates, la taille du groupe et vos envies. Nous construirons le parcours ensemble.', moreJourneys: 'Autres voyages',
    plannerLabel: 'CRÉEZ VOTRE AVENTURE', plannerTitle: 'Un voyage à votre image.', plannerDescription: 'Choisissez un parcours de départ et partagez quelques détails. Votre projet s’ouvrira dans un message WhatsApp prêt à envoyer.',
    journey: 'Parcours de départ', custom: 'Aidez-moi à choisir', month: 'Mois du voyage', travelers: 'Voyageurs', interests: 'Vos envies',
    riding: 'Randonnée à cheval', yurts: 'Nuits en yourte', landscapes: 'Lacs de montagne', culture: 'Culture nomade',
    notes: 'Autre chose ?', notesPlaceholder: 'Votre rythme, expérience à cheval, lieux à voir…', summary: 'Votre voyage', send: 'Envoyer via WhatsApp', optional: 'Facultatif', noMonth: 'Dates flexibles',
  },
  it: {
    back: 'Torna ai viaggi', journeyLabel: 'IL VIAGGIO', overview: 'Scopri il percorso', itinerary: 'Itinerario suggerito', details: 'In breve',
    duration: 'Durata', destination: 'Destinazione', format: 'Formula', private: 'Viaggio privato', day: 'Giorno', days: 'Giorni', nights: 'notti',
    routeNote: 'Questo itinerario è una proposta. Tempi, alloggi e attività vengono confermati con te prima della prenotazione.',
    planThis: 'Pianifica questo viaggio', planHeading: 'Rendilo tuo.', planDescription: 'Raccontaci date, numero di viaggiatori e interessi. Costruiremo il percorso insieme.', moreJourneys: 'Altri viaggi',
    plannerLabel: 'CREA LA TUA AVVENTURA', plannerTitle: 'Un viaggio fatto per te.', plannerDescription: 'Scegli un percorso di partenza e condividi qualche dettaglio. Il piano si aprirà come messaggio WhatsApp pronto da inviare.',
    journey: 'Percorso iniziale', custom: 'Aiutami a scegliere', month: 'Mese del viaggio', travelers: 'Viaggiatori', interests: 'Cosa ti attrae?',
    riding: 'Equitazione', yurts: 'Notti in yurta', landscapes: 'Laghi di montagna', culture: 'Cultura nomade',
    notes: 'Altro da aggiungere?', notesPlaceholder: 'Il tuo ritmo, esperienza a cavallo, luoghi da vedere…', summary: 'Il tuo viaggio', send: 'Invia su WhatsApp', optional: 'Facoltativo', noMonth: 'Date flessibili',
  },
  ge: {
    back: 'Zurück zu den Reisen', journeyLabel: 'DIE REISE', overview: 'Die Route entdecken', itinerary: 'Routenvorschlag', details: 'Auf einen Blick',
    duration: 'Dauer', destination: 'Ziel', format: 'Format', private: 'Privatreise', day: 'Tag', days: 'Tage', nights: 'Nächte',
    routeNote: 'Diese Route ist ein Vorschlag. Zeiten, Unterkünfte und Aktivitäten stimmen wir vor der Buchung mit dir ab.',
    planThis: 'Diese Reise planen', planHeading: 'Mach sie zu deiner Reise.', planDescription: 'Nenne uns Termine, Gruppengröße und Wünsche. Gemeinsam gestalten wir deine Route.', moreJourneys: 'Weitere Reisen',
    plannerLabel: 'GESTALTE DEIN ABENTEUER', plannerTitle: 'Eine Reise für dich.', plannerDescription: 'Wähle eine Route und teile ein paar Details. Dein Plan öffnet sich als fertige WhatsApp-Nachricht.',
    journey: 'Ausgangsroute', custom: 'Bei der Auswahl helfen', month: 'Reisemonat', travelers: 'Reisende', interests: 'Was interessiert dich?',
    riding: 'Reiten', yurts: 'Übernachtung in Jurten', landscapes: 'Bergseen', culture: 'Nomadische Kultur',
    notes: 'Noch etwas?', notesPlaceholder: 'Dein Tempo, Reiterfahrung, Wunschorte…', summary: 'Deine Reise', send: 'Plan per WhatsApp senden', optional: 'Optional', noMonth: 'Flexible Termine',
  },
  ru: {
    back: 'К маршрутам', journeyLabel: 'МАРШРУТ', overview: 'О путешествии', itinerary: 'Примерная программа', details: 'Коротко о поездке',
    duration: 'Продолжительность', destination: 'Направление', format: 'Формат', private: 'Индивидуальная поездка', day: 'День', days: 'Дни', nights: 'ночи',
    routeNote: 'Это пример маршрута. Время, проживание и занятия согласуем с вами до бронирования.',
    planThis: 'Спланировать этот маршрут', planHeading: 'Сделаем маршрут вашим.', planDescription: 'Напишите даты, размер группы и пожелания. Вместе составим поездку.', moreJourneys: 'Другие маршруты',
    plannerLabel: 'СОЗДАЙТЕ СВОЁ ПРИКЛЮЧЕНИЕ', plannerTitle: 'Путешествие под вас.', plannerDescription: 'Выберите маршрут и добавьте детали. Готовый запрос откроется в WhatsApp.',
    journey: 'Основа маршрута', custom: 'Помогите выбрать', month: 'Месяц поездки', travelers: 'Путешественники', interests: 'Что вам интересно?',
    riding: 'Конные прогулки', yurts: 'Ночёвки в юрте', landscapes: 'Горные озёра', culture: 'Кочевая культура',
    notes: 'Что ещё учесть?', notesPlaceholder: 'Ваш темп, опыт верховой езды, желаемые места…', summary: 'Ваша поездка', send: 'Отправить план в WhatsApp', optional: 'Необязательно', noMonth: 'Гибкие даты',
  },
  zh: {
    back: '返回路线', journeyLabel: '旅程', overview: '了解行程', itinerary: '建议行程', details: '行程概览',
    duration: '时长', destination: '目的地', format: '形式', private: '私人旅行', day: '第', days: '天', nights: '晚',
    routeNote: '此路线仅为建议。时间、住宿和活动将在预订前与您确认。',
    planThis: '规划此行程', planHeading: '打造你的旅程。', planDescription: '告诉我们时间、人数和偏好，一起设计路线。', moreJourneys: '更多路线',
    plannerLabel: '设计你的冒险', plannerTitle: '专属于你的旅程。', plannerDescription: '选择一条起始路线并填写细节。旅行计划将作为可发送的 WhatsApp 消息打开。',
    journey: '起始路线', custom: '帮我选择', month: '旅行月份', travelers: '旅行人数', interests: '你期待什么？',
    riding: '骑马', yurts: '毡房住宿', landscapes: '高山湖泊', culture: '游牧文化',
    notes: '其他想法？', notesPlaceholder: '旅行节奏、骑马经验、想去的地方…', summary: '你的旅程', send: '通过 WhatsApp 发送', optional: '选填', noMonth: '日期灵活',
  },
  ar: {
    back: 'العودة إلى الرحلات', journeyLabel: 'الرحلة', overview: 'عن الرحلة', itinerary: 'برنامج مقترح', details: 'لمحة سريعة',
    duration: 'المدة', destination: 'الوجهة', format: 'النوع', private: 'رحلة خاصة', day: 'اليوم', days: 'أيام', nights: 'ليالٍ',
    routeNote: 'هذا المسار مقترح. نؤكد المواعيد والإقامة والأنشطة معك قبل الحجز.',
    planThis: 'خطط لهذه الرحلة', planHeading: 'اجعلها رحلتك.', planDescription: 'أخبرنا بمواعيدك وعدد المسافرين وما يهمك. سنصمم المسار معاً.', moreJourneys: 'رحلات أخرى',
    plannerLabel: 'صمم مغامرتك', plannerTitle: 'رحلة مصممة لك.', plannerDescription: 'اختر مساراً أولياً وأضف بعض التفاصيل. ستفتح خطتك كرسالة واتساب جاهزة للإرسال.',
    journey: 'المسار الأولي', custom: 'ساعدني على الاختيار', month: 'شهر السفر', travelers: 'عدد المسافرين', interests: 'ما الذي يثير اهتمامك؟',
    riding: 'ركوب الخيل', yurts: 'الإقامة في الخيام', landscapes: 'البحيرات الجبلية', culture: 'الثقافة البدوية',
    notes: 'هل من تفاصيل أخرى؟', notesPlaceholder: 'وتيرتك، خبرتك في الركوب، أماكن ترغب بزيارتها…', summary: 'رحلتك', send: 'أرسل الخطة عبر واتساب', optional: 'اختياري', noMonth: 'مواعيد مرنة',
  },
};
