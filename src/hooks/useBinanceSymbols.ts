// -- IMPORTS

import { useQuery } from '@tanstack/react-query';
import { BinanceService } from '@/services/BinanceService';
import { BinanceSymbol } from '@/types/Trading';

// -- CONSTANTS

const THIRTY_MINUTES = 1000 * 60 * 30;
const ONE_HOUR = 1000 * 60 * 60;

// -- FUNCTIONS

export function useBinanceSymbols(
    )
{
    return useQuery<BinanceSymbol[], Error>(
        {
            queryKey: [ 'binance-symbols' ],
            queryFn: BinanceService.getActiveSymbols,
            staleTime: THIRTY_MINUTES,
            gcTime: ONE_HOUR,
            retry: 2,
        }
        );
};