import './ReplayButton.css';

export default function ReplayButton({ onClick, isReplaying, disabled = false }) {
  return (
    <button
      className={`replay-button ${isReplaying ? 'replaying' : ''}`}
      onClick={onClick}
      disabled={disabled || isReplaying}
      title={isReplaying ? 'Replaying your day...' : 'Replay your day'}
    >
      {isReplaying ? (
        <>
          <span className="replay-icon">⏸️</span>
          <span className="replay-text">Replaying...</span>
        </>
      ) : (
        <>
          <span className="replay-icon">▶️</span>
          <span className="replay-text">Replay Day</span>
        </>
      )}
    </button>
  );
}
