import type { Locale } from './content';

export type ExpandedCopy = {
  navTours: string; navDates: string; navFaq: string; navJournal: string; navBooking: string;
  catalogLabel: string; catalogTitle: string; catalogIntro: string; destination: string; duration: string;
  sort: string; allTours: string; shortest: string; longest: string; viewTour: string; reset: string; noTours: string;
  datesLabel: string; datesTitle: string; datesIntro: string; demoNotice: string; tour: string; all: string;
  date: string; end: string; price: string; seats: string; available: string; enquire: string;
  calendar: string; list: string; prev: string; next: string; noDates: string; privateTitle: string; privateText: string;
  bookingLabel: string; bookingTitle: string; bookingIntro: string; name: string; email: string; phone: string;
  guests: string; message: string; sendRequest: string; bookingNote: string; optional: string;
  aboutLabel: string; aboutTitle: string; aboutIntro: string; aboutSecond: string;
  faqLabel: string; faqTitle: string; faqIntro: string;
  journalLabel: string; journalTitle: string; journalIntro: string; readStory: string; backJournal: string;
  includedTitle: string; includedText: string; practicalTitle: string; practicalText: string;
  faq: { question: string; answer: string }[];
};

export const expandedCopy: Record<Locale, ExpandedCopy> = {
  en: {
    navTours: 'All tours', navDates: 'Dates', navFaq: 'FAQ', navJournal: 'Journal', navBooking: 'Enquire',
    catalogLabel: 'FIND YOUR ROUTE', catalogTitle: 'Explore the journeys', catalogIntro: 'Choose a starting point. Every itinerary can be shaped around your dates, pace and interests.', destination: 'Destination', duration: 'Duration',
    sort: 'Sort by', allTours: 'All journeys', shortest: 'Shortest first', longest: 'Longest first', viewTour: 'Explore tour', reset: 'Clear filters', noTours: 'No journeys match these filters.',
    datesLabel: 'TRAVEL TOGETHER', datesTitle: 'Upcoming departures', datesIntro: 'Explore sample group dates, or tell us when you would prefer to travel.', demoNotice: 'Sample dates, prices and places. These are demonstration details, not confirmed availability. Ask us to confirm before booking.', tour: 'Journey', all: 'All',
    date: 'Start date', end: 'End date', price: 'Indicative price', seats: 'Sample places', available: 'places left', enquire: 'Ask about this date',
    calendar: 'Calendar', list: 'Departures', prev: 'Previous month', next: 'Next month', noDates: 'No sample departures for this selection.', privateTitle: 'Your own dates?', privateText: 'Private routes can start on a date that works for you. Share your plans and we will check what is possible.',
    bookingLabel: 'START THE CONVERSATION', bookingTitle: 'Enquire about a journey', bookingIntro: 'Choose a route and preferred date. Your details open as a ready-to-send WhatsApp message.', name: 'Your name', email: 'Email', phone: 'WhatsApp number',
    guests: 'Travelers', message: 'Anything we should know?', sendRequest: 'Open request in WhatsApp', bookingNote: 'This is an enquiry. No place or price is confirmed until our team replies. No payment is taken here.', optional: 'Optional',
    aboutLabel: 'PEOPLE & PLACE', aboutTitle: 'Made with the mountains in mind.', aboutIntro: 'Nomad Discovery Tours is built around local knowledge, considered routes and room to explore at your own pace.', aboutSecond: 'We believe the best journeys begin with a conversation. Tell us how you want to travel; we will shape a route with clear expectations before you book.',
    faqLabel: 'GOOD TO KNOW', faqTitle: 'Questions before the journey', faqIntro: 'A few useful answers. Ask us directly about your route, season or travel needs.',
    journalLabel: 'FIELD NOTES', journalTitle: 'Stories from the trail', journalIntro: 'Practical ideas and small glimpses of life between the mountains.', readStory: 'Read story', backJournal: 'Back to journal',
    includedTitle: 'What can be arranged', includedText: 'Local guiding, horses where relevant, transport, meals and local stays can be part of your plan. Exact inclusions and exclusions are confirmed in your quote.', practicalTitle: 'Before you go', practicalText: 'Weather, route conditions and accommodation vary by season. Tell us about your riding experience and travel needs so we can recommend a suitable plan.',
    faq: [
      { question: 'How do I request a journey?', answer: 'Choose a tour or sample departure, then send the enquiry through WhatsApp. We will confirm route, dates, availability and price before any booking.' },
      { question: 'Can beginners join a horse trek?', answer: 'Some routes can suit first-time riders with a suitable pace and guide. Tell us your experience so we can recommend the right journey.' },
      { question: 'Can I choose different dates?', answer: 'Yes. Use the planning or enquiry page to share your preferred start date. We will check guide and accommodation availability.' },
      { question: 'What should I pack?', answer: 'Bring layers for changing mountain weather, a waterproof jacket, comfortable riding or walking shoes, sun protection and personal medication. We will send a route-specific list before departure.' },
      { question: 'What are the stays and meals like?', answer: 'Depending on the route, nights may be in yurts or guesthouses. Meals and dietary needs are discussed when we prepare your itinerary.' },
      { question: 'Are the listed prices and places final?', answer: 'No. Current dates, prices and places on this site are examples. We confirm the actual quote and availability with you directly.' },
    ],
  },
  ru: {
    navTours: 'Все туры', navDates: 'Даты', navFaq: 'Вопросы', navJournal: 'Журнал', navBooking: 'Заявка',
    catalogLabel: 'ВЫБЕРИТЕ МАРШРУТ', catalogTitle: 'Все путешествия', catalogIntro: 'Выберите основу для поездки. Даты, темп и интересы можно обсудить и изменить.', destination: 'Направление', duration: 'Продолжительность',
    sort: 'Сортировка', allTours: 'Все маршруты', shortest: 'Сначала короткие', longest: 'Сначала длинные', viewTour: 'Смотреть тур', reset: 'Сбросить фильтры', noTours: 'По этим фильтрам маршрутов нет.',
    datesLabel: 'ПУТЕШЕСТВУЙТЕ ВМЕСТЕ', datesTitle: 'Ближайшие выезды', datesIntro: 'Посмотрите примерные групповые даты или предложите удобное время.', demoNotice: 'Даты, цены и места — демонстрационные. Наличие мест не подтверждено. Уточните условия перед бронированием.', tour: 'Маршрут', all: 'Все',
    date: 'Начало', end: 'Окончание', price: 'Ориентир цены', seats: 'Места в примере', available: 'мест осталось', enquire: 'Узнать об этой дате',
    calendar: 'Календарь', list: 'Выезды', prev: 'Предыдущий месяц', next: 'Следующий месяц', noDates: 'На выбранный период примерных выездов нет.', privateTitle: 'Нужны другие даты?', privateText: 'Частный маршрут можно спланировать под вас. Расскажите о желаемых датах, и мы проверим возможности.',
    bookingLabel: 'НАЧНЁМ С ДИАЛОГА', bookingTitle: 'Оставить заявку', bookingIntro: 'Выберите маршрут и желаемую дату. Заявка откроется готовым сообщением в WhatsApp.', name: 'Ваше имя', email: 'Электронная почта', phone: 'Номер WhatsApp',
    guests: 'Путешественники', message: 'Что ещё важно знать?', sendRequest: 'Открыть заявку в WhatsApp', bookingNote: 'Это запрос. Место и цена подтверждаются только после ответа команды. Оплата здесь не принимается.', optional: 'Необязательно',
    aboutLabel: 'ЛЮДИ И МЕСТА', aboutTitle: 'Путешествия с уважением к горам.', aboutIntro: 'Nomad Discovery Tours строится на местном знании, продуманных маршрутах и свободе путешествовать в своём ритме.', aboutSecond: 'Лучшие поездки начинаются с разговора. Расскажите, какой опыт вам нужен, — вместе составим маршрут и согласуем детали до бронирования.',
    faqLabel: 'ПОЛЕЗНО ЗНАТЬ', faqTitle: 'Вопросы перед поездкой', faqIntro: 'Короткие ответы на частые вопросы. Детали вашего маршрута лучше обсудить напрямую.',
    journalLabel: 'ЗАМЕТКИ С МАРШРУТА', journalTitle: 'Истории из путешествий', journalIntro: 'Практические советы и зарисовки о жизни среди гор.', readStory: 'Читать', backJournal: 'К журналу',
    includedTitle: 'Что можно организовать', includedText: 'Местного гида, лошадей, трансфер, питание и проживание можно включить в программу. Точный перечень услуг согласуем в предложении.', practicalTitle: 'Перед поездкой', practicalText: 'Погода, состояние дорог и условия проживания зависят от сезона. Расскажите о своём опыте верховой езды и пожеланиях — подберём подходящий вариант.',
    faq: [
      { question: 'Как отправить заявку?', answer: 'Выберите маршрут или примерную дату и напишите нам через WhatsApp. Перед бронированием мы подтвердим программу, даты, места и цену.' },
      { question: 'Подойдут ли конные туры новичкам?', answer: 'Некоторые маршруты подходят для первого опыта при спокойном темпе и сопровождении гида. Сообщите нам свой уровень, и мы предложим вариант.' },
      { question: 'Можно выбрать другие даты?', answer: 'Да. Укажите желаемый день начала поездки в планировщике или заявке. Мы проверим доступность гида и проживания.' },
      { question: 'Что взять с собой?', answer: 'Одежду слоями, непромокаемую куртку, удобную обувь, защиту от солнца и личные лекарства. Перед выездом пришлём список под ваш маршрут.' },
      { question: 'Какое будет проживание и питание?', answer: 'В зависимости от маршрута — юрты или гостевые дома. Питание и диетические пожелания обсудим при подготовке программы.' },
      { question: 'Цены и места на сайте окончательные?', answer: 'Нет. Сейчас даты, цены и количество мест приведены как примеры. Реальное предложение и доступность подтвердим лично.' },
    ],
  },
  es: {
    navTours: 'Todos los viajes', navDates: 'Fechas', navFaq: 'Preguntas', navJournal: 'Diario', navBooking: 'Consulta',
    catalogLabel: 'ELIGE TU RUTA', catalogTitle: 'Explora los viajes', catalogIntro: 'Elige un punto de partida. Podemos adaptar fechas, ritmo e intereses.', destination: 'Destino', duration: 'Duración', sort: 'Ordenar', allTours: 'Todos los viajes', shortest: 'Más cortos', longest: 'Más largos', viewTour: 'Ver viaje', reset: 'Borrar filtros', noTours: 'No hay viajes con estos filtros.',
    datesLabel: 'VIAJEMOS JUNTOS', datesTitle: 'Próximas salidas', datesIntro: 'Explora fechas de ejemplo o dinos cuándo prefieres viajar.', demoNotice: 'Fechas, precios y plazas de muestra. No son disponibilidad confirmada. Consulta antes de reservar.', tour: 'Viaje', all: 'Todos', date: 'Inicio', end: 'Fin', price: 'Precio orientativo', seats: 'Plazas de muestra', available: 'plazas libres', enquire: 'Consultar esta fecha', calendar: 'Calendario', list: 'Salidas', prev: 'Mes anterior', next: 'Mes siguiente', noDates: 'No hay salidas de muestra para esta selección.', privateTitle: '¿Otras fechas?', privateText: 'Podemos preparar una ruta privada en las fechas que prefieras. Cuéntanos tus planes.',
    bookingLabel: 'EMPECEMOS A HABLAR', bookingTitle: 'Consultar un viaje', bookingIntro: 'Elige ruta y fecha. Tu solicitud se abrirá como mensaje de WhatsApp.', name: 'Tu nombre', email: 'Correo electrónico', phone: 'Número de WhatsApp', guests: 'Viajeros', message: '¿Algo más que debamos saber?', sendRequest: 'Abrir solicitud en WhatsApp', bookingNote: 'Es una consulta. Ni la plaza ni el precio se confirman hasta nuestra respuesta. Aquí no se cobra.', optional: 'Opcional',
    aboutLabel: 'PERSONAS Y LUGARES', aboutTitle: 'Pensado con las montañas en mente.', aboutIntro: 'Nomad Discovery Tours combina conocimiento local, rutas cuidadas y libertad para viajar a tu ritmo.', aboutSecond: 'Los mejores viajes empiezan con una conversación. Cuéntanos cómo quieres viajar y acordaremos los detalles antes de reservar.',
    faqLabel: 'BUENO SABER', faqTitle: 'Preguntas antes de viajar', faqIntro: 'Respuestas útiles. Escríbenos para hablar de tu ruta.', journalLabel: 'NOTAS DE CAMPO', journalTitle: 'Historias del camino', journalIntro: 'Ideas prácticas y pequeñas escenas de las montañas.', readStory: 'Leer historia', backJournal: 'Volver al diario',
    includedTitle: 'Qué podemos organizar', includedText: 'Guía local, caballos, transporte, comidas y alojamientos pueden formar parte del plan. Confirmaremos los servicios en la propuesta.', practicalTitle: 'Antes de salir', practicalText: 'El tiempo y las condiciones cambian según la estación. Cuéntanos tu experiencia a caballo y tus necesidades.',
    faq: [
      { question: '¿Cómo solicito un viaje?', answer: 'Elige una ruta o fecha de muestra y escríbenos por WhatsApp. Confirmaremos itinerario, disponibilidad y precio antes de reservar.' },
      { question: '¿Pueden venir principiantes?', answer: 'Algunas rutas son aptas para quien monta por primera vez. Dinos tu experiencia y buscaremos el ritmo adecuado.' },
      { question: '¿Puedo elegir otras fechas?', answer: 'Sí. Comparte tu fecha preferida y comprobaremos guías y alojamiento.' },
      { question: '¿Qué debo llevar?', answer: 'Ropa por capas, chaqueta impermeable, calzado cómodo, protección solar y medicamentos personales. Enviaremos una lista para tu ruta.' },
      { question: '¿Cómo son las estancias y comidas?', answer: 'Según la ruta, puedes dormir en yurtas o casas de huéspedes. Hablaremos de comidas y necesidades dietéticas.' },
      { question: '¿Los precios y plazas son definitivos?', answer: 'No. Las fechas, precios y plazas actuales son ejemplos. Confirmaremos los datos reales contigo.' },
    ],
  },
  fr: {
    navTours: 'Tous les voyages', navDates: 'Dates', navFaq: 'FAQ', navJournal: 'Carnet', navBooking: 'Demande',
    catalogLabel: 'CHOISIR SON ITINÉRAIRE', catalogTitle: 'Explorer les voyages', catalogIntro: 'Choisissez un point de départ. Dates, rythme et envies peuvent être adaptés.', destination: 'Destination', duration: 'Durée', sort: 'Trier', allTours: 'Tous les voyages', shortest: 'Les plus courts', longest: 'Les plus longs', viewTour: 'Voir le voyage', reset: 'Effacer les filtres', noTours: 'Aucun voyage pour ces filtres.',
    datesLabel: 'PARTIR ENSEMBLE', datesTitle: 'Prochains départs', datesIntro: 'Découvrez des dates indicatives ou proposez les vôtres.', demoNotice: 'Dates, tarifs et places fictifs. Disponibilité non confirmée. Contactez-nous avant toute réservation.', tour: 'Voyage', all: 'Tous', date: 'Départ', end: 'Retour', price: 'Tarif indicatif', seats: 'Places indicatives', available: 'places restantes', enquire: 'Demander cette date', calendar: 'Calendrier', list: 'Départs', prev: 'Mois précédent', next: 'Mois suivant', noDates: 'Aucun départ indicatif pour cette sélection.', privateTitle: 'Vos propres dates ?', privateText: 'Une route privée peut être organisée à vos dates. Parlez-nous de votre projet.',
    bookingLabel: 'PARLONS DE VOTRE VOYAGE', bookingTitle: 'Demander un voyage', bookingIntro: 'Choisissez un itinéraire et une date. Votre demande s’ouvre dans WhatsApp.', name: 'Votre nom', email: 'E-mail', phone: 'Numéro WhatsApp', guests: 'Voyageurs', message: 'Autre chose à savoir ?', sendRequest: 'Ouvrir la demande WhatsApp', bookingNote: 'Ceci est une demande. Place et tarif seront confirmés par notre équipe. Aucun paiement ici.', optional: 'Facultatif',
    aboutLabel: 'PERSONNES ET LIEUX', aboutTitle: 'Des voyages pensés pour la montagne.', aboutIntro: 'Nomad Discovery Tours s’appuie sur le savoir local, des itinéraires soignés et la liberté de voyager à son rythme.', aboutSecond: 'Les meilleurs voyages commencent par une conversation. Dites-nous ce qui vous plaît ; nous préciserons chaque détail avant la réservation.',
    faqLabel: 'BON À SAVOIR', faqTitle: 'Questions avant le départ', faqIntro: 'Quelques réponses utiles. Contactez-nous pour votre itinéraire.', journalLabel: 'NOTES DE TERRAIN', journalTitle: 'Histoires du chemin', journalIntro: 'Conseils et moments de vie entre les montagnes.', readStory: 'Lire', backJournal: 'Retour au carnet',
    includedTitle: 'Ce que nous pouvons organiser', includedText: 'Guide local, chevaux, transport, repas et nuits locales peuvent faire partie du séjour. Le devis précisera les prestations.', practicalTitle: 'Avant de partir', practicalText: 'Météo et conditions changent selon la saison. Précisez votre expérience à cheval et vos besoins.',
    faq: [
      { question: 'Comment demander un voyage ?', answer: 'Choisissez une route ou une date indicative et écrivez-nous sur WhatsApp. Nous confirmerons programme, disponibilité et tarif avant réservation.' },
      { question: 'Les débutants peuvent-ils monter ?', answer: 'Certains parcours conviennent à une première expérience. Indiquez votre niveau pour choisir le bon rythme.' },
      { question: 'Puis-je choisir mes dates ?', answer: 'Oui. Partagez votre date idéale ; nous vérifierons guides et hébergements.' },
      { question: 'Que faut-il emporter ?', answer: 'Des vêtements à superposer, une veste imperméable, des chaussures confortables, une protection solaire et vos médicaments. Une liste adaptée suivra.' },
      { question: 'Comment sont les nuits et les repas ?', answer: 'Selon le parcours, nuits en yourte ou maison d’hôtes. Nous discuterons des repas et régimes particuliers.' },
      { question: 'Tarifs et places sont-ils définitifs ?', answer: 'Non. Les dates, tarifs et places affichés sont des exemples. Nous confirmerons les données réelles ensemble.' },
    ],
  },
  it: {
    navTours: 'Tutti i viaggi', navDates: 'Date', navFaq: 'Domande', navJournal: 'Diario', navBooking: 'Richiesta',
    catalogLabel: 'SCEGLI IL PERCORSO', catalogTitle: 'Esplora i viaggi', catalogIntro: 'Scegli un punto di partenza. Date, ritmo e interessi si possono adattare.', destination: 'Destinazione', duration: 'Durata', sort: 'Ordina', allTours: 'Tutti i viaggi', shortest: 'Più brevi', longest: 'Più lunghi', viewTour: 'Scopri il viaggio', reset: 'Cancella filtri', noTours: 'Nessun viaggio per questi filtri.',
    datesLabel: 'PARTIRE INSIEME', datesTitle: 'Prossime partenze', datesIntro: 'Esplora date di esempio o proponi quelle che preferisci.', demoNotice: 'Date, prezzi e posti dimostrativi. Disponibilità da confermare. Contattaci prima di prenotare.', tour: 'Viaggio', all: 'Tutti', date: 'Partenza', end: 'Ritorno', price: 'Prezzo indicativo', seats: 'Posti di esempio', available: 'posti rimasti', enquire: 'Chiedi di questa data', calendar: 'Calendario', list: 'Partenze', prev: 'Mese precedente', next: 'Mese successivo', noDates: 'Nessuna partenza di esempio per questa scelta.', privateTitle: 'Altre date?', privateText: 'Possiamo organizzare un percorso privato nelle tue date. Raccontaci il tuo piano.',
    bookingLabel: 'INIZIAMO A PARLARE', bookingTitle: 'Richiedi un viaggio', bookingIntro: 'Scegli percorso e data. La richiesta si aprirà come messaggio WhatsApp.', name: 'Il tuo nome', email: 'Email', phone: 'Numero WhatsApp', guests: 'Viaggiatori', message: 'Altro da sapere?', sendRequest: 'Apri richiesta WhatsApp', bookingNote: 'È una richiesta. Posto e prezzo saranno confermati dal nostro team. Nessun pagamento qui.', optional: 'Facoltativo',
    aboutLabel: 'PERSONE E LUOGHI', aboutTitle: 'Viaggi pensati per la montagna.', aboutIntro: 'Nomad Discovery Tours unisce conoscenza locale, percorsi curati e libertà di viaggiare al tuo ritmo.', aboutSecond: 'I migliori viaggi iniziano con una conversazione. Raccontaci come vuoi viaggiare: definiremo ogni dettaglio prima della prenotazione.',
    faqLabel: 'DA SAPERE', faqTitle: 'Domande prima del viaggio', faqIntro: 'Alcune risposte utili. Scrivici per il tuo percorso.', journalLabel: 'APPUNTI DI VIAGGIO', journalTitle: 'Storie dal sentiero', journalIntro: 'Consigli pratici e momenti di vita tra le montagne.', readStory: 'Leggi', backJournal: 'Torna al diario',
    includedTitle: 'Cosa possiamo organizzare', includedText: 'Guida locale, cavalli, trasporto, pasti e soggiorni possono far parte del piano. La proposta confermerà i servizi.', practicalTitle: 'Prima di partire', practicalText: 'Meteo e condizioni cambiano con la stagione. Raccontaci la tua esperienza a cavallo e le tue esigenze.',
    faq: [
      { question: 'Come richiedo un viaggio?', answer: 'Scegli percorso o data di esempio e scrivici su WhatsApp. Confermeremo itinerario, disponibilità e prezzo prima di prenotare.' },
      { question: 'I principianti possono partecipare?', answer: 'Alcuni percorsi vanno bene anche alla prima esperienza. Indicaci il tuo livello per scegliere il ritmo giusto.' },
      { question: 'Posso scegliere altre date?', answer: 'Sì. Condividi la data preferita e verificheremo guide e alloggi.' },
      { question: 'Cosa devo portare?', answer: 'Vestiti a strati, giacca impermeabile, scarpe comode, protezione solare e medicine personali. Invieremo una lista per il percorso.' },
      { question: 'Come sono alloggi e pasti?', answer: 'Secondo il percorso, si dorme in yurte o guesthouse. Parleremo di pasti e esigenze alimentari.' },
      { question: 'Prezzi e posti sono definitivi?', answer: 'No. Date, prezzi e posti sul sito sono esempi. Confermeremo i dati reali con te.' },
    ],
  },
  ge: {
    navTours: 'Alle Reisen', navDates: 'Termine', navFaq: 'FAQ', navJournal: 'Journal', navBooking: 'Anfrage',
    catalogLabel: 'ROUTE WÄHLEN', catalogTitle: 'Reisen entdecken', catalogIntro: 'Wähle einen Ausgangspunkt. Termine, Tempo und Interessen lassen sich anpassen.', destination: 'Ziel', duration: 'Dauer', sort: 'Sortieren', allTours: 'Alle Reisen', shortest: 'Kürzeste zuerst', longest: 'Längste zuerst', viewTour: 'Reise ansehen', reset: 'Filter löschen', noTours: 'Keine passenden Reisen.',
    datesLabel: 'GEMEINSAM REISEN', datesTitle: 'Nächste Abfahrten', datesIntro: 'Sieh dir Beispieltermine an oder nenne uns deinen Wunschtermin.', demoNotice: 'Termine, Preise und Plätze sind Beispiele. Verfügbarkeit ist nicht bestätigt. Bitte vor Buchung anfragen.', tour: 'Reise', all: 'Alle', date: 'Beginn', end: 'Ende', price: 'Richtpreis', seats: 'Beispielplätze', available: 'Plätze frei', enquire: 'Diesen Termin anfragen', calendar: 'Kalender', list: 'Abfahrten', prev: 'Vormonat', next: 'Nächster Monat', noDates: 'Keine Beispieltermine für diese Auswahl.', privateTitle: 'Eigene Termine?', privateText: 'Eine private Route kann zu deinem Wunschtermin starten. Erzähle uns von deinen Plänen.',
    bookingLabel: 'INS GESPRÄCH KOMMEN', bookingTitle: 'Reise anfragen', bookingIntro: 'Wähle Route und Datum. Deine Anfrage öffnet sich als WhatsApp-Nachricht.', name: 'Dein Name', email: 'E-Mail', phone: 'WhatsApp-Nummer', guests: 'Reisende', message: 'Noch etwas Wichtiges?', sendRequest: 'Anfrage in WhatsApp öffnen', bookingNote: 'Dies ist eine Anfrage. Platz und Preis werden erst nach unserer Antwort bestätigt. Keine Zahlung hier.', optional: 'Optional',
    aboutLabel: 'MENSCHEN UND ORTE', aboutTitle: 'Mit den Bergen im Herzen.', aboutIntro: 'Nomad Discovery Tours verbindet lokales Wissen, sorgfältige Routen und Raum für dein eigenes Tempo.', aboutSecond: 'Die besten Reisen beginnen mit einem Gespräch. Erzähle uns deine Wünsche; vor der Buchung klären wir alle Details.',
    faqLabel: 'GUT ZU WISSEN', faqTitle: 'Fragen vor der Reise', faqIntro: 'Nützliche Antworten. Frag uns direkt zu deiner Route.', journalLabel: 'NOTIZEN VOM WEG', journalTitle: 'Geschichten vom Pfad', journalIntro: 'Praktische Ideen und Einblicke in das Leben in den Bergen.', readStory: 'Lesen', backJournal: 'Zurück zum Journal',
    includedTitle: 'Was wir organisieren können', includedText: 'Lokale Führung, Pferde, Transport, Mahlzeiten und Unterkünfte können Teil der Reise sein. Das Angebot bestätigt die Leistungen.', practicalTitle: 'Vor der Reise', practicalText: 'Wetter und Bedingungen ändern sich mit der Saison. Teile uns deine Reiterfahrung und Bedürfnisse mit.',
    faq: [
      { question: 'Wie frage ich eine Reise an?', answer: 'Wähle Route oder Beispieltermin und schreibe uns per WhatsApp. Wir bestätigen Programm, Verfügbarkeit und Preis vor der Buchung.' },
      { question: 'Sind Reittouren für Anfänger geeignet?', answer: 'Manche Routen eignen sich für erste Erfahrungen. Teile uns dein Können mit, damit wir das passende Tempo finden.' },
      { question: 'Kann ich andere Termine wählen?', answer: 'Ja. Nenne deinen Wunschtermin; wir prüfen Guides und Unterkünfte.' },
      { question: 'Was soll ich mitnehmen?', answer: 'Kleidung im Zwiebellook, Regenjacke, bequeme Schuhe, Sonnenschutz und persönliche Medikamente. Eine Routenliste folgt.' },
      { question: 'Wie sind Unterkunft und Essen?', answer: 'Je nach Route übernachtest du in Jurten oder Gästehäusern. Mahlzeiten und Ernährung besprechen wir bei der Planung.' },
      { question: 'Sind Preise und Plätze endgültig?', answer: 'Nein. Termine, Preise und Plätze sind Beispiele. Die tatsächlichen Daten bestätigen wir persönlich.' },
    ],
  },
  zh: {
    navTours: '全部行程', navDates: '出发日期', navFaq: '常见问题', navJournal: '旅行日志', navBooking: '咨询',
    catalogLabel: '寻找路线', catalogTitle: '探索行程', catalogIntro: '选择一条路线作为起点。日期、节奏和兴趣都可以调整。', destination: '目的地', duration: '时长', sort: '排序', allTours: '全部行程', shortest: '短途优先', longest: '长途优先', viewTour: '查看行程', reset: '清除筛选', noTours: '没有符合条件的行程。',
    datesLabel: '结伴出行', datesTitle: '即将出发', datesIntro: '浏览示例团队日期，也可以告诉我们理想的出发时间。', demoNotice: '日期、价格和名额均为演示信息，并非已确认的余位。预订前请咨询。', tour: '行程', all: '全部', date: '开始日期', end: '结束日期', price: '参考价格', seats: '示例名额', available: '个空位', enquire: '咨询此日期', calendar: '日历', list: '出发计划', prev: '上个月', next: '下个月', noDates: '当前筛选没有示例行程。', privateTitle: '想选其他日期？', privateText: '私人路线可以按你的时间安排。告诉我们你的计划。',
    bookingLabel: '开启对话', bookingTitle: '咨询行程', bookingIntro: '选择路线和日期，系统会生成可在 WhatsApp 发送的消息。', name: '姓名', email: '电子邮箱', phone: 'WhatsApp 号码', guests: '旅客人数', message: '还有什么需要说明？', sendRequest: '在 WhatsApp 打开咨询', bookingNote: '此为咨询。名额与价格须由团队回复确认。此处不收取付款。', optional: '选填',
    aboutLabel: '人与地方', aboutTitle: '为山野而设计的旅程。', aboutIntro: 'Nomad Discovery Tours 结合当地知识、用心设计的路线和自由的旅行节奏。', aboutSecond: '美好的旅程始于交流。告诉我们你的想法，我们会在预订前确认所有细节。',
    faqLabel: '行前须知', faqTitle: '出发前的疑问', faqIntro: '一些实用解答。具体路线欢迎直接咨询。', journalLabel: '山野笔记', journalTitle: '路上的故事', journalIntro: '实用建议与山间生活片段。', readStory: '阅读', backJournal: '返回日志',
    includedTitle: '可安排的服务', includedText: '当地向导、马匹、交通、餐食和住宿可纳入计划。实际包含项目以报价为准。', practicalTitle: '出发之前', practicalText: '天气和路况随季节变化。请告诉我们你的骑马经验与旅行需求。',
    faq: [
      { question: '如何咨询行程？', answer: '选择路线或示例日期，通过 WhatsApp 联系我们。预订前会确认路线、日期、余位和价格。' },
      { question: '初学者可以参加骑行吗？', answer: '部分路线适合初次骑马的人。请说明经验，我们会建议合适的节奏。' },
      { question: '可以选择其他日期吗？', answer: '可以。告诉我们理想日期，我们会确认向导和住宿的安排。' },
      { question: '需要准备什么？', answer: '分层衣物、防水外套、舒适鞋履、防晒用品和个人药品。出发前会提供针对路线的清单。' },
      { question: '住宿和餐食如何安排？', answer: '视路线而定，可能入住毡房或民宿。餐食和饮食需求会在制定行程时讨论。' },
      { question: '网站价格和名额最终确定了吗？', answer: '没有。目前的日期、价格和名额是示例。实际信息由我们直接确认。' },
    ],
  },
  ar: {
    navTours: 'كل الرحلات', navDates: 'المواعيد', navFaq: 'الأسئلة', navJournal: 'المدونة', navBooking: 'استفسار',
    catalogLabel: 'اختر مسارك', catalogTitle: 'استكشف الرحلات', catalogIntro: 'اختر مساراً للبدء، ويمكن تعديل المواعيد والوتيرة والاهتمامات.', destination: 'الوجهة', duration: 'المدة', sort: 'الترتيب', allTours: 'كل الرحلات', shortest: 'الأقصر أولاً', longest: 'الأطول أولاً', viewTour: 'عرض الرحلة', reset: 'مسح الفلاتر', noTours: 'لا توجد رحلات مطابقة.',
    datesLabel: 'سافروا معاً', datesTitle: 'المغادرات القادمة', datesIntro: 'تصفح مواعيد نموذجية أو أخبرنا بموعدك المفضل.', demoNotice: 'المواعيد والأسعار والأماكن أمثلة توضيحية وليست توفرًا مؤكداً. تواصل معنا قبل الحجز.', tour: 'الرحلة', all: 'الكل', date: 'البداية', end: 'النهاية', price: 'سعر تقريبي', seats: 'أماكن نموذجية', available: 'أماكن متبقية', enquire: 'استفسر عن هذا الموعد', calendar: 'التقويم', list: 'المغادرات', prev: 'الشهر السابق', next: 'الشهر التالي', noDates: 'لا توجد مواعيد نموذجية لهذا الاختيار.', privateTitle: 'تفضل موعداً آخر؟', privateText: 'يمكن ترتيب رحلة خاصة في موعد يناسبك. أخبرنا بخطتك.',
    bookingLabel: 'لنبدأ الحديث', bookingTitle: 'استفسر عن رحلة', bookingIntro: 'اختر المسار والموعد. ستفتح رسالتك الجاهزة في واتساب.', name: 'اسمك', email: 'البريد الإلكتروني', phone: 'رقم واتساب', guests: 'عدد المسافرين', message: 'هل هناك معلومات إضافية؟', sendRequest: 'فتح الطلب في واتساب', bookingNote: 'هذا استفسار فقط. لا يتم تأكيد المكان أو السعر إلا بعد رد فريقنا. لا يوجد دفع هنا.', optional: 'اختياري',
    aboutLabel: 'الناس والمكان', aboutTitle: 'رحلات تراعي روح الجبال.', aboutIntro: 'تجمع Nomad Discovery Tours بين معرفة أهل المنطقة والمسارات المدروسة وحرية السفر بإيقاعك.', aboutSecond: 'أفضل الرحلات تبدأ بحوار. شاركنا رؤيتك وسنوضح التفاصيل قبل الحجز.',
    faqLabel: 'معلومات مفيدة', faqTitle: 'أسئلة قبل الرحلة', faqIntro: 'إجابات مختصرة. تواصل معنا بشأن مسارك.', journalLabel: 'ملاحظات من الطريق', journalTitle: 'قصص من الدروب', journalIntro: 'نصائح عملية ولمحات من الحياة بين الجبال.', readStory: 'اقرأ القصة', backJournal: 'العودة إلى المدونة',
    includedTitle: 'ما يمكن ترتيبه', includedText: 'يمكن أن تشمل الخطة مرشداً محلياً وخيولاً ونقلاً ووجبات وإقامة. العرض النهائي يحدد الخدمات بدقة.', practicalTitle: 'قبل الانطلاق', practicalText: 'يتغير الطقس وحالة الطرق حسب الموسم. أخبرنا بخبرتك في الركوب واحتياجاتك.',
    faq: [
      { question: 'كيف أستفسر عن رحلة؟', answer: 'اختر مساراً أو موعداً نموذجياً وأرسل رسالة واتساب. سنؤكد البرنامج والتوفر والسعر قبل الحجز.' },
      { question: 'هل تناسب الرحلات المبتدئين؟', answer: 'بعض المسارات تناسب التجربة الأولى. أخبرنا بمستواك لنقترح وتيرة مناسبة.' },
      { question: 'هل يمكنني اختيار موعد مختلف؟', answer: 'نعم. شاركنا الموعد المفضل وسنتحقق من توفر المرشدين والإقامة.' },
      { question: 'ماذا أحضر معي؟', answer: 'ملابس متعددة الطبقات وسترة مقاومة للمطر وحذاء مريح وواقي شمس وأدويتك الشخصية. سنرسل قائمة خاصة بالمسار.' },
      { question: 'كيف تكون الإقامة والطعام؟', answer: 'قد تكون الإقامة في خيام يورت أو بيوت ضيافة حسب المسار. نناقش الوجبات والاحتياجات الغذائية عند التخطيط.' },
      { question: 'هل الأسعار والأماكن نهائية؟', answer: 'لا. المواعيد والأسعار والأماكن الحالية أمثلة. سنؤكد المعلومات الفعلية مباشرة.' },
    ],
  },
};
