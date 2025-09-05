// -- IMPORTS

import React, { useState } from 'react';
import { useTrading } from '@/hooks/useTrading';
import { SymbolSearch } from './SymbolSearch';
import { PriceTable } from './PriceTable';
import { WatchlistManager } from './WatchlistManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Wifi, WifiOff, TrendingUp } from 'lucide-react';
import { getClassNames } from '@/lib/Utils.ts';

// -- FUNCTIONS

export function TradingDashboard(
    )
{
    const {
        watchlist,
        allSymbols,
        isLoadingSymbols,
        symbolsError,
        refreshData,
        connectWebSocket,
        disconnectWebSocket
        } = useTrading();

    const [ activeTab, setActiveTab ] = useState<'watchlist' | 'all'>( 'watchlist' );

    function handleRefresh(
        )
    {
        refreshData();
    };

    function handleConnectionToggle(
        )
    {
        if ( watchlist.isConnected )
        {
            disconnectWebSocket();
        }
        else
        {
            connectWebSocket();
        }
    };

    const watchlistSymbols = allSymbols.filter(
        symbol =>
        watchlist.symbols.includes( symbol.symbol )
        );

    return (
        <div className="min-h-screen bg-trading-bg p-4 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-trading-text">Crypto Trading Dashboard</h1>
                        <p className="text-trading-text-muted">Real-time cryptocurrency prices</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant={ watchlist.isConnected ? 'default' : 'secondary' } className="gap-2">
                        {
                            watchlist.isConnected
                                ? (
                                    <Wifi className="h-3 w-3" />
                                    )
                                : (
                                    <WifiOff className="h-3 w-3" />
                                    )
                        }
                        { watchlist.isConnected ? 'Connected' : 'Disconnected' }
                    </Badge>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={ handleConnectionToggle }
                        disabled={ watchlist.symbols.length === 0 }
                    >
                        { watchlist.isConnected ? 'Disconnect' : 'Connect' }
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={  handleRefresh}
                        disabled={ isLoadingSymbols }
                        className="gap-2"
                    >
                        <RefreshCw className={ getClassNames( 'h-4 w-4', isLoadingSymbols && 'animate-spin' ) } />
                        Refresh
                    </Button>
                </div>
            </div>

            {
                ( symbolsError || watchlist.error ) && (
                    <Card className="border-destructive">
                        <CardHeader>
                            <CardTitle className="text-destructive">Connection Error</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-trading-text-muted">
                                { symbolsError || watchlist.error }
                            </p>
                        </CardContent>
                    </Card>
                )
            }

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <Card className="bg-trading-surface border-trading-border">
                        <CardHeader>
                            <CardTitle className="text-trading-text">Add Symbols</CardTitle>
                            <CardDescription className="text-trading-text-muted">
                                Search and add symbols to your watchlist
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SymbolSearch symbols={ allSymbols } isLoading={ isLoadingSymbols } />
                        </CardContent>
                    </Card>

                    <WatchlistManager />
                </div>

                <div className="lg:col-span-3">
                    <Tabs value={ activeTab } onValueChange={ ( value ) => setActiveTab( value as 'watchlist' | 'all' ) }>
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="watchlist" className="gap-2">
                                Watchlist
                                <Badge variant="secondary" className="text-xs">
                                    { watchlist.symbols.length }
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="all" className="gap-2">
                                All Symbols
                                <Badge variant="secondary" className="text-xs">
                                    { allSymbols.length }
                                </Badge>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="watchlist">
                            <Card className="bg-trading-surface border-trading-border">
                                <CardHeader>
                                    <CardTitle className="text-trading-text">Your Watchlist</CardTitle>
                                    <CardDescription className="text-trading-text-muted">
                                        Real-time prices for your selected symbols
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PriceTable
                                        symbols={ watchlistSymbols }
                                        prices={ watchlist.prices }
                                        isConnected={ watchlist.isConnected }
                                        showActions={ true }
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="all">
                            <Card className="bg-trading-surface border-trading-border">
                                <CardHeader>
                                    <CardTitle className="text-trading-text">All Available Symbols</CardTitle>
                                    <CardDescription className="text-trading-text-muted">
                                        Browse all available trading pairs
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PriceTable
                                        symbols={ allSymbols.slice( 0, 50 ) }
                                        prices={ {} }
                                        isConnected={ false }
                                        showActions={ true }
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
        );
};