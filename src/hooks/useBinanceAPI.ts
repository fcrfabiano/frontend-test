// -- IMPORTS

import { BinanceSymbol, ExchangeInfo } from '@/types/Trading';
import { ApplicationSettings } from '@/config/ApplicationSettings';
import { HttpClient } from '@/lib/HttpClient';
import { useBinanceSymbols } from './useBinanceSymbols';

// -- FUNCTIONS

export function useBinanceAPI(
    )
{
    const { data: symbols = [], isLoading, error, refetch } = useBinanceSymbols();

    return (
        {
            symbols,
            isLoading,
            error: error?.message || null,
            fetchSymbols: refetch
        }
        );
};