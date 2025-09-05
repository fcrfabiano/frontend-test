// -- IMPORTS

import React from 'react';
import { BinanceSymbol, PriceData } from '@/types/Trading';
import { useTrading } from '@/hooks/useTrading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { formatPercentage, formatPrice, getClassNames, getPriceChangeColor } from '@/lib/Utils';

// -- TYPES

interface PriceTableProps
    {
        symbols: BinanceSymbol[];
        prices: Record<string, PriceData>;
        isConnected: boolean;
        showActions?: boolean;
    }

// -- FUNCTIONS

export function PriceTable(
    { 
        symbols, 
        prices, 
        isConnected, 
        showActions = true
    }: PriceTableProps
    )
{
    const { addToWatchlist, removeFromWatchlist, watchlist } = useTrading();

    function getPriceChangeIcon(
        percentage: string
        )
    {
        const num = parseFloat( percentage );
    
        if ( num > 0) return <TrendingUp className="h-3 w-3" />;
        if ( num < 0 ) return <TrendingDown className="h-3 w-3" />;
    
        return null;
    };

    function isSymbolInWatchlist(
        symbol: string
        )
    {
        return watchlist.symbols.includes( symbol );
    };

    function handleAddSymbol(
        symbol: string
        )
    {
        addToWatchlist( symbol );
    };

    function handleRemoveSymbol(
        symbol: string
        )
    {
        removeFromWatchlist( symbol );
    };

    if ( symbols.length === 0 )
    {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <TrendingUp className="h-12 w-12 text-trading-text-muted mb-4" />

                <h3 className="text-lg font-semibold text-trading-text mb-2">No symbols to display</h3>

                <p className="text-trading-text-muted">
                    Add some symbols to your watchlist to see real-time prices
                </p>
            </div>
            );
    }

  return (
    <ScrollArea className="w-full">
        <Table>
            <TableHeader>
                <TableRow className="border-trading-border hover:bg-trading-bg/50">
                    <TableHead className="text-trading-text font-semibold">Symbol</TableHead>
                    <TableHead className="text-trading-text font-semibold text-right">Last Price</TableHead>
                    <TableHead className="text-trading-text font-semibold text-right">Bid</TableHead>
                    <TableHead className="text-trading-text font-semibold text-right">Ask</TableHead>
                    <TableHead className="text-trading-text font-semibold text-right">24h Change</TableHead>
                    <TableHead className="text-trading-text font-semibold text-right">Status</TableHead>
                    {
                        showActions && (
                            <TableHead className="text-trading-text font-semibold text-center">Actions</TableHead>
                            )
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    symbols.map(
                        ( symbol ) =>
                        {
                            const priceData = prices[ symbol.symbol ];
                            const hasPrice = !!priceData;
                            const changePercent = hasPrice ? priceData.priceChangePercent : '0';
                            
                            return (
                                <TableRow 
                                    key={ symbol.symbol }
                                    className="border-trading-border hover:bg-trading-bg/30 transition-colors"
                                >
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-trading-text font-semibold">{ symbol.symbol }</span>
                                            <span className="text-xs text-trading-text-muted">
                                                { symbol.baseAsset }/{ symbol.quoteAsset }
                                            </span>
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell className="text-right">
                                        <span className=
                                            {
                                                getClassNames(
                                                    'font-mono text-sm',
                                                    hasPrice ? 'text-trading-text' : 'text-trading-text-muted'
                                                    )
                                            }
                                        >
                                            { hasPrice ? formatPrice( priceData.lastPrice ) : '---' }
                                        </span>
                                    </TableCell>
                                    
                                    <TableCell className="text-right">
                                        <span className=
                                            {
                                                getClassNames(
                                                    'font-mono text-sm',
                                                    hasPrice ? 'text-trading-text' : 'text-trading-text-muted'
                                                    )
                                            }
                                        >
                                            { hasPrice ? formatPrice( priceData.bidPrice ) : '---' }
                                        </span>
                                    </TableCell>
                                    
                                    <TableCell className="text-right">
                                        <span className=
                                            {
                                                getClassNames(
                                                    'font-mono text-sm',
                                                    hasPrice ? 'text-trading-text' : 'text-trading-text-muted'
                                                    )
                                            }
                                        >
                                            { hasPrice ? formatPrice( priceData.askPrice ) : '---' }
                                        </span>
                                    </TableCell>
                                    
                                    <TableCell className="text-right">
                                        <div className=
                                            {
                                                getClassNames(
                                                    'flex items-center justify-end gap-1 font-mono text-sm',
                                                    hasPrice ? getPriceChangeColor( changePercent ) : 'text-trading-text-muted'
                                                    )
                                            }
                                        >
                                            { hasPrice && getPriceChangeIcon( changePercent ) }
                                            <span>
                                                { hasPrice ? `${ formatPercentage( changePercent ) }%` : '---' }
                                            </span>
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {
                                                isConnected
                                                && hasPrice
                                                && (
                                                    <Badge variant='default' className='text-xs bg-trading-positive/20 text-trading-positive border-trading-positive/30'>
                                                        Live
                                                    </Badge>
                                                    )
                                            }
                                            <Badge 
                                                variant={ symbol.status === 'TRADING' ? 'default' : 'secondary' }
                                                className="text-xs"
                                            >
                                                { symbol.status === 'TRADING' ? 'Active' : symbol.status }
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    
                                    {
                                        showActions && (
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                {
                                                    isSymbolInWatchlist( symbol.symbol )
                                                        ? (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={ () => handleRemoveSymbol( symbol.symbol ) }
                                                                className="gap-1 h-8 px-2 border-trading-negative/30 text-trading-negative hover:bg-trading-negative/10"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                                Remove
                                                            </Button>
                                                            )
                                                        : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={ () => handleAddSymbol( symbol.symbol ) }
                                                                className="gap-1 h-8 px-2 border-primary/30 text-primary hover:bg-primary/10"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                                Add
                                                            </Button>
                                                            )
                                                }
                                                </div>
                                            </TableCell>
                                            )
                                    }
                                </TableRow>
                                );
                        }
                        )
                }
                
            </TableBody>
        </Table>
    </ScrollArea>
    );
};