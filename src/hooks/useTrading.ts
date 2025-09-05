// -- IMPORTS

import { TradingContext } from '@/context/TradingContext';
import { TradingContextType } from '@/types/Trading';
import { useContext } from 'react';

// -- FUNCTIONS

export function useTrading(
    ): TradingContextType
{
    const context = useContext( TradingContext );

    if ( !context )
    {
        throw new Error( 'useTrading must be used within a TradingProvider' );
    }

    return context;
};