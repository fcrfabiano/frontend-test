// -- IMPORTS

import { useCallback, useEffect, useRef, useState } from 'react';
import { WebSocketMessage } from '@/types/Trading';
import { ApplicationSettings } from '@/config/ApplicationSettings';
import { BinanceService } from '@/services/BinanceService';

// -- TYPES

interface UseWebSocketOptions
    {
        symbols: string[];
        onMessage?: (data: any) => void;
        onConnect?: () => void;
        onDisconnect?: () => void;
        onError?: (error: string) => void;
    }

// -- FUNCTIONS

export function useWebSocket(
    {
        symbols,
        onMessage,
        onConnect,
        onDisconnect,
        onError
    }: UseWebSocketOptions
    )
{
    const [ isConnected, setIsConnected ] = useState( false );
    const [ reconnectAttemptCount, setReconnectAttemptCount ] = useState( 0 );

    const websocketRef = useRef<WebSocket | null>( null );
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>( null );
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000;

    const connect = useCallback(
        () =>
        {
            if ( symbols.length === 0 )
            {
                console.log( 'No symbols to connect to WebSocket' );

                return;
            }

            if ( websocketRef.current?.readyState === WebSocket.OPEN )
            {
                console.log('WebSocket already connected');

                return;
            }

            const url = BinanceService.buildWebSocketUrl( symbols );

            if ( !url )
            {
                console.error( 'Could not build WebSocket URL' );

                return;
            }

            console.log('Connecting to WebSocket:', url);

        try
        {
            websocketRef.current = new WebSocket(url);

            websocketRef.current.onopen =
                () =>
                {
                    console.log( 'WebSocket connected successfully' );
                    setIsConnected( true );
                    setReconnectAttemptCount( 0 );
                    onConnect?.();
                };

            websocketRef.current.onmessage =
                ( event ) =>
                {
                    try
                    {
                        const message = JSON.parse( event.data );
                    
                        if ( message.stream && message.data )
                        {
                            onMessage?.( message.data );
                        }
                        else if ( message.e === '24hrTicker' )
                        {
                            onMessage?.( message );
                        }
                    }
                    catch ( error )
                    {
                        console.error( 'Error parsing WebSocket message:', error );
                    }
                };

            websocketRef.current.onclose =
            ( event ) =>
            {
                console.log( 'WebSocket connection closed:', event.code, event.reason );
                setIsConnected( false );
                onDisconnect?.();

                if ( reconnectAttemptCount < maxReconnectAttempts
                    && !event.wasClean )
                {
                    setReconnectAttemptCount( previousState => previousState + 1 );
                
                    reconnectTimeoutRef.current = setTimeout(
                        () =>
                        {
                            console.log(`Attempting to reconnect... (${ reconnectAttemptCount + 1 }/${ maxReconnectAttempts })` );
                            connect();
                        },
                        reconnectDelay
                        );
                }
            };

            websocketRef.current.onerror =
                ( error ) =>
                {
                    console.error( 'WebSocket error:', error );
                    const errorMessage = 'WebSocket connection error';
                    onError?.( errorMessage );
                    setIsConnected( false );
                };

        }
        catch ( error )
        {
            console.error( 'Error creating WebSocket connection:', error );
            onError?.( 'Failed to create WebSocket connection' );
        }
    },
    [ symbols, onMessage, onConnect, onDisconnect, onError, reconnectAttemptCount ]
    );

const disconnect = useCallback(
    () =>
    {
        console.log( 'Disconnecting WebSocket' );
        
        if ( reconnectTimeoutRef.current )
        {
            clearTimeout( reconnectTimeoutRef.current );
            reconnectTimeoutRef.current = null;
        }

        if ( websocketRef.current )
        {
            websocketRef.current.close( 1000, 'User requested disconnect' );
            websocketRef.current = null;
        }

        setIsConnected( false );
        setReconnectAttemptCount( 0 );
    },
    []
    );

    useEffect(
        () =>
        {
            if ( isConnected
                 && symbols.length > 0 )
            {
                disconnect();
                setTimeout(
                    () =>
                    {
                        connect();
                    },
                    500
                    );
        }
    },
    [ symbols.join( ',' ) ]
    );

    useEffect(
        () =>
        {
            return () => disconnect();
        },
        [ disconnect ]
        );

    return (
        {
            isConnected,
            connect,
            disconnect,
            reconnectAttemptCount
        }
        );
};