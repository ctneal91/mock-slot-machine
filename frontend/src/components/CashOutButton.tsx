import { useState, useCallback } from 'react';
import './CashOutButton.css';

interface CashOutButtonProps {
  onCashOut: () => void;
  disabled: boolean;
}

const CashOutButton: React.FC<CashOutButtonProps> = ({ onCashOut, disabled }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClickable, setIsClickable] = useState(true);
  const [showMessage, setShowMessage] = useState('');

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;

    const roll = Math.random();

    // 50% chance to move away
    if (roll < 0.5) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = 300;
      const newX = Math.cos(angle) * distance;
      const newY = Math.sin(angle) * distance;
      setPosition({ x: newX, y: newY });
      setShowMessage('Too slow!');
      setTimeout(() => setShowMessage(''), 1000);
    }
    // 40% chance to become unclickable (rolls 0.5-0.9)
    else if (roll < 0.9) {
      setIsClickable(false);
      setShowMessage('Nice try!');
      setTimeout(() => {
        setIsClickable(true);
        setShowMessage('');
      }, 2000);
    }
    // 10% chance it works normally
  }, [disabled]);

  const handleClick = () => {
    if (disabled || !isClickable) return;
    onCashOut();
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="cash-out-container">
      <button
        className={`cash-out-button ${!isClickable ? 'unclickable' : ''} ${disabled ? 'disabled' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        disabled={disabled}
      >
        CASH OUT
      </button>
      {showMessage && <div className="dodge-message">{showMessage}</div>}
      {(position.x !== 0 || position.y !== 0) && (
        <button className="reset-button" onClick={resetPosition}>
          Reset Button Position
        </button>
      )}
    </div>
  );
};

export default CashOutButton;
