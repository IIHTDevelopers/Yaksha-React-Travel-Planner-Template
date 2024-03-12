import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Transportation from '../components/Transportation';

beforeEach(() => {
    global.fetch = jest.fn((url) =>
        Promise.resolve({
            json: () => {
                if (url.includes('transportations')) {
                    return Promise.resolve([
                        { id: 1, type: "Bus", details: "City center to airport" }
                    ]);
                }
                return Promise.resolve([]);
            },
        })
    );
});

afterEach(() => {
    global.fetch.mockClear();
});

describe('boundary', () => {
    test('TransportationComponent boundary renders without crashing', () => {
        render(<Transportation />);
    });

    test('TransportationComponent boundary displays heading', async () => {
        render(<Transportation />);
        expect(await screen.findByText('Transportation Options')).toBeInTheDocument();
    });

    test('TransportationComponent boundary form is rendered and can submit a new transportation option', async () => {
        render(<Transportation />);
        await waitFor(() => expect(screen.getByLabelText('Type:')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByLabelText('Details:')).toBeInTheDocument());
        fireEvent.change(screen.getByLabelText('Type:'), { target: { value: 'Train' } });
        fireEvent.change(screen.getByLabelText('Details:'), { target: { value: 'Downtown to suburb' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add Transportation' }));
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    test('TransportationComponent boundary displays transportation options and allows deletion', async () => {
        render(<Transportation />);
        await waitFor(() => expect(screen.getByText(/Bus - City center to airport/)).toBeInTheDocument());
        fireEvent.click(screen.getByText('Delete'));
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });
});
