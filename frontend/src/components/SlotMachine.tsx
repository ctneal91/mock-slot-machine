import { useState, useEffect } from 'react';
import './SlotMachine.css';

interface SlotMachineProps {
  result: string[];
  isSpinning: boolean;
  onSpinComplete: () => void;
}

const SPIN_SYMBOL = 'X';
const SYMBOLS = ['C', 'L', 'O', 'W'];

const SlotMachine: React.FC<SlotMachineProps> = ({ result, isSpinning, onSpinComplete }) => {
  const [displayedSymbols, setDisplayedSymbols] = useState<string[]>(['?', '?', '?']);
  const [revealedCount, setRevealedCount] = useState(0);
  const [spinningSymbols, setSpinningSymbols] = useState<string[]>([SPIN_SYMBOL, SPIN_SYMBOL, SPIN_SYMBOL]);

  // Animate spinning symbols
  useEffect(() => {
    if (!isSpinning) return;

    const interval = setInterval(() => {
      setSpinningSymbols(prev =>
        prev.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isSpinning]);

  // Reveal symbols one by one after receiving result
  useEffect(() => {
    if (result.length === 0 || isSpinning) return;

    setRevealedCount(0);
    setDisplayedSymbols([SPIN_SYMBOL, SPIN_SYMBOL, SPIN_SYMBOL]);

    // Reveal first symbol after 1 second
    const timer1 = setTimeout(() => {
      setDisplayedSymbols([result[0], SPIN_SYMBOL, SPIN_SYMBOL]);
      setRevealedCount(1);
    }, 1000);

    // Reveal second symbol after 2 seconds
    const timer2 = setTimeout(() => {
      setDisplayedSymbols([result[0], result[1], SPIN_SYMBOL]);
      setRevealedCount(2);
    }, 2000);

    // Reveal third symbol after 3 seconds
    const timer3 = setTimeout(() => {
      setDisplayedSymbols([result[0], result[1], result[2]]);
      setRevealedCount(3);
      onSpinComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [result, isSpinning, onSpinComplete]);

  const getSymbolName = (symbol: string): string => {
    switch (symbol) {
      case 'C': return 'Cherry';
      case 'L': return 'Lemon';
      case 'O': return 'Orange';
      case 'W': return 'Watermelon';
      default: return '';
    }
  };

  const getDisplaySymbol = (index: number): string => {
    if (isSpinning) {
      return spinningSymbols[index];
    }
    if (result.length === 0) {
      return displayedSymbols[index];
    }
    return displayedSymbols[index];
  };

  const isSymbolSpinning = (index: number): boolean => {
    if (isSpinning) return true;
    if (result.length === 0) return false;
    return revealedCount <= index;
  };

  return (
    <div className="slot-machine">
      <div className="slots-container">
        {[0, 1, 2].map(index => (
          <div
            key={index}
            className={`slot ${isSymbolSpinning(index) ? 'spinning' : ''}`}
            title={getSymbolName(getDisplaySymbol(index))}
          >
            <span className="symbol">{getDisplaySymbol(index)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotMachine;
