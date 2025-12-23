import { render, screen, fireEvent } from '@testing-library/react';
import CashOutButton from './CashOutButton';

describe('CashOutButton', () => {
  it('renders the cash out button', () => {
    render(<CashOutButton onCashOut={() => {}} disabled={false} />);
    expect(screen.getByText('CASH OUT')).toBeInTheDocument();
  });

  it('calls onCashOut when clicked and not disabled', () => {
    const mockOnCashOut = jest.fn();
    // Mock Math.random to always return 0.95 (no dodge behavior)
    jest.spyOn(Math, 'random').mockReturnValue(0.95);

    render(<CashOutButton onCashOut={mockOnCashOut} disabled={false} />);

    const button = screen.getByText('CASH OUT');
    fireEvent.mouseEnter(button);
    fireEvent.click(button);

    expect(mockOnCashOut).toHaveBeenCalledTimes(1);

    jest.spyOn(Math, 'random').mockRestore();
  });

  it('does not call onCashOut when disabled', () => {
    const mockOnCashOut = jest.fn();

    render(<CashOutButton onCashOut={mockOnCashOut} disabled={true} />);

    const button = screen.getByText('CASH OUT');
    fireEvent.click(button);

    expect(mockOnCashOut).not.toHaveBeenCalled();
  });

  it('moves button when random roll is below 0.5', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.3) // First call for dodge decision (< 0.5 = move)
      .mockReturnValueOnce(0.5); // Second call for angle

    render(<CashOutButton onCashOut={() => {}} disabled={false} />);

    const button = screen.getByText('CASH OUT');
    fireEvent.mouseEnter(button);

    // Button should have moved (non-zero transform)
    expect(button.style.transform).not.toBe('translate(0px, 0px)');
    expect(screen.getByText('Too slow!')).toBeInTheDocument();

    jest.spyOn(Math, 'random').mockRestore();
  });

  it('becomes unclickable when random roll is between 0.5 and 0.9', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.7);

    const mockOnCashOut = jest.fn();
    render(<CashOutButton onCashOut={mockOnCashOut} disabled={false} />);

    const button = screen.getByText('CASH OUT');
    fireEvent.mouseEnter(button);

    expect(screen.getByText('Nice try!')).toBeInTheDocument();
    expect(button).toHaveClass('unclickable');

    // Click should not work
    fireEvent.click(button);
    expect(mockOnCashOut).not.toHaveBeenCalled();

    jest.spyOn(Math, 'random').mockRestore();
  });

  it('shows reset button when position is changed', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.3) // Move
      .mockReturnValueOnce(0.5); // Angle

    render(<CashOutButton onCashOut={() => {}} disabled={false} />);

    const button = screen.getByText('CASH OUT');
    fireEvent.mouseEnter(button);

    expect(screen.getByText('Reset Button Position')).toBeInTheDocument();

    jest.spyOn(Math, 'random').mockRestore();
  });

  it('resets position when reset button is clicked', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.3) // Move
      .mockReturnValueOnce(0.5); // Angle

    render(<CashOutButton onCashOut={() => {}} disabled={false} />);

    const cashOutButton = screen.getByText('CASH OUT');
    fireEvent.mouseEnter(cashOutButton);

    const resetButton = screen.getByText('Reset Button Position');
    fireEvent.click(resetButton);

    expect(cashOutButton.style.transform).toBe('translate(0px, 0px)');

    jest.spyOn(Math, 'random').mockRestore();
  });
});
