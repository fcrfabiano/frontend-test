// -- TYPES

import React, { useState, useMemo } from 'react';
import { BinanceSymbol } from '@/types/Trading';
import { useTrading } from '@/hooks/useTrading';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, Loader2 } from 'lucide-react';
import { getClassNames } from '@/lib/Utils';

// -- TYPES

interface SymbolSearchProps
    {
        symbols: BinanceSymbol[];
        isLoading: boolean;
    }

// -- FUNCTIONS

export function SymbolSearch(
    {
        symbols,
        isLoading
    }: SymbolSearchProps
    )
{
    const [ searchTerm, setSearchTerm ] = useState( '' );
    const { addToWatchlist, watchlist } = useTrading();

    const filteredSymbols = useMemo(
        () =>
        {
            if ( !searchTerm.trim() )
            {
                const popularPairs = [ 'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT' ];

                return symbols.filter(symbol => popularPairs.includes(symbol.symbol));
            }

            const term = searchTerm.toLowerCase();

            return symbols.filter(
                symbol => symbol.symbol.toLowerCase().includes( term )
                     || symbol.baseAsset.toLowerCase().includes( term )
                     || symbol.quoteAsset.toLowerCase().includes( term )
                ).slice( 0, 20 );
        },
        [ symbols, searchTerm ]
        );

    function handleAddSymbol(
        symbol: string
        )
    {
        addToWatchlist( symbol );
        setSearchTerm( '' );
    };

    function isSymbolInWatchlist(
        symbol: string
        )
    {
        return watchlist.symbols.includes( symbol );
    };

    if ( isLoading )
    {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-trading-text-muted">Loading symbols...</span>
            </div>
            );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-trading-text-muted" />
                <Input
                    placeholder="Search symbols (e.g., BTC, ETH, BNB)"
                    value={ searchTerm }
                    onChange={ ( { target } ) => setSearchTerm( target.value ) }
                    className="pl-10 bg-trading-bg border-trading-border text-trading-text placeholder:text-trading-text-muted"
                />
            </div>

            <ScrollArea className="h-64 w-full">
                <div className="space-y-2">
                {
                    filteredSymbols.length === 0
                        ? (
                            <div className="text-center py-4 text-trading-text-muted">
                                { searchTerm ? 'No symbols found' : 'Popular trading pairs' }
                            </div>
                            )
                        : (
                            filteredSymbols.map(
                                ( symbol ) =>
                                (
                                    <div
                                        key={ symbol.symbol }
                                        className="flex items-center justify-between p-3 rounded-lg border border-trading-border hover:bg-trading-bg/50 transition-colors"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-trading-text">{ symbol.symbol }</span>
                                            <span className="text-xs text-trading-text-muted">
                                                { symbol.baseAsset }/{ symbol.quoteAsset }
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                        {
                                            symbol.status === 'TRADING' && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Active
                                                </Badge>
                                                )
                                        }
                                        
                                        <Button
                                            size="sm"
                                            variant={ isSymbolInWatchlist( symbol.symbol ) ? 'secondary' : 'default' }
                                            onClick={ () => handleAddSymbol( symbol.symbol ) }
                                            disabled={ isSymbolInWatchlist( symbol.symbol ) }
                                            className="gap-1"
                                        >
                                            <Plus className="h-3 w-3" />
                                            { isSymbolInWatchlist( symbol.symbol ) ? 'Added' : 'Add' }
                                        </Button>
                                        </div>
                                    </div>
                                )
                                )
                )}
                </div>
            </ScrollArea>

            {
                !searchTerm && (
                    <div className="text-xs text-trading-text-muted space-y-1">
                    <p>💡 <strong>Search tips:</strong></p>
                    <p>• Type "BTC" to find Bitcoin pairs</p>
                    <p>• Type "USDT" to find Tether pairs</p>
                    <p>• Type full symbol like "ETHBTC"</p>
                    </div>
                    )
            }
        </div>
    );
};