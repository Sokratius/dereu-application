import { CrimePoint } from '../types';

export const CRIME_POINT_LABELS: Record<CrimePoint, string> = {
  theft: 'Ұрлық',
  robbery: 'Қарақшылық',
  assault: 'Шабуыл',
  fraud: 'Алаяқтық',
  vandalism: 'Вандализм',
  narcotics: 'Есірткіге байланысты құқық бұзушылық',
};

export const getCrimePointLabel = (point?: CrimePoint): string => {
  if (!point) {
    return 'Жалпы оқиға';
  }

  return CRIME_POINT_LABELS[point];
};
