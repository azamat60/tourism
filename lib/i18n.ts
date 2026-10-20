import type { Locale } from './content';
import source from './translations/source.json';
import es from './translations/es.json';
import fr from './translations/fr.json';
import it from './translations/it.json';
import ge from './translations/ge.json';
import ru from './translations/ru.json';
import zh from './translations/zh.json';
import ar from './translations/ar.json';

const faqLabel: Record<Locale, string> = { en: 'FAQ', es: 'Preguntas frecuentes', fr: 'FAQ', it: 'Domande frequenti', ge: 'FAQ', ru: 'Вопросы', zh: '常见问题', ar: 'الأسئلة الشائعة' };
const personUnit: Record<Locale, string> = { en: '/ person', es: '/ persona', fr: '/ personne', it: '/ persona', ge: '/ Person', ru: '/ чел.', zh: '/ 人', ar: '/ شخص' };
const dictionaries: Record<Exclude<Locale, 'en'>, readonly string[]> = { es, fr, it, ge, ru, zh, ar };
const normalized = (text: string) => text.replace(/\s+/g, ' ').trim();
const keys = new Map(source.map((text, index) => [normalized(text), index]));
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const templates = source.flatMap((text, index) => {
  if (!/\{\d+\}/.test(text) || text.replace(/\{\d+\}/g, '').length < 4) return [];
  const slots: number[] = [];
  const pattern = text.split(/(\{\d+\})/).map((part) => {
    const match = /^\{(\d+)\}$/.exec(part);
    if (!match) return escape(part);
    slots.push(Number(match[1]));
    return '(.*?)';
  }).join('');
  return [{ index, slots, pattern: new RegExp(`^${pattern}$`), length: text.replace(/\{\d+\}/g, '').length }];
}).sort((a, b) => b.length - a.length);

export function translate<T>(locale: Locale, value: T): T {
  if (locale === 'en' || typeof value !== 'string' || !value.trim()) return value;
  const text = normalized(value);
  if (text === '/ person') return personUnit[locale] as T;
  if (text === 'FAQ') return faqLabel[locale] as T;
  const index = keys.get(text);
  const dictionary = dictionaries[locale];
  let result = index === undefined ? undefined : dictionary[index] ?? undefined;
  if (result === undefined) {
    for (const template of templates) {
      const match = template.pattern.exec(text);
      if (!match) continue;
      result = dictionary[template.index]?.replace(/\{(\d+)\}/g, (_, slot: string) => {
        const position = template.slots.indexOf(Number(slot));
        return translate(locale, match[position + 1] || '');
      });
      if (result !== undefined) break;
    }
  }
  if (result === undefined && /\n|, | · | \| /.test(value)) {
    return value.split(/(\n|, | · | \| )/).map((part) => /^(\n|, | · | \| )$/.test(part) ? part : translate(locale, part)).join('') as T;
  }
  if (result === undefined) return value;
  return `${value.match(/^\s*/)?.[0] || ''}${result}${value.match(/\s*$/)?.[0] || ''}` as T;
}

export function countryName(locale: Locale, iso: string, fallback: string) {
  return new Intl.DisplayNames([locale === 'ge' ? 'de' : locale], { type: 'region' }).of(iso) || fallback;
}

type CountUnit = 'day' | 'tour' | 'departure' | 'destination' | 'photo' | 'space';
const countWords: Record<Locale, Record<CountUnit, string[]>> = {
  en: { space: ['space left', 'spaces left'], day: ['day', 'days'], tour: ['tour', 'tours'], departure: ['departure', 'departures'], destination: ['destination', 'destinations'], photo: ['photo', 'photos'] },
  es: { space: ['plaza disponible', 'plazas disponibles'], day: ['día', 'días'], tour: ['circuito', 'circuitos'], departure: ['salida', 'salidas'], destination: ['destino', 'destinos'], photo: ['foto', 'fotos'] },
  fr: { space: ['place disponible', 'places disponibles'], day: ['jour', 'jours'], tour: ['circuit', 'circuits'], departure: ['départ', 'départs'], destination: ['destination', 'destinations'], photo: ['photo', 'photos'] },
  it: { space: ['posto disponibile', 'posti disponibili'], day: ['giorno', 'giorni'], tour: ['tour', 'tour'], departure: ['partenza', 'partenze'], destination: ['destinazione', 'destinazioni'], photo: ['foto', 'foto'] },
  ge: { space: ['Platz frei', 'Plätze frei'], day: ['Tag', 'Tage'], tour: ['Tour', 'Touren'], departure: ['Abfahrt', 'Abfahrten'], destination: ['Reiseziel', 'Reiseziele'], photo: ['Foto', 'Fotos'] },
  ru: { space: ['свободное место', 'свободных мест', 'свободных места'], day: ['день', 'дней', 'дня'], tour: ['тур', 'туров', 'тура'], departure: ['выезд', 'выездов', 'выезда'], destination: ['место', 'мест', 'места'], photo: ['фотография', 'фотографий', 'фотографии'] },
  zh: { space: ['个余位', '个余位'], day: ['天', '天'], tour: ['个行程', '个行程'], departure: ['个出发班次', '个出发班次'], destination: ['个目的地', '个目的地'], photo: ['张照片', '张照片'] },
  ar: { space: ['مكان متاح', 'مكانًا متاحًا', 'أماكن متاحة', 'مكانان متاحان'], day: ['يوم', 'يومًا', 'أيام', 'يومان'], tour: ['جولة', 'جولة', 'جولات', 'جولتان'], departure: ['موعد انطلاق', 'موعد انطلاق', 'مواعيد انطلاق', 'موعدا انطلاق'], destination: ['وجهة', 'وجهة', 'وجهات', 'وجهتان'], photo: ['صورة', 'صورة', 'صور', 'صورتان'] },
};

export function formatCount(locale: Locale, count: number, unit: CountUnit) {
  const language = locale === 'ge' ? 'de' : locale;
  const plural = new Intl.PluralRules(language).select(count);
  const forms = countWords[locale][unit];
  const index = plural === 'one' ? 0 : plural === 'few' ? 2 : plural === 'two' ? 3 : 1;
  return `${new Intl.NumberFormat(language).format(count)} ${forms[index] || forms[1]}`;
}

const bookedLabels: Record<Locale, string> = { en: 'booked', es: 'reservadas', fr: 'réservées', it: 'prenotati', ge: 'gebucht', ru: 'забронировано', zh: '已预订', ar: 'محجوز' };
export function bookedCount(locale: Locale, count: number, capacity: number) {
  return `${count} / ${capacity} ${bookedLabels[locale]}`;
}
