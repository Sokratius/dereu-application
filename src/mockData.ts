import { Alert, AlertType } from './types';
import { KAZAKHSTAN_CITIES } from './lib/kazakhstanCities';

const PHOTO_POOL = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1504150559433-c4aeeae3fd7a?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&q=80&w=400',
];

const MISSING_NAMES = [
  'Аружан Сәкенқызы',
  'Бауыржан Серік',
  'Мадина Нұртай',
  'Данияр Асхат',
  'Әлихан Жомарт',
  'Нұрай Қуаныш',
  'Айсана Дәулет',
  'Еркебұлан Самат',
  'Айсұлу Жанерке',
  'Азамат Бекзат',
];

const SUSPECT_NAMES = [
  'Ербол Мәлікұлы',
  'Нұрбек Қалиев',
  'Талғат Сейіт',
  'Руслан Бектемір',
  'Арман Әбдіқадыр',
  'Самат Оралұлы',
  'Мирас Жәнібек',
  'Берік Марат',
  'Мақсат Төлеу',
  'Әлібек Қаржау',
];

const EMERGENCY_TITLES = [
  'Өрт қаупі',
  'Көлік апаты аймағы',
  'Қоғамдық тәртіп бұзылуы',
  'Жаппай төбелес туралы хабар',
  'Күдікті сөмке анықталды',
  'Қауіпті аймаққа шектеу',
  'Газ иісі туралы шұғыл ескерту',
  'Түнгі уақытта шу және бұзақылық',
];

const STREETS = [
  'Абай даңғылы',
  'Төле би көшесі',
  'Әл-Фараби даңғылы',
  'Рысқұлов көшесі',
  'Достық даңғылы',
  'Сәтбаев көшесі',
  'Жібек жолы көшесі',
  'Назарбаев даңғылы',
  'Орталық саябақ маңы',
  'Теміржол вокзалы маңы',
];

const AUTHORITIES_BY_TYPE: Record<AlertType, string> = {
  missing_person: 'Полиция департаменті',
  suspect: 'ҚР ІІМ жедел қызметі',
  emergency: 'Төтенше жағдайлар департаменті',
};

const DESCRIPTION_BY_TYPE: Record<AlertType, string[]> = {
  missing_person: [
    'Соңғы рет куәгерлер айтқан бағытта көрінген. Кез келген ақпарат маңызды.',
    'Киім үлгісі мен сыртқы белгілері хабарламаға сәйкес келеді. Көрген жағдайда дереу хабарласыңыз.',
    'Жоғалу фактісі бойынша іздестіру тобы құрылды. Қоғамдық орындар тексерілуде.',
  ],
  suspect: [
    'Күдікті құқық бұзушылыққа қатысы болуы мүмкін. Жақындамау ұсынылады.',
    'Куәгерлер сипаттамасы бойынша тұлға осы аймақта байқалған.',
    'Тәртіп сақшылары тексеру жүргізіп жатыр. Қауіпсіздік ережесін сақтаңыз.',
  ],
  emergency: [
    'Аумақта шұғыл қызметтер жұмыс істеуде. Қауіпсіз қашықтық сақтаңыз.',
    'Қауіпті аймаққа уақытша шектеу қойылды. Нұсқаулықты орындаңыз.',
    'Оқиға орнына жедел қызмет жіберілді. Жақындамау сұралады.',
  ],
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const jitterCoordinates = (base: [number, number], seed: number): [number, number] => {
  const latOffset = ((seed % 9) - 4) * 0.012;
  const lngOffset = (((seed * 7) % 9) - 4) * 0.012;

  return [
    clamp(base[0] + latOffset, 40.5, 55.8),
    clamp(base[1] + lngOffset, 46.0, 87.5),
  ];
};

const buildName = (type: AlertType, index: number) => {
  if (type === 'missing_person') {
    return MISSING_NAMES[index % MISSING_NAMES.length];
  }

  if (type === 'suspect') {
    return SUSPECT_NAMES[index % SUSPECT_NAMES.length];
  }

  return EMERGENCY_TITLES[index % EMERGENCY_TITLES.length];
};

const buildDescription = (type: AlertType, index: number) => {
  const templates = DESCRIPTION_BY_TYPE[type];
  return templates[index % templates.length];
};

const buildRadius = (type: AlertType, index: number) => {
  if (type === 'emergency') {
    return 2 + (index % 4) * 0.8;
  }
  if (type === 'suspect') {
    return 1 + (index % 3) * 0.5;
  }
  return 0.8 + (index % 3) * 0.4;
};

const buildType = (index: number): AlertType => {
  const order: AlertType[] = ['missing_person', 'suspect', 'emergency'];
  return order[index % order.length];
};

const generateAlerts = (count: number): Alert[] => {
  return Array.from({ length: count }, (_, index) => {
    const city = KAZAKHSTAN_CITIES[index % KAZAKHSTAN_CITIES.length];
    const type = buildType(index);
    const street = STREETS[index % STREETS.length];
    const coordinates = jitterCoordinates(city.coordinates, index + 1);

    return {
      id: `${index + 1}`,
      type,
      status: 'active',
      photoUrl: PHOTO_POOL[index % PHOTO_POOL.length],
      name: buildName(type, index),
      age: type === 'emergency' ? undefined : `${10 + (index % 48)}`,
      description: buildDescription(type, index),
      lastSeenLocation: `${city.name}, ${street}`,
      coordinates,
      timestamp: new Date(Date.now() - index * 17 * 60 * 1000).toISOString(),
      specialNotes: index % 4 === 0 ? 'Куәгерлерден қосымша мәлімет қабылдануда.' : undefined,
      authorityName: `${city.name} қ. ${AUTHORITIES_BY_TYPE[type]}`,
      radiusKm: buildRadius(type, index),
      isVerified: true,
    };
  });
};

export const MOCK_ALERTS: Alert[] = generateAlerts(220);
