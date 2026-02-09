import React from 'react';
import { render, screen, act } from '@testing-library/react';
import CryptoChart from '@/components/CryptoChart';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-line-chart" />,
}));

describe('CryptoChart Component', () => {
    const mockCoinId = 'bitcoin';
    const mockLabel = 'Bitcoin';
    const mockColor = 'rgba(59, 130, 246, 1)';

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should fetch and display current price on mount', async () => {
        (axios.get as jest.Mock).mockImplementation((url) => {
            if (url.includes('market_chart')) {
                return Promise.resolve({ data: { prices: [[12345678, 45000]] } });
            }
            return Promise.resolve({ data: {} });
        });

        await act(async () => {
            render(<CryptoChart coinId={mockCoinId} label={mockLabel} color={mockColor} />);
        });

        expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument();
        expect(screen.getByText(/\$45,000/i)).toBeInTheDocument();
    });

    it('should display stable rate for fiat methods', async () => {
        await act(async () => {
            render(<CryptoChart coinId="cashapp" label="CashApp" color={mockColor} />);
        });

        expect(screen.getByText(/\$1.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Stable Rate/i)).toBeInTheDocument();
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('should poll for price updates every 60 seconds', async () => {
        (axios.get as jest.Mock).mockImplementation((url) => {
            if (url.includes('market_chart')) {
                return Promise.resolve({ data: { prices: [[12345678, 45000]] } });
            }
            if (url.includes('simple/price')) {
                return Promise.resolve({ data: { bitcoin: { usd: 46000 } } });
            }
            return Promise.resolve({ data: {} });
        });

        await act(async () => {
            render(<CryptoChart coinId="bitcoin" label="Bitcoin" color={mockColor} />);
        });

        expect(screen.getByText(/\$45,000/i)).toBeInTheDocument();

        // Fast-forward 60 seconds
        await act(async () => {
            jest.advanceTimersByTime(61000);
        });

        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('simple/price'), expect.anything());
        expect(screen.getByText(/\$46,000/i)).toBeInTheDocument();
    });
});
