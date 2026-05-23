import './TrackVisualization.css';

export default function TrackVisualization({ events }) {
  return (
    <div className="track-visualization">
      <div className="track-background">
        <div className="sky"></div>
        <div className="clouds">
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
        </div>
        <div className="hills">
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
        </div>
      </div>
      <div className="character-display"></div>
    </div>
  );
}
