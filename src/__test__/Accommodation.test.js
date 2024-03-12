import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Accommodation from '../components/Accommodation';

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([
                { id: 1, name: 'Hotel A', location: 'Location A', price: '100' }
            ]),
        })
    );
});

beforeEach(() => {
    fetch.mockClear();
});

describe('boundary', () => {
    test('AccommodationComponent boundary renders without crashing', () => {
        render(<Accommodation />);
        expect(screen.getByText('Accommodations')).toBeInTheDocument();
    });

    test('AccommodationComponent boundary fetches and displays accommodations', async () => {
        render(<Accommodation />);
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
        expect(screen.getByText('Hotel A - Location A - $100')).toBeInTheDocument();
    });

    // test('AccommodationComponent boundary adds a new accommodation', async () => {
    //     render(<Accommodation />);
    //     fetch.mockImplementationOnce(() =>
    //         Promise.resolve({
    //             json: () => Promise.resolve({ id: 2, name: 'Hotel B', location: 'Location B', price: '200' }),
    //         })
    //     );
    //     await userEvent.type(screen.getByLabelText(/Name:/i), 'Hotel B');
    //     await userEvent.type(screen.getByLabelText(/Location:/i), 'Location B');
    //     await userEvent.type(screen.getByLabelText(/Price:/i), '200');
    //     userEvent.click(screen.getByText('Add Accommodation'));
    //     await waitFor(() => expect(screen.getByText('Hotel B - Location B - $200')).toBeInTheDocument());
    // });

    test('AccommodationComponent boundary deletes an accommodation', async () => {
        render(<Accommodation />);
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
        fetch.mockImplementationOnce(() =>
            Promise.resolve({ status: 200 })
        );
        fireEvent.click(screen.getAllByText('Delete')[0]);
        await waitFor(() => expect(screen.queryByText('Hotel A - Location A - $100')).not.toBeInTheDocument());
    });
});
