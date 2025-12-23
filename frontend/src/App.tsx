import { useState, useEffect, useCallback } from 'react';
import SlotMachine from './components/SlotMachine';
import CashOutButton from './components/CashOutButton';
import { createSession, roll, cashOut, GameSession, RollResult } from './services/api';
import './App.css';

function App() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [result, setResult] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [lastWin, setLastWin] = useState<{ win: boolean; reward: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cashOutMessage, setCashOutMessage] = useState<string | null>(null);

  // Create session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const newSession = await createSession();
        setSession(newSession);
      } catch (err) {
        setError('Failed to create game session. Is the backend running?');
        console.error(err);
      }
    };
    initSession();
  }, []);

  const handleRoll = async () => {
    if (!session || isSpinning || isRevealing || session.credits < 1) return;

    setIsSpinning(true);
    setLastWin(null);
    setError(null);
    setResult([]);

    try {
      const rollResult: RollResult = await roll(session.session_token);
      setIsSpinning(false);
      setIsRevealing(true);
      setResult(rollResult.result);
      setLastWin({ win: rollResult.win, reward: rollResult.reward });
      setSession(prev => prev ? { ...prev, credits: rollResult.credits } : null);
    } catch (err: any) {
      setIsSpinning(false);
      setError(err.response?.data?.error || 'Failed to roll');
      console.error(err);
    }
  };

  const handleSpinComplete = useCallback(() => {
    setIsRevealing(false);
  }, []);

  const handleCashOut = async () => {
    if (!session || isSpinning || isRevealing) return;

    try {
      const cashOutResult = await cashOut(session.session_token);
      setCashOutMessage(`Congratulations! You cashed out ${cashOutResult.credits_cashed} credits!`);
      setSession(prev => prev ? { ...prev, cashed_out: true, credits: 0 } : null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cash out');
      console.error(err);
    }
  };

  const startNewGame = async () => {
    try {
      const newSession = await createSession();
      setSession(newSession);
      setResult([]);
      setLastWin(null);
      setError(null);
      setCashOutMessage(null);
    } catch (err) {
      setError('Failed to create new game session');
      console.error(err);
    }
  };

  const canPlay = session && !session.cashed_out && session.credits >= 1 && !isSpinning && !isRevealing;

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎰 Slot Machine 🎰</h1>
        <p className="subtitle">The House Always Wins!</p>
      </header>

      <main className="game-container">
        {error && <div className="error-message">{error}</div>}
        {cashOutMessage && <div className="success-message">{cashOutMessage}</div>}

        <div className="credits-display">
          <span className="credits-label">Credits:</span>
          <span className="credits-value">{session?.credits ?? 0}</span>
        </div>

        <SlotMachine
          result={result}
          isSpinning={isSpinning}
          onSpinComplete={handleSpinComplete}
        />

        {lastWin && !isRevealing && (
          <div className={`result-message ${lastWin.win ? 'win' : 'lose'}`}>
            {lastWin.win
              ? `🎉 You won ${lastWin.reward} credits! 🎉`
              : '😢 Better luck next time!'}
          </div>
        )}

        <div className="controls">
          {!session?.cashed_out ? (
            <>
              <button
                className="roll-button"
                onClick={handleRoll}
                disabled={!canPlay}
              >
                {isSpinning ? 'Spinning...' : isRevealing ? 'Revealing...' : 'ROLL (1 Credit)'}
              </button>

              <CashOutButton
                onCashOut={handleCashOut}
                disabled={!session || isSpinning || isRevealing || session.cashed_out}
              />
            </>
          ) : (
            <button className="new-game-button" onClick={startNewGame}>
              Start New Game
            </button>
          )}
        </div>

        <div className="legend">
          <h3>Symbol Rewards:</h3>
          <ul>
            <li><span className="legend-icon">🍒</span> Cherry = 10 credits</li>
            <li><span className="legend-icon">🍋</span> Lemon = 20 credits</li>
            <li><span className="legend-icon">🍊</span> Orange = 30 credits</li>
            <li><span className="legend-icon">🍉</span> Watermelon = 40 credits</li>
          </ul>
          <p className="note">Match 3 of the same symbol to win!</p>
        </div>
      </main>
    </div>
  );
}

export default App;
