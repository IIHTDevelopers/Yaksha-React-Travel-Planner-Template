import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BudgetTracker from '../components/BudgetTracker';

beforeEach(() => {
    global.fetch = jest.fn();
});

beforeEach(() => {
    fetch.mockClear();
});

describe('boundary', () => {
    test('BudgetTrackerComponent boundary renders without crashing', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => [],
        });
        render(<BudgetTracker />);
        await waitFor(() => expect(screen.getByText('Budget Tracker')).toBeInTheDocument());
    });

    test('BudgetTrackerComponent boundary fetches and displays budget items', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => [{ id: 1, description: 'Coffee', amount: 3.50 }],
        });
        render(<BudgetTracker />);
        await waitFor(() => expect(screen.getByText('Coffee: $3.50')).toBeInTheDocument());
    });

    test('BudgetTrackerComponent boundary adds a new budget item', async () => {
        const initialItems = [{ id: 1, description: 'Coffee', amount: 3.50 }];
        fetch.mockResolvedValueOnce({
            json: async () => initialItems,
        }).mockResolvedValueOnce({
            json: async () => ({ id: 2, description: 'Tea', amount: 2.50 }),
        });
        render(<BudgetTracker />);
        fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Tea' } });
        fireEvent.change(screen.getByLabelText(/Amount:/i), { target: { value: '2.50' } });
        fireEvent.click(screen.getByText('Add Item'));
        fetch.mockResolvedValueOnce({
            json: async () => [...initialItems, { id: 2, description: 'Tea', amount: 2.50 }],
        });
        await waitFor(() => expect(screen.getByText('Tea: $2.50')).toBeInTheDocument());
    });

    test('BudgetTrackerComponent boundary deletes a budget item', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => [{ id: 1, description: 'Coffee', amount: 3.50 }],
        });
        render(<BudgetTracker />);
        await waitFor(() => expect(screen.getByText('Coffee: $3.50')).toBeInTheDocument());
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        }));
        fireEvent.click(screen.getByText('Delete'));
        fetch.mockResolvedValueOnce({
            json: async () => [],
        });
        await waitFor(() => expect(screen.queryByText('Coffee: $3.50')).not.toBeInTheDocument());
    });

});
