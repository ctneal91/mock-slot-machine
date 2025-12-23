import { render, screen, act } from '@testing-library/react';
import SlotMachine from './SlotMachine';

describe('SlotMachine', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders 3 slot blocks', () => {
    render(
      <SlotMachine result={[]} isSpinning={false} onSpinComplete={() => {}} />
    );

    const slots = screen.getAllByText('?');
    expect(slots).toHaveLength(3);
  });

  it('shows spinning state when isSpinning is true', () => {
    render(
      <SlotMachine result={[]} isSpinning={true} onSpinComplete={() => {}} />
    );

    const slots = document.querySelectorAll('.slot.spinning');
    expect(slots).toHaveLength(3);
  });

  it('reveals symbols one by one after receiving result', () => {
    const mockOnSpinComplete = jest.fn();

    render(
      <SlotMachine
        result={['C', 'L', 'O']}
        isSpinning={false}
        onSpinComplete={mockOnSpinComplete}
      />
    );

    // Initially all should be spinning (X)
    expect(screen.getAllByText('X')).toHaveLength(3);

    // After 1 second, first symbol should be revealed
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getAllByText('X')).toHaveLength(2);

    // After 2 seconds, second symbol should be revealed
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getAllByText('X')).toHaveLength(1);

    // After 3 seconds, all symbols should be revealed
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('O')).toBeInTheDocument();
    expect(mockOnSpinComplete).toHaveBeenCalledTimes(1);
  });

  it('displays symbols with correct titles', () => {
    const mockOnSpinComplete = jest.fn();

    render(
      <SlotMachine
        result={['C', 'L', 'W']}
        isSpinning={false}
        onSpinComplete={mockOnSpinComplete}
      />
    );

    // Wait for all symbols to reveal
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByTitle('Cherry')).toBeInTheDocument();
    expect(screen.getByTitle('Lemon')).toBeInTheDocument();
    expect(screen.getByTitle('Watermelon')).toBeInTheDocument();
  });
});
