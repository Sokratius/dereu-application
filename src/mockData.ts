import { Alert } from './types';

export const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'missing_person',
    status: 'active',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    name: 'Аружан Сәкенқызы',
    age: '24',
    description: 'Бойы 165 см, арық келген. Соңғы рет ақ жейде мен көк джинсы шалбарда көрінген. Панфилов саябағы маңында жоғалды.',
    lastSeenLocation: 'Панфиловшылар саябағы, Төле би көшесі',
    coordinates: [43.2592, 76.9535],
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    specialNotes: 'Көзілдірік тағады. Өтініш, көрген жағдайда бірден хабарласыңыз.',
    authorityName: 'Алматы қ. Полиция Департаменті',
    radiusKm: 1.5,
    isVerified: true
  },
  {
    id: '2',
    type: 'suspect',
    status: 'active',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    name: 'Ербол Мәлікұлы',
    age: '32',
    description: 'Ұрлық жасады деп күдіктелуде. Бетінде тыртық бар, үстінде қара спорттық киім. Өте қауіпті болуы мүмкін.',
    lastSeenLocation: 'Көк-Төбе маңы, Достық даңғылы',
    coordinates: [43.235, 76.963],
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    specialNotes: 'Қаруланған болуы мүмкін. Жақындамаңыз.',
    authorityName: 'ҚР ІІМ Күзет қызметі',
    radiusKm: 2.0,
    isVerified: true
  },
  {
    id: '3',
    type: 'emergency',
    status: 'active',
    photoUrl: 'https://images.unsplash.com/photo-1504150559433-c4aeeae3fd7a?auto=format&fit=crop&q=80&w=400',
    name: 'Алматы тауларындағы өрт қаупі',
    description: 'Медеу ауданындағы таулы аймақта өрт шығуы мүмкін. Тұрғындарға сақ болу ұсынылады.',
    lastSeenLocation: 'Медеу ауданы, Шымбұлақ маңы',
    coordinates: [43.15, 77.06],
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    specialNotes: 'ТЖД қызметкерлері жұмыс істеуде.',
    authorityName: 'Төтенше жағдайлар департаменті',
    radiusKm: 4.0,
    isVerified: true
  },
  {
    id: '4',
    type: 'missing_person',
    status: 'active',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    name: 'Бауыржан Серік',
    age: '10',
    description: 'Қызыл күрте мен қара шалбар киген. Саябақта ойнап жүріп, көзден таса болған.',
    lastSeenLocation: 'Орталық мәдениет және демалыс саябағы',
    coordinates: [43.262, 76.969],
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    authorityName: 'Медеу аудандық ПБ',
    radiusKm: 0.8,
    isVerified: true
  }
];
