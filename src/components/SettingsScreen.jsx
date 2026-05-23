import './SettingsScreen.css';

const COLORS = [
  { name: 'Purple', value: '#6366f1' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
];

export default function SettingsScreen({ theme, onThemeChange }) {
  return (
    <div className="settings-screen">
      <div className="settings-container">
        <section className="settings-section">
          <h2>Theme Color</h2>
          <div className="color-palette">
            {COLORS.map(color => (
              <button
                key={color.value}
                className={`color-btn ${theme === color.value ? 'active' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => onThemeChange(color.value)}
                title={color.name}
              />
            ))}
          </div>
        </section>

        <section className="settings-section">
          <h2>About</h2>
          <div className="about-content">
            <p>
              <strong>My Day</strong> is a visual activity tracker that helps you see your entire day at a glance.
            </p>
            <p>
              Track your activities, watch your character journey through the day, and reflect on how you spent your time.
            </p>
            <p className="version">
              Version 1.0 (Phase 1 - Core)
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
