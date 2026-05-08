import {render, screen} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GameScreen } from './gameScreen.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore.js';

// mock the API 
vi.mock('../api/gameApi', () =>({
    gameApi: {
        getSequence: vi.fn(() => Promise.resolve({
            id: 'seq_1', 
            words: ['apple', 'banana'],
            difficulty: 'easy'
        })),
        submitResult: vi.fn(),
    }
}));

vi.mock('../../store/useAuthStore', () =>({
    useAuthStore: vi.fn(() =>({
        logout: vi.fn(),
    })),
}));

const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}},
});

const renderWithProviders = (ui: React.ReactElement) =>{
    return render(
        <QueryClientProvider client ={queryClient}>
            <MemoryRouter>
                {ui}
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('GameScreen', () =>{
    it("should display the word sequence", async () =>{
        renderWithProviders(<GameScreen />);

        const words = await screen.findByText(/apple banana/i);
        expect(words).toBeInTheDocument();
    });

    it("should displaydifficulty level", async () =>{
        renderWithProviders(<GameScreen />);
        expect(await screen.findByText(/easy/i)).toBeInTheDocument();
    });

    it("has submit button", async () =>{
        renderWithProviders(<GameScreen />);
        expect (await screen.findByRole('button', {name: /submit answer/i})).toBeInTheDocument();
    })
})