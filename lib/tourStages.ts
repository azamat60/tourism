import type { Locale } from '@/lib/content';
import type { TourSlug } from '@/lib/tours';

export type Stage = { title: string; description: string };

export const stageRanges: Record<TourSlug, [string, string, string]> = {
  'song-kul-escape': ['1', '2', '3'],
  'kel-suu-wilderness': ['1', '2–4', '5'],
  'nomad-trail': ['1', '2–6', '7'],
};

export const tourStages: Record<Locale, Record<TourSlug, [Stage, Stage, Stage]>> = {
  en: {
    'song-kul-escape': [
      { title: 'Into the highlands', description: 'Travel toward the foothills near Kochkor, meet your guide and horses, then ride through wide pasture to your first mountain stay.' },
      { title: 'The lake unfolds', description: 'Follow the trail across open jailoos toward Song-Kul. Spend the afternoon by the water and share a warm meal in a yurt.' },
      { title: 'One last mountain morning', description: 'Wake to quiet lakeside views, ride the return trail, and continue by road after a final lunch in the highlands.' },
    ],
    'kel-suu-wilderness': [
      { title: 'Road to the frontier', description: 'Leave the city for the Naryn highlands. The long scenic drive brings you closer to the remote border valleys.' },
      { title: 'Deep into Kel-Suu', description: 'Explore dramatic ridges and make time for the turquoise lake. The pace stays flexible for mountain weather and unhurried discovery.' },
      { title: 'The journey home', description: 'Enjoy a final highland morning before returning through changing mountain landscapes.' },
    ],
    'nomad-trail': [
      { title: 'Leaving the city behind', description: 'Meet your guide, settle into the rhythm of travel, and head toward the first mountain valley.' },
      { title: 'Life on the trail', description: 'Move between pastures and hidden valleys, ride with local guides, and share meals with hosts along the way.' },
      { title: 'A slow return', description: 'Take in one more mountain morning, then return with time to reflect on the places and people you met.' },
    ],
  },
  es: {
    'song-kul-escape': [
      { title: 'Hacia las tierras altas', description: 'Viaja hacia las montañas cerca de Kochkor, conoce al guía y a los caballos y cabalga por amplios pastos hasta el primer alojamiento.' },
      { title: 'Aparece el lago', description: 'Sigue el sendero por las praderas alpinas hasta Song-Kul. Pasa la tarde junto al agua y comparte una cena en una yurta.' },
      { title: 'Una última mañana en la montaña', description: 'Despierta junto al lago, recorre el camino de vuelta a caballo y continúa por carretera tras el almuerzo.' },
    ],
    'kel-suu-wilderness': [
      { title: 'Camino a la frontera', description: 'Sal hacia las montañas de Naryn. La ruta panorámica te acerca a valles remotos.' },
      { title: 'En el corazón de Kel-Suu', description: 'Explora crestas espectaculares y el lago turquesa. Adaptamos el ritmo al clima de montaña y dejamos tiempo para descubrir.' },
      { title: 'El regreso', description: 'Disfruta de una última mañana en las alturas antes de volver entre paisajes cambiantes.' },
    ],
    'nomad-trail': [
      { title: 'Dejamos atrás la ciudad', description: 'Conoce al guía, encuentra el ritmo del viaje y dirígete al primer valle de montaña.' },
      { title: 'La vida en el camino', description: 'Recorre pastos y valles escondidos, cabalga con guías locales y comparte comidas con anfitriones.' },
      { title: 'Un regreso sin prisa', description: 'Disfruta de una última mañana en la montaña antes de volver con recuerdos de lugares y personas.' },
    ],
  },
  fr: {
    'song-kul-escape': [
      { title: 'Vers les hauts pâturages', description: 'Rejoignez les contreforts près de Kochkor, rencontrez guide et chevaux, puis traversez les pâturages jusqu’à votre première étape.' },
      { title: 'Le lac se dévoile', description: 'Suivez les sentiers d’altitude vers Song-Kul. Profitez de l’après-midi au bord de l’eau et d’un repas partagé sous la yourte.' },
      { title: 'Un dernier matin en montagne', description: 'Réveillez-vous face au lac, reprenez la piste à cheval puis continuez par la route après le déjeuner.' },
    ],
    'kel-suu-wilderness': [
      { title: 'Vers les vallées lointaines', description: 'Partez vers les hauts plateaux de Naryn. La route panoramique vous mène près des vallées reculées.' },
      { title: 'Au cœur de Kel-Suu', description: 'Explorez les crêtes et le lac turquoise. Le rythme reste souple selon la météo et vos envies.' },
      { title: 'Le chemin du retour', description: 'Savourez un dernier matin dans les montagnes avant de rentrer à travers des paysages changeants.' },
    ],
    'nomad-trail': [
      { title: 'Quitter la ville', description: 'Rencontrez votre guide, trouvez le rythme du voyage et gagnez votre première vallée de montagne.' },
      { title: 'La vie sur les sentiers', description: 'Traversez pâturages et vallées secrètes, chevauchez avec des guides locaux et partagez les repas de vos hôtes.' },
      { title: 'Un retour en douceur', description: 'Profitez d’un dernier matin en montagne avant de rentrer avec les souvenirs des lieux et des rencontres.' },
    ],
  },
  it: {
    'song-kul-escape': [
      { title: 'Verso gli altopiani', description: 'Raggiungi le colline vicino a Kochkor, incontra guida e cavalli e attraversa i pascoli fino alla prima sosta.' },
      { title: 'Il lago si svela', description: 'Segui il sentiero tra i pascoli alpini verso Song-Kul. Passa il pomeriggio sull’acqua e condividi la cena in yurta.' },
      { title: 'Un’ultima mattina in montagna', description: 'Risvegliati vicino al lago, torna a cavallo lungo il sentiero e prosegui su strada dopo pranzo.' },
    ],
    'kel-suu-wilderness': [
      { title: 'Verso le valli lontane', description: 'Parti per gli altopiani di Naryn. La strada panoramica ti avvicina alle valli remote.' },
      { title: 'Nel cuore di Kel-Suu', description: 'Esplora creste spettacolari e il lago turchese. Il ritmo rimane flessibile secondo il meteo e i tuoi desideri.' },
      { title: 'Il ritorno', description: 'Goditi un’ultima mattina in quota prima di rientrare tra paesaggi sempre diversi.' },
    ],
    'nomad-trail': [
      { title: 'La città alle spalle', description: 'Incontra la guida, entra nel ritmo del viaggio e raggiungi la prima valle di montagna.' },
      { title: 'Vita lungo il sentiero', description: 'Attraversa pascoli e valli nascoste, cavalca con guide locali e condividi i pasti con chi ti ospita.' },
      { title: 'Un ritorno lento', description: 'Assapora un’ultima mattina in montagna prima di tornare con i ricordi dei luoghi e degli incontri.' },
    ],
  },
  ge: {
    'song-kul-escape': [
      { title: 'Hinauf ins Hochland', description: 'Fahre zu den Hügeln bei Kochkor, lerne Guide und Pferde kennen und reite über weite Weiden zur ersten Unterkunft.' },
      { title: 'Der See zeigt sich', description: 'Folge dem Pfad über Hochweiden zum Song-Kul. Genieße den Nachmittag am Wasser und ein gemeinsames Essen in der Jurte.' },
      { title: 'Ein letzter Morgen in den Bergen', description: 'Wache am See auf, reite den Rückweg und fahre nach dem Mittagessen weiter.' },
    ],
    'kel-suu-wilderness': [
      { title: 'Weg in die Ferne', description: 'Fahre ins Hochland von Naryn. Die Panoramastraße führt dich näher an entlegene Täler.' },
      { title: 'Mitten in Kel-Suu', description: 'Erkunde mächtige Bergrücken und den türkisfarbenen See. Das Tempo bleibt bei Bergwetter flexibel.' },
      { title: 'Der Heimweg', description: 'Genieße einen letzten Morgen im Hochland und kehre durch wechselnde Landschaften zurück.' },
    ],
    'nomad-trail': [
      { title: 'Die Stadt hinter dir', description: 'Lerne deinen Guide kennen, finde den Reiserhythmus und fahre ins erste Bergtal.' },
      { title: 'Leben auf dem Weg', description: 'Ziehe durch Weiden und versteckte Täler, reite mit lokalen Guides und teile Mahlzeiten mit Gastgebern.' },
      { title: 'Langsam zurück', description: 'Erlebe noch einen Morgen in den Bergen und nimm Erinnerungen an Orte und Menschen mit.' },
    ],
  },
  ru: {
    'song-kul-escape': [
      { title: 'Навстречу высокогорью', description: 'Поездка к предгорьям у Кочкора, знакомство с гидом и лошадьми, переход через широкие пастбища к первой стоянке.' },
      { title: 'Открывается озеро', description: 'Конная тропа идёт через жайлоо к Сон-Кулю. После поездки — время у воды и ужин в юрте.' },
      { title: 'Последнее утро в горах', description: 'Встречайте рассвет у озера, возвращайтесь по тропе верхом и продолжайте путь на машине после обеда.' },
    ],
    'kel-suu-wilderness': [
      { title: 'Дорога к дальним долинам', description: 'Выезд в высокогорье Нарына. Живописная дорога ведёт к удалённым долинам.' },
      { title: 'В сердце Кель-Суу', description: 'Исследуйте горные хребты и бирюзовое озеро. Темп оставляем гибким из-за погоды и ради неспешных открытий.' },
      { title: 'Путь домой', description: 'Проведите ещё одно утро в горах перед возвращением через меняющиеся пейзажи.' },
    ],
    'nomad-trail': [
      { title: 'Оставляя город позади', description: 'Познакомьтесь с гидом, войдите в ритм поездки и отправьтесь к первой горной долине.' },
      { title: 'Жизнь на тропе', description: 'Переходите между пастбищами и скрытыми долинами, ездите верхом с местными гидами и разделяйте трапезы с хозяевами.' },
      { title: 'Неспешное возвращение', description: 'Насладитесь последним утром в горах и возвращайтесь с воспоминаниями о встреченных людях и местах.' },
    ],
  },
  zh: {
    'song-kul-escape': [
      { title: '走向高地', description: '前往科奇科尔附近的山麓，认识向导和马匹，骑行穿过宽阔牧场，抵达第一处山间住宿。' },
      { title: '湖泊展现眼前', description: '沿高山草场的道路走向松库尔湖。下午在湖边放慢脚步，晚上在毡房共享晚餐。' },
      { title: '最后一个山间早晨', description: '在湖畔醒来，骑马沿来路返回，午餐后乘车继续行程。' },
    ],
    'kel-suu-wilderness': [
      { title: '驶向远方', description: '前往纳伦高地。沿着风景优美的道路接近偏远山谷。' },
      { title: '深入克尔苏', description: '探索高山山脊与碧蓝湖泊。根据山区天气调整节奏，留出从容探索的时间。' },
      { title: '返程', description: '再享受一个高原早晨，然后穿越不断变化的山景返回。' },
    ],
    'nomad-trail': [
      { title: '离开城市', description: '认识向导，进入旅行节奏，前往第一座山谷。' },
      { title: '路上的生活', description: '走过牧场和隐秘山谷，在当地向导带领下骑行，与沿途主人共享饭食。' },
      { title: '慢慢归来', description: '再享受一个山间清晨，带着与当地人相遇的记忆返程。' },
    ],
  },
  ar: {
    'song-kul-escape': [
      { title: 'إلى المرتفعات', description: 'توجه إلى التلال قرب كوتشكور، وتعرف إلى المرشد والخيول، ثم اركب عبر المراعي الواسعة إلى أول مكان إقامة.' },
      { title: 'ظهور البحيرة', description: 'اتبع الدرب عبر المراعي الجبلية نحو سونغ كول. اقضِ العصر قرب الماء وتشارك وجبة دافئة في الخيمة.' },
      { title: 'صباح أخير في الجبال', description: 'استيقظ على هدوء البحيرة، واركب في طريق العودة، ثم تابع بالسيارة بعد الغداء.' },
    ],
    'kel-suu-wilderness': [
      { title: 'الطريق إلى الوديان البعيدة', description: 'انطلق نحو مرتفعات نارين. يقربك الطريق ذو المناظر الجميلة من الوديان النائية.' },
      { title: 'في عمق كيل سو', description: 'استكشف الجبال والبحيرة الفيروزية. يبقى الإيقاع مرناً بحسب الطقس ووقت الاستكشاف.' },
      { title: 'العودة', description: 'استمتع بصباح أخير في المرتفعات قبل العودة عبر مناظر جبلية متغيرة.' },
    ],
    'nomad-trail': [
      { title: 'ترك المدينة خلفك', description: 'تعرف إلى مرشدك، وادخل في إيقاع الرحلة، واتجه إلى أول وادٍ جبلي.' },
      { title: 'الحياة على الدرب', description: 'تنقل بين المراعي والوديان الخفية، واركب مع مرشدين محليين، وتشارك الطعام مع المضيفين.' },
      { title: 'عودة هادئة', description: 'عش صباحاً أخيراً في الجبال، ثم عد بذكريات الأماكن والأشخاص الذين التقيتهم.' },
    ],
  },
};
