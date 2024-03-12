import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Itinerary from '../components/Itinerary';

beforeEach(() => {
    global.fetch = jest.fn((url) =>
        Promise.resolve({
            json: () => {
                if (url.includes('itineraries')) {
                    return Promise.resolve([
                        { id: 1, title: "Trip to Paris", description: "Visiting the Eiffel Tower" }
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
    test('ItineraryComponent boundary renders without crashing', () => {
        render(<Itinerary />);
    });

    test('ItineraryComponent boundary displays heading', async () => {
        render(<Itinerary />);
        expect(await screen.findByText('Itinerary Planner')).toBeInTheDocument();
    });

    test('ItineraryComponent boundary form is rendered and can submit a new itinerary', async () => {
        render(<Itinerary />);
        await waitFor(() => expect(screen.getByLabelText('Title:')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByLabelText('Description:')).toBeInTheDocument());
        fireEvent.change(screen.getByLabelText('Title:'), { target: { value: 'Trip to Rome' } });
        fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'Visit the Colosseum' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add Itinerary' }));
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    test('ItineraryComponent boundary displays itineraries and allows deletion', async () => {
        render(<Itinerary />);
        await waitFor(() => expect(screen.getByText(/Trip to Paris - Visiting the Eiffel Tower/)).toBeInTheDocument());
        fireEvent.click(screen.getByText('Delete'));
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });
});
