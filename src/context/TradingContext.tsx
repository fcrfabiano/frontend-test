
// -- IMPORTS

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { BinanceSymbol, TradingContextType, WatchlistState, PriceData } from '@/types/Trading';
import { useBinanceAPI } from '@/hooks/useBinanceAPI';
import { useWebSocket } from '@/hooks/useWebSocket';

// -- TYPES

type WatchlistAction = 
    | { type: 'ADD_SYMBOL'; payload: string }
    | { type: 'REMOVE_SYMBOL'; payload: string }
    | { type: 'CLEAR_SYMBOLS' }
    | { type: 'UPDATE_PRICE'; payload: PriceData }
    | { type: 'SET_CONNECTION'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'CLEAR_PRICES' };

// -- CONSTANTS

const initialWatchlistState: WatchlistState =
    {
    symbols: [],
    prices: {},
    isConnected: false,
    error: null,
    };

const watchlistReducer = ( state: WatchlistState, action: WatchlistAction ): WatchlistState =>
    {
        switch ( action.type )
        {
            case 'ADD_SYMBOL':
                if ( state.symbols.includes( action.payload ) )
                {
                    return state;
                }

                return (
                    {
                        ...state,
                        symbols: [ ...state.symbols, action.payload ]
                    }
                    );

            case 'REMOVE_SYMBOL':
                return (
                    {
                        ...state,
                        symbols: state.symbols.filter( symbol => symbol !== action.payload ),
                        prices: Object.fromEntries(
                            Object.entries( state.prices ).filter( ( [ symbol ] ) => symbol !== action.payload )
                            )
                    }
                    );

            case 'CLEAR_SYMBOLS':
                return (
                    {
                        ...state,
                        symbols: [],
                        prices: {}
                    }
                    );

            case 'UPDATE_PRICE':
                return (
                    {
                        ...state,
                        prices:
                            {
                                ...state.prices,
                                [ action.payload.symbol ]: action.payload
                            }
                    }
                    );

            case 'SET_CONNECTION':
                return (
                    {
                        ...state,
                        isConnected: action.payload,
                        error: action.payload ? null : state.error
                    }
                    );

            case 'SET_ERROR':
            return (
                {
                    ...state,
                    error: action.payload,
                    isConnected: action.payload ? false : state.isConnected
                }
                );

            case 'CLEAR_PRICES':
                return (
                    {
                        ...state,
                        prices: {}
                    }
                    );

            default:
                return state;
        }
    };

export const TradingContext = createContext<TradingContextType | null>( null );

// -- FUNCTIONS

export function TradingProvider(
    { children }: { children: React.ReactNode }
    )
{
    const [ watchlist, dispatch ] = useReducer( watchlistReducer, initialWatchlistState );
    const { symbols: allSymbols, isLoading: isLoadingSymbols, error: symbolsError, fetchSymbols } = useBinanceAPI();
  
    const handleWebSocketMessage = useCallback(
        ( data: any ) =>
        {
            if ( data
                 && data.s
                 && data.c )
            {
                const priceData: PriceData =
                    {
                        symbol: data.s,
                        lastPrice: data.c,
                        bidPrice: data.b || '0',
                        askPrice: data.a || '0',
                        priceChange: data.p || '0',
                        priceChangePercent: data.P || '0',
                        volume: data.v || '0',
                        lastUpdated: Date.now()
                    };

                dispatch(
                    {
                        type: 'UPDATE_PRICE',
                        payload: priceData
                    }
                    );
            }
        },
        []
        );

    const handleWebSocketConnect = useCallback(
        () =>
        {
            dispatch(
                {
                    type: 'SET_CONNECTION',
                    payload: true
                }
                );
        },
        []
        );

    const handleWebSocketDisconnect = useCallback(
        () =>
        {
            dispatch(
                {
                    type: 'SET_CONNECTION',
                    payload: false
                }
                );
        },
        []
        );

    const handleWebSocketError = useCallback(
        ( error: string ) =>
        {
            dispatch(
                {
                    type: 'SET_ERROR',
                    payload: error
                }
                );
        },
        []
        );

    const { connect, disconnect, isConnected } = useWebSocket(
        {
            symbols: watchlist.symbols,
            onMessage: handleWebSocketMessage,
            onConnect: handleWebSocketConnect,
            onDisconnect: handleWebSocketDisconnect,
            onError: handleWebSocketError
        }
        );

    const addToWatchlist = useCallback(
        ( symbol: string ) =>
        {
            dispatch(
                {
                    type: 'ADD_SYMBOL',
                    payload: symbol.toUpperCase()
                }
                );
        },
        []
        );

    const removeFromWatchlist = useCallback(
        ( symbol: string ) =>
        {
            dispatch(
                {
                    type: 'REMOVE_SYMBOL',
                    payload: symbol.toUpperCase()
                }
                );
        },
        []
        );

    const clearWatchlist = useCallback(
        () =>
        {
            dispatch( { type: 'CLEAR_SYMBOLS' } );
        },
        []
        );

    const connectWebSocket = useCallback(
        () =>
        {
            connect();
        },
        [ connect ]
        );

    const disconnectWebSocket = useCallback(
        () =>
        {
            disconnect();
        },
        [ disconnect ]
        );

    const refreshData = useCallback(
        () =>
        {
            fetchSymbols();
            dispatch( { type: 'CLEAR_PRICES' } );
        },
        [ fetchSymbols ]
        );

    useEffect(
        () =>
        {
            if ( watchlist.symbols.length > 0
                && !isConnected )
            {
                connect();
            }
            else if ( watchlist.symbols.length === 0
                 && isConnected )
            {
                disconnect();
            }
        },
        [ watchlist.symbols.length, isConnected, connect, disconnect ]
        );

    const contextValue: TradingContextType =
        {
            allSymbols,
            isLoadingSymbols,
            symbolsError,
            watchlist,
            addToWatchlist,
            removeFromWatchlist,
            clearWatchlist,
            connectWebSocket,
            disconnectWebSocket,
            refreshData
        };

    return (
        <TradingContext.Provider value={ contextValue }>
            { children }
        </TradingContext.Provider>
        );
};