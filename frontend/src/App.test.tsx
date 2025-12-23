import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import * as api from './services/api';

// Mock the API module
jest.mock('./services/api');

const mockApi = api as jest.Mocked<typeof api>;

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the slot machine title', async () => {
    mockApi.createSession.mockResolvedValue({
      session_token: 'test-token',
      credits: 10,
      cashed_out: false,
    });

    render(<App />);

    expect(screen.getByText(/Slot Machine/i)).toBeInTheDocument();
    expect(screen.getByText(/The House Always Wins/i)).toBeInTheDocument();
  });

  it('displays initial credits after session is created', async () => {
    mockApi.createSession.mockResolvedValue({
      session_token: 'test-token',
      credits: 10,
      cashed_out: false,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  it('displays error when session creation fails', async () => {
    mockApi.createSession.mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to create game session/i)).toBeInTheDocument();
    });
  });

  it('shows the roll button', async () => {
    mockApi.createSession.mockResolvedValue({
      session_token: 'test-token',
      credits: 10,
      cashed_out: false,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/ROLL/i)).toBeInTheDocument();
    });
  });

  it('shows symbol rewards legend', async () => {
    mockApi.createSession.mockResolvedValue({
      session_token: 'test-token',
      credits: 10,
      cashed_out: false,
    });

    render(<App />);

    expect(screen.getByText(/Symbol Rewards/i)).toBeInTheDocument();
    expect(screen.getByText(/Cherry/i)).toBeInTheDocument();
    expect(screen.getByText(/Lemon/i)).toBeInTheDocument();
    expect(screen.getByText(/Orange/i)).toBeInTheDocument();
    expect(screen.getByText(/Watermelon/i)).toBeInTheDocument();
  });

  it('shows new game button after cashing out', async () => {
    mockApi.createSession.mockResolvedValue({
      session_token: 'test-token',
      credits: 10,
      cashed_out: false,
    });

    mockApi.cashOut.mockResolvedValue({
      message: 'Successfully cashed out',
      credits_cashed: 10,
      session_token: 'test-token',
    });

    // Mock Math.random to ensure cash out button works
    jest.spyOn(Math, 'random').mockReturnValue(0.95);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    const cashOutButton = screen.getByText('CASH OUT');
    fireEvent.mouseEnter(cashOutButton);
    fireEvent.click(cashOutButton);

    await waitFor(() => {
      expect(screen.getByText(/Start New Game/i)).toBeInTheDocument();
    });

    jest.spyOn(Math, 'random').mockRestore();
  });
});
