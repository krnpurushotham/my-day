import './ActivityBlock.css';

export default function ActivityBlock({ event, onClick }) {
  return (
    <div className="activity-block" onClick={onClick}>
      <div className="activity-emoji">{event.emoji}</div>
      <div className="activity-info">
        <div className="activity-name">{event.name}</div>
        <div className="activity-time">{event.time}</div>
      </div>
      <div className="activity-chevron">›</div>
    </div>
  );
}
