import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Report } from '../types';
import { MOCK_ALERTS } from '../mockData';

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'isVerified'>) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  deleteAlert: (id: string) => void;
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'timestamp'>) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const savedAlerts = localStorage.getItem('dereu_alerts');
    const savedReports = localStorage.getItem('dereu_reports');
    
    if (savedAlerts) {
      const parsedAlerts = JSON.parse(savedAlerts) as Alert[];
      // Keep user data but backfill a large seed if old storage had too few incidents.
      if (parsedAlerts.length < 200) {
        const merged = [...parsedAlerts, ...MOCK_ALERTS.filter((mock) => !parsedAlerts.some((existing) => existing.id === mock.id))];
        setAlerts(merged);
        localStorage.setItem('dereu_alerts', JSON.stringify(merged));
      } else {
        setAlerts(parsedAlerts);
      }
    } else {
      setAlerts(MOCK_ALERTS);
      localStorage.setItem('dereu_alerts', JSON.stringify(MOCK_ALERTS));
    }

    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  const addAlert = (newAlert: Omit<Alert, 'id' | 'isVerified'>) => {
    const alertWithId: Alert = {
      ...newAlert,
      id: Math.random().toString(36).substr(2, 9),
      isVerified: true, // Auto-verified for prototype admin actions
    };
    const updatedAlerts = [alertWithId, ...alerts];
    setAlerts(updatedAlerts);
    localStorage.setItem('dereu_alerts', JSON.stringify(updatedAlerts));
  };

  const updateAlert = (id: string, updates: Partial<Alert>) => {
    const updatedAlerts = alerts.map(a => a.id === id ? { ...a, ...updates } : a);
    setAlerts(updatedAlerts);
    localStorage.setItem('dereu_alerts', JSON.stringify(updatedAlerts));
  };

  const deleteAlert = (id: string) => {
    const updatedAlerts = alerts.filter(a => a.id !== id);
    setAlerts(updatedAlerts);
    localStorage.setItem('dereu_alerts', JSON.stringify(updatedAlerts));
  };

  const addReport = (newReport: Omit<Report, 'id' | 'timestamp'>) => {
    const reportWithId: Report = {
      ...newReport,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    const updatedReports = [reportWithId, ...reports];
    setReports(updatedReports);
    localStorage.setItem('dereu_reports', JSON.stringify(updatedReports));
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, updateAlert, deleteAlert, reports, addReport }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
