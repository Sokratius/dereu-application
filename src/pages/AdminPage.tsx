import React, { useMemo, useState } from 'react';
import { Plus, Archive, ListTodo, Megaphone, MapPin, X, ShieldAlert } from 'lucide-react';
import { useAlerts } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import { AlertCard } from '../components/AlertCard';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { AlertType, CrimePoint } from '../types';
import { CRIME_POINT_LABELS } from '../lib/crimePoints';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_COORDINATES: [number, number] = [43.2389, 76.8897];

const LOCATION_PRESETS: Array<{ label: string; coordinates: [number, number] }> = [
  { label: 'Арбат, Панфилов көшесі', coordinates: [43.2635, 76.9455] },
  { label: 'Медеу мұз айдыны', coordinates: [43.1578, 77.0586] },
  { label: 'Алматы-2 вокзалы', coordinates: [43.2722, 76.9406] },
  { label: 'Сайран көлі маңы', coordinates: [43.2282, 76.8591] },
  { label: 'Орталық саябақ', coordinates: [43.2627, 76.9694] },
];

type LocationMode = 'preset' | 'map' | 'manual';

type CrimeFormConfig = {
  alertType: AlertType;
  descriptionPlaceholder: string;
  detailLabels: [string, string];
  detailPlaceholders: [string, string];
  radiusKm: number;
  authorityName: string;
  defaultTitle: string;
};

const CRIME_FORM_CONFIG: Record<CrimePoint, CrimeFormConfig> = {
  theft: {
    alertType: 'suspect',
    descriptionPlaceholder: 'Ұрлық оқиғасының қысқаша мазмұны (қашан, қайда, кімге қатысты).',
    detailLabels: ['Ұрланған мүлік', 'Күдіктінің белгілері'],
    detailPlaceholders: ['Мысалы: телефон, сөмке, құжаттар', 'Мысалы: қара күрте, бойы шамамен 175 см'],
    radiusKm: 1.2,
    authorityName: 'Алматы қ. Полиция департаменті',
    defaultTitle: 'Ұрлық туралы хабарлама',
  },
  robbery: {
    alertType: 'suspect',
    descriptionPlaceholder: 'Қарақшылық фактісі бойынша негізгі жағдайды жазыңыз.',
    detailLabels: ['Қауіп деңгейі', 'Қолданылған құрал'],
    detailPlaceholders: ['Мысалы: жоғары, күдікті қарулы болуы мүмкін', 'Мысалы: пышақ, күш қолдану'],
    radiusKm: 1.8,
    authorityName: 'ҚР ІІМ жедел қызметі',
    defaultTitle: 'Қарақшылық оқиғасы',
  },
  assault: {
    alertType: 'emergency',
    descriptionPlaceholder: 'Шабуыл оқиғасының мән-жайын сипаттаңыз.',
    detailLabels: ['Жәбірленуші жағдайы', 'Куәгерлер туралы ақпарат'],
    detailPlaceholders: ['Мысалы: медициналық көмек қажет', 'Мысалы: 2 куәгер, оқиға видеоға түскен'],
    radiusKm: 1,
    authorityName: 'Жедел жәрдем және полиция',
    defaultTitle: 'Шабуыл фактісі',
  },
  fraud: {
    alertType: 'suspect',
    descriptionPlaceholder: 'Алаяқтық схемасын қысқаша жазыңыз.',
    detailLabels: ['Алаяқтық арнасы', 'Шамаланған шығын'],
    detailPlaceholders: ['Мысалы: телефон, мессенджер, банк қоңырауы', 'Мысалы: 250 000 тг'],
    radiusKm: 2.5,
    authorityName: 'Киберқылмысқа қарсы бөлім',
    defaultTitle: 'Алаяқтық туралы хабарлама',
  },
  vandalism: {
    alertType: 'emergency',
    descriptionPlaceholder: 'Мүлікке зиян келтіру фактісін сипаттаңыз.',
    detailLabels: ['Зақымдалған нысан', 'Зиян көлемі'],
    detailPlaceholders: ['Мысалы: аялдама, дүкен витринасы', 'Мысалы: сынған әйнек, бояумен бүлдіру'],
    radiusKm: 0.8,
    authorityName: 'Қалалық қоғамдық тәртіп қызметі',
    defaultTitle: 'Вандализм туралы хабарлама',
  },
  narcotics: {
    alertType: 'suspect',
    descriptionPlaceholder: 'Есірткіге байланысты күмәнді әрекеттің толық сипаттамасы.',
    detailLabels: ['Күдікті әрекет', 'Байланысты орын/бағыт'],
    detailPlaceholders: ['Мысалы: жасырын тарату, күмәнді алмасу', 'Мысалы: аула, жерасты өткелі, көше бұрышы'],
    radiusKm: 2,
    authorityName: 'Есірткі қылмысына қарсы департамент',
    defaultTitle: 'Есірткіге байланысты оқиға',
  },
};

