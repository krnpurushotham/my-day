import { useState } from 'react';
import './App.css';
import DayScreen from './components/DayScreen';
import SettingsScreen from './components/SettingsScreen';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('day');
  const [events, setEvents] = useLocalStorage('myDayEvents', []);
  const [theme, setTheme] = useLocalStorage('myDayTheme', '#6366f1');

  const addEvent = (event) => {
    const newEvent = {
      id: Date.now(),
      ...event,
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (id, updatedEvent) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updatedEvent } : e));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="app" style={{ '--color-primary': theme }}>
      <header className="app-header">
        <h1>My Day</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="app-content">
        {currentScreen === 'day' && (
          <DayScreen
            events={events}
            onAddEvent={addEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen theme={theme} onThemeChange={setTheme} />
        )}
      </main>

      <nav className="app-nav">
        <button
          className={`nav-item ${currentScreen === 'day' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('day')}
        >
          📅 Day
        </button>
        <button
          className={`nav-item ${currentScreen === 'settings' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('settings')}
        >
          ⚙️ Settings
        </button>
      </nav>
    </div>
  );
}
