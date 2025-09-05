// -- IMPORTS

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// -- CONSTANTS

const queryClient = new QueryClient();

// -- FUNCTIONS

export default function App(
    )
{
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <Home /> } />
                    <Route path="*" element={ <NotFound /> } />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
        );
}