const MARKER_ICON = L.divIcon({
  className: 'crime-location-marker',
  html: '<div class="w-4 h-4 bg-[#DC2626] border-2 border-white rounded-full shadow-lg"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const getAlertTypeLabel = (type: AlertType) => {
  if (type === 'missing_person') return 'Жоғалған адам';
  if (type === 'suspect') return 'Күдікті';
  return 'Төтенше жағдай';
};

const buildInitialAlert = () => {
  const initialPoint: CrimePoint = 'theft';
  const initialConfig = CRIME_FORM_CONFIG[initialPoint];
  const initialPreset = LOCATION_PRESETS[0];

  return {
    name: initialConfig.defaultTitle,
    age: '',
    type: initialConfig.alertType,
    crimePoint: initialPoint,
    description: '',
    specialNotes: '',
    detailPrimary: '',
    detailSecondary: '',
    lastSeenLocation: initialPreset.label,
    coordinates: initialPreset.coordinates,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    radiusKm: initialConfig.radiusKm,
    authorityName: initialConfig.authorityName,
  };
};

const MapClickHandler: React.FC<{ onPick: (coords: [number, number]) => void }> = ({ onPick }) => {
  const map = useMapEvents({
    click: (e) => {
      const next: [number, number] = [e.latlng.lat, e.latlng.lng];
      onPick(next);
      map.flyTo(next, map.getZoom());
    },
  });

  return null;
};

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { alerts, addAlert, updateAlert, reports } = useAlerts();
  const [view, setView] = useState<'alerts' | 'reports'>('alerts');
  const [showAddModal, setShowAddModal] = useState(false);
  const [locationMode, setLocationMode] = useState<LocationMode>('preset');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // Form State
  const [newAlert, setNewAlert] = useState(buildInitialAlert());

  const activeCrimeConfig = useMemo(() => CRIME_FORM_CONFIG[newAlert.crimePoint], [newAlert.crimePoint]);

  const handleCrimePointChange = (point: CrimePoint) => {
    const config = CRIME_FORM_CONFIG[point];

    setNewAlert((prev) => ({
      ...prev,
      crimePoint: point,
      type: config.alertType,
      radiusKm: config.radiusKm,
      authorityName: config.authorityName,
      name: prev.name.trim() ? prev.name : config.defaultTitle,
      detailPrimary: '',
      detailSecondary: '',
    }));
  };

  const handlePresetLocationChange = (index: number) => {
    const nextPreset = LOCATION_PRESETS[index];
    setSelectedPresetIndex(index);
    setNewAlert((prev) => ({
      ...prev,
      lastSeenLocation: nextPreset.label,
      coordinates: nextPreset.coordinates,
    }));
  };

  const resetAddForm = () => {
    setNewAlert(buildInitialAlert());
    setLocationMode('preset');
    setSelectedPresetIndex(0);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[80vh] bg-[#F3F4F6]">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert size={40} className="text-[#DC2626]" />
        </div>
        <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter mb-2">Рұқсат жоқ</h2>
        <p className="text-[#6B7280] font-bold text-sm">Бұл панельге тек уәкілетті жүйе әкімшілері қол жеткізе алады.</p>
      </div>
    );
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const crimeDetails = [
      { label: activeCrimeConfig.detailLabels[0], value: newAlert.detailPrimary.trim() || 'Көрсетілмеген' },
      { label: activeCrimeConfig.detailLabels[1], value: newAlert.detailSecondary.trim() || 'Көрсетілмеген' },
    ];

    addAlert({
      name: newAlert.name.trim() || activeCrimeConfig.defaultTitle,
      age: newAlert.age.trim() || undefined,
      type: newAlert.type,
      crimePoint: newAlert.crimePoint,
      description: newAlert.description.trim(),
      specialNotes: newAlert.specialNotes.trim() || undefined,
      crimeDetails,
      lastSeenLocation: newAlert.lastSeenLocation.trim(),
      coordinates: newAlert.coordinates,
      photoUrl: newAlert.photoUrl,
      radiusKm: newAlert.radiusKm,
      authorityName: newAlert.authorityName,
      status: 'active',
      timestamp: new Date().toISOString()
    });
    setShowAddModal(false);
    resetAddForm();
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24">
      <header className="bg-[#1E3A8A] p-6 shadow-md sticky top-0 z-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black text-white tracking-widest uppercase">Басқару панелі</h1>
          <button 
            onClick={() => {
              resetAddForm();
              setShowAddModal(true);
            }}
            className="w-12 h-12 bg-white text-[#1E3A8A] rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex gap-2 p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
          <button
            onClick={() => setView('alerts')}
            className={cn(
              "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2",
              view === 'alerts' ? "bg-white text-[#1E3A8A] shadow-md" : "text-white opacity-60"
            )}
          >
            <ListTodo size={14} /> Тізім
          </button>
          <button
            onClick={() => setView('reports')}
            className={cn(
              "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2",
              view === 'reports' ? "bg-white text-[#1E3A8A] shadow-md" : "text-white opacity-60"
            )}
          >
            <Megaphone size={14} /> Сигналдар [{reports.length}]
          </button>
        </div>
      </header>

      {/* View Content */}
      <div className="p-4 space-y-4">
        {view === 'alerts' ? (
          alerts.length > 0 ? (
            alerts.map(alert => (
              <div key={alert.id} className="relative">
                <AlertCard alert={alert} />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button 
                    onClick={() => updateAlert(alert.id, { status: alert.status === 'active' ? 'closed' : 'active' })}
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shadow-md bg-white border border-[#E5E7EB] text-[#1E3A8A] transition-all hover:bg-[#F3F4F6]",
                    )}
                    title={alert.status === 'active' ? "Жабу" : "Ашу"}
                  >
                    <Archive size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-[#6B7280] font-black text-[10px] uppercase tracking-widest">Белсенді оқиғалар жоқ</p>
            </div>
          )
        ) : (
          <div className="space-y-4">
            {reports.length > 0 ? reports.map(report => (
              <div key={report.id} className="ios-card bg-white p-5 border border-[#E5E7EB]">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-black text-[#111827] text-xs uppercase tracking-tight">ID: {report.alertId.substr(0,8)}</h4>
                    <p className="text-[10px] text-[#6B7280] font-bold uppercase mt-1">Оқиға нөмірі</p>
                  </div>
                  <span className="bg-red-50 text-[#DC2626] border border-red-100 px-2 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase">Жаңа жолданым</span>
                </div>
                <div className="bg-[#F3F4F6] p-4 rounded-xl mb-4 text-xs font-medium text-[#111827] italic leading-relaxed">
                  "{report.message}"
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase">{new Date(report.timestamp).toLocaleString('kk-KZ')}</span>
                  {report.location && (
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-[#1E3A8A] uppercase">
                      <MapPin size={12} className="text-[#DC2626]" />
                      <span>{report.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="py-20 text-center ios-card bg-white border-2 border-dashed border-[#E5E7EB]">
                <Megaphone size={40} className="text-[#E5E7EB] mx-auto mb-4" />
                <p className="text-[#6B7280] font-black text-[10px] uppercase tracking-widest">Жаңа жолданымдар жоқ</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Alert Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111827]/60 backdrop-blur-sm z-1100 flex items-end justify-center"
          >
            <motion.form 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onSubmit={handleAddSubmit}
              className="bg-white w-full max-w-md rounded-t-4xl p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black tracking-widest text-[#111827] uppercase">Жаңа оқиға тіркеу</h2>
                <button type="button" onClick={() => {
                  setShowAddModal(false);
                  resetAddForm();
                }} className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#111827]">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Құқық бұзушылық пункті</label>
                  <select
                    value={newAlert.crimePoint}
                    onChange={e => handleCrimePointChange(e.target.value as CrimePoint)}
                    className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 px-4 text-xs font-bold text-[#111827] uppercase"
                  >
                    {(Object.keys(CRIME_POINT_LABELS) as CrimePoint[]).map((point) => (
                      <option key={point} value={point}>{CRIME_POINT_LABELS[point]}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Оқиға бағыты</label>
                    <input
                      value={getAlertTypeLabel(newAlert.type)}
                      readOnly
                      className="w-full bg-[#EEF2FF] border-none rounded-xl py-4 px-4 text-xs font-black text-[#1E3A8A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Радиус (КМ)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={newAlert.radiusKm}
                      onChange={e => setNewAlert(p => ({ ...p, radiusKm: parseFloat(e.target.value) || 0.5 }))}
                      className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 px-4 text-xs font-bold text-[#111827] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Аты-жөні</label>
                  <input 
                    required
                    value={newAlert.name}
                    onChange={e => setNewAlert(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 px-4 text-xs font-bold text-[#111827] focus:ring-2 focus:ring-blue-100" 
                    placeholder={activeCrimeConfig.defaultTitle.toUpperCase()}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Жасы</label>
                    <input 
                      type="text"
                      value={newAlert.age}
                      onChange={e => setNewAlert(p => ({ ...p, age: e.target.value }))}
                      className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 px-4 text-xs font-bold text-[#111827] focus:ring-2 focus:ring-blue-100" 
                      placeholder="ЖАСЫ"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Жауапты орган</label>
                    <input 
                      type="text"
                      value={newAlert.authorityName}
                      onChange={e => setNewAlert(p => ({ ...p, authorityName: e.target.value }))}
                      className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 px-4 text-xs font-bold text-[#111827] focus:ring-2 focus:ring-blue-100" 
                      placeholder="МЫСАЛЫ: ПОЛИЦИЯ БӨЛІМІ"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">{activeCrimeConfig.detailLabels[0]}</label>
                  <input
                    required
                    value={newAlert.detailPrimary}
                    onChange={e => setNewAlert(p => ({ ...p, detailPrimary: e.target.value }))}
                    className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 px-4 text-xs font-bold text-[#111827] focus:ring-2 focus:ring-blue-100"
                    placeholder={activeCrimeConfig.detailPlaceholders[0].toUpperCase()}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">{activeCrimeConfig.detailLabels[1]}</label>
                  <input
                    required
                    value={newAlert.detailSecondary}
                    onChange={e => setNewAlert(p => ({ ...p, detailSecondary: e.target.value }))}
                    className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 px-4 text-xs font-bold text-[#111827] focus:ring-2 focus:ring-blue-100"
                    placeholder={activeCrimeConfig.detailPlaceholders[1].toUpperCase()}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Сипаттама</label>
                  <textarea 
                    required
                    value={newAlert.description}
                    onChange={e => setNewAlert(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 px-4 text-xs font-medium text-[#111827] h-28"
                    placeholder={activeCrimeConfig.descriptionPlaceholder.toUpperCase()}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Қосымша ескертпе</label>
                  <textarea
                    value={newAlert.specialNotes}
                    onChange={e => setNewAlert(p => ({ ...p, specialNotes: e.target.value }))}
                    className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 px-4 text-xs font-medium text-[#111827] h-24"
                    placeholder="КУӘГЕРЛЕР, КАМЕРА БАР-ЖОҒЫ, ҚОСЫМША ТҮСІНІКТЕМЕ"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Орналасқан жерді таңдау</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setLocationMode('preset')}
                      className={cn(
                        'py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all',
                        locationMode === 'preset' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white text-[#6B7280] border-[#E5E7EB]'
                      )}
                    >
                      Локация
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationMode('map')}
                      className={cn(
                        'py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all',
                        locationMode === 'map' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white text-[#6B7280] border-[#E5E7EB]'
                      )}
                    >
                      Карта
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationMode('manual')}
                      className={cn(
                        'py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all',
                        locationMode === 'manual' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white text-[#6B7280] border-[#E5E7EB]'
                      )}
                    >
                      Қолмен
                    </button>
                  </div>

                  {locationMode === 'preset' && (
                    <div className="space-y-2">
                      <select
                        value={selectedPresetIndex}
                        onChange={(e) => handlePresetLocationChange(parseInt(e.target.value, 10))}
                        className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 px-4 text-xs font-bold text-[#111827]"
                      >
                        {LOCATION_PRESETS.map((preset, index) => (
                          <option key={preset.label} value={index}>{preset.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {locationMode === 'manual' && (
                    <div className="space-y-2">
                      <input
                        required
                        value={newAlert.lastSeenLocation}
                        onChange={e => setNewAlert(p => ({ ...p, lastSeenLocation: e.target.value }))}
                        className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 px-4 text-xs font-bold text-[#111827]"
                        placeholder="МЫСАЛЫ: АБАЙ ДАҢҒЫЛЫ, ОРТАЛЫҚ САЯБАҚ"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          step="0.0001"
                          value={newAlert.coordinates[0]}
                          onChange={e => setNewAlert(p => ({ ...p, coordinates: [parseFloat(e.target.value) || DEFAULT_COORDINATES[0], p.coordinates[1]] }))}
                          className="w-full bg-[#F3F4F6] border-none rounded-xl py-3 px-4 text-xs font-bold text-[#111827]"
                          placeholder="Ендік (LAT)"
                        />
                        <input
                          type="number"
                          step="0.0001"
                          value={newAlert.coordinates[1]}
                          onChange={e => setNewAlert(p => ({ ...p, coordinates: [p.coordinates[0], parseFloat(e.target.value) || DEFAULT_COORDINATES[1]] }))}
                          className="w-full bg-[#F3F4F6] border-none rounded-xl py-3 px-4 text-xs font-bold text-[#111827]"
                          placeholder="Бойлық (LNG)"
                        />
                      </div>
                    </div>
                  )}

                  {locationMode === 'map' && (
                    <div className="space-y-2">
                      <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] h-52">
                        <MapContainer center={newAlert.coordinates} zoom={13} className="w-full h-full">
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={newAlert.coordinates} icon={MARKER_ICON} />
                          <MapClickHandler
                            onPick={(coords) => {
                              setNewAlert((prev) => ({
                                ...prev,
                                coordinates: coords,
                                lastSeenLocation: `Карта нүктесі (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`,
                              }));
                            }}
                          />
                        </MapContainer>
                      </div>
                      <div className="bg-[#EEF2FF] rounded-xl px-4 py-3 text-[10px] font-black text-[#1E3A8A] uppercase tracking-wide">
                        Координат: {newAlert.coordinates[0].toFixed(4)}, {newAlert.coordinates[1].toFixed(4)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#1E3A8A] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all"
              >
                Тіркеуді растау
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
