import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';

describe('boundary', () => {
    test('AppComponent boundary renders without crashing', () => {
        render(<App />);
    });

    test('AppComponent boundary has "Travel Planner" h1', () => {
        render(<App />);
        expect(screen.queryByText('Travel Planner')).toBeInTheDocument();
    });
});
