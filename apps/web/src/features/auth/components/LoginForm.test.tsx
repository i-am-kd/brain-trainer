import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest';
import { LoginForm } from './LoginForm.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import * as authApi from '../api/authApi.js';

// mock the API call 
vi.mock('../api/authApi',  () =>({
    authApi: {
        login: vi.fn(),
    },
}));

// moch the auth store 
vi.mock('../../store/useAuthStore', () =>({
    useAuthStore: vi.fn(()=>({
        login: vi.fn(),
    })),
}));

const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}},
});

const renderWithProvider = (ui: React.ReactElement) =>{
    return render(
        <QueryClientProvider client ={queryClient}>
            <MemoryRouter>
                {ui}
            </MemoryRouter>
        </QueryClientProvider>
    );
};
describe('LoginForm', () =>{
    it('renders email and password inputs', () =>{
        renderWithProvider(<LoginForm />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('call login API on submit', async () =>{
        const mockLogin = vi.spyOn(authApi.authApi, 'login').mockResolvedValue({
            token :'fake-token', 
            user: {_id: "1", email: 'test@test.com', username: 'test', role: 'user'}
        });

        renderWithProvider(<LoginForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {target: {value: 'test@test.com'}});
        fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'password'}});
        fireEvent.click(screen.getByRole('button', {name: /login/i}));

        await waitFor(()=>{
            expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password');
        });
    });
});