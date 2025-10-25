import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Alarm {
  id: string;
  title: string;
  time: string;
  isEnabled: boolean;
  repeat: 'none' | 'daily' | 'weekly' | 'weekdays';
  createdAt: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  emailNotifications: boolean;
  alarms: Alarm[];
  todos: TodoItem[];
}

const defaultSettings: UserSettings = {
  theme: 'light',
  fontSize: 'medium',
  notificationsEnabled: true,
  soundEnabled: true,
  emailNotifications: true,
  alarms: [],
  todos: []
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  addAlarm: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void;
  toggleAlarm: (id: string) => void;
  deleteAlarm: (id: string) => void;
  addTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('campus-link-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('campus-link-settings', JSON.stringify(settings));
    
    // Apply theme to document
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    }

    // Apply font size to document
    document.documentElement.classList.remove('text-small', 'text-medium', 'text-large', 'text-extra-large');
    document.documentElement.classList.add(`text-${settings.fontSize}`);
  }, [settings]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addAlarm = (alarmData: Omit<Alarm, 'id' | 'createdAt'>) => {
    const alarm: Alarm = {
      ...alarmData,
      id: `alarm-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSettings(prev => ({
      ...prev,
      alarms: [...prev.alarms, alarm]
    }));
  };

  const toggleAlarm = (id: string) => {
    setSettings(prev => ({
      ...prev,
      alarms: prev.alarms.map(alarm =>
        alarm.id === id ? { ...alarm, isEnabled: !alarm.isEnabled } : alarm
      )
    }));
  };

  const deleteAlarm = (id: string) => {
    setSettings(prev => ({
      ...prev,
      alarms: prev.alarms.filter(alarm => alarm.id !== id)
    }));
  };

  const addTodo = (todoData: Omit<TodoItem, 'id' | 'createdAt'>) => {
    const todo: TodoItem = {
      ...todoData,
      id: `todo-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSettings(prev => ({
      ...prev,
      todos: [...prev.todos, todo]
    }));
  };

  const toggleTodo = (id: string) => {
    setSettings(prev => ({
      ...prev,
      todos: prev.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  const deleteTodo = (id: string) => {
    setSettings(prev => ({
      ...prev,
      todos: prev.todos.filter(todo => todo.id !== id)
    }));
  };

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    setSettings(prev => ({
      ...prev,
      todos: prev.todos.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        addAlarm,
        toggleAlarm,
        deleteAlarm,
        addTodo,
        toggleTodo,
        deleteTodo,
        updateTodo
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}