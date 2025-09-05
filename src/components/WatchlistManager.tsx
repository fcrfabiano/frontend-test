// -- IMPORTS

import React from 'react';
import { useTrading } from '@/hooks/useTrading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Wifi, WifiOff, AlertCircle, Star } from 'lucide-react';
import { formatPercentage, formatPrice, getClassNames, getPriceChangeColor } from '@/lib/Utils';

// -- FUNCTIONS

export function WatchlistManager(
    )
{
    const { watchlist, removeFromWatchlist, clearWatchlist } = useTrading();

    function handleRemoveSymbol(
        symbol: string
        )
    {
        removeFromWatchlist( symbol );
    };

    function handleClearAll(
        )
    {
        if ( window.confirm( 'Are you sure you want to clear all symbols from your watchlist?' ) )
        {
            clearWatchlist();
        }
    };

    return (
        <Card className="bg-trading-surface border-trading-border">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        <CardTitle className="text-trading-text">Watchlist</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        { watchlist.symbols.length } symbols
                    </Badge>
                </div>
                <CardDescription className="text-trading-text-muted">
                    Manage your tracked symbols
                </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-trading-bg/50 border border-trading-border">
                    <div className="flex items-center gap-2">
                        {
                            watchlist.isConnected
                                ? (
                                    <Wifi className="h-4 w-4 text-trading-positive" />
                                    )
                                : (
                                    <WifiOff className="h-4 w-4 text-trading-text-muted" />
                                    )
                        }
                        <span className="text-sm text-trading-text">
                            { watchlist.isConnected ? 'Real-time updates active' : 'Not connected' }
                        </span>
                    </div>
                    <Badge variant={watchlist.isConnected ? "default" : "secondary"} className="text-xs">
                        { watchlist.isConnected ? 'Live' : 'Offline' }
                    </Badge>
                </div>

                {
                    watchlist.error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <span className="text-sm text-trading-text">{ watchlist.error }</span>
                        </div>
                        )
                }

                {
                    watchlist.symbols.length === 0
                        ? (
                            <div className="text-center py-6">
                                <Star className="h-8 w-8 text-trading-text-muted mx-auto mb-2" />
                                <p className="text-trading-text-muted text-sm">No symbols in watchlist</p>
                                <p className="text-trading-text-muted text-xs mt-1">
                                    Add symbols using the search above
                                </p>
                            </div>
                            )
                        : (
                            <div className="space-y-2">
                                <ScrollArea className="h-48 w-full">
                                    {
                                        watchlist.symbols.map(
                                            ( symbol ) =>
                                            {
                                                const priceData = watchlist.prices[ symbol ];
                                                const hasPrice = !!priceData;
                                            
                                                return (
                                                    <div
                                                        key={ symbol }
                                                        className="flex items-center justify-between p-3 rounded-lg border border-trading-border hover:bg-trading-bg/30 transition-colors group"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-trading-text text-sm">{ symbol }</span>
                                                            {
                                                                hasPrice && (
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-xs font-mono text-trading-text">
                                                                            ${ formatPrice( priceData.lastPrice ) }
                                                                        </span>
                                                                        <span className=
                                                                            {
                                                                                getClassNames(
                                                                                    'text-xs font-mono',
                                                                                    getPriceChangeColor( priceData.priceChangePercent )
                                                                                    )
                                                                            }
                                                                        >
                                                                            { formatPercentage( priceData.priceChangePercent ) }%
                                                                        </span>
                                                                    </div>
                                                                    )
                                                            }
                                                            {
                                                                !hasPrice && watchlist.isConnected && (
                                                                    <span className="text-xs text-trading-text-muted">Connecting...</span>
                                                                    )
                                                            }
                                                        </div>
                                                        
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={ () => handleRemoveSymbol( symbol ) }
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-trading-negative hover:text-trading-negative hover:bg-trading-negative/10"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    );
                                            }
                                            )
                                    }
                                </ScrollArea>
                                
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={ handleClearAll }
                                    className="w-full mt-2 border-trading-negative/30 text-trading-negative hover:bg-trading-negative/10"
                                >
                                <Trash2 className="h-3 w-3 mr-2" />
                                    Clear All
                                </Button>
                            </div>
                            )
                }
            </CardContent>
        </Card>
    );
};