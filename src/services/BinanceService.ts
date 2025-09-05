// -- IMPORTS

import { ApplicationSettings } from '@/config/ApplicationSettings';
import { HttpClient } from '@/lib/HttpClient';
import { ExchangeInfo, BinanceSymbol } from '@/types/Trading';

// -- TYPES

export class BinanceService
{
    // -- INQUIRIES

    static async getExchangeInfo(
        ): Promise<ExchangeInfo>
    {
        return HttpClient.get<ExchangeInfo>( ApplicationSettings.ENDPOINTS.EXCHANGE_INFO );
    }

    // ~~

    static async getActiveSymbols(
        ): Promise<BinanceSymbol[]>
    {
        const exchangeInfo = await this.getExchangeInfo();
        
        return exchangeInfo.symbols.filter(
            symbol => symbol.status === 'TRADING' && symbol.isSpotTradingAllowed
            );
    }

    // ~~

    static async getSymbolPrice(
        symbol: string
        ): Promise<{ symbol: string; price: string }>
    {
        return HttpClient.get<{ symbol: string; price: string }>( ApplicationSettings.ENDPOINTS.TICKER_PRICE + `?symbol=${ symbol }` );
    }

    // ~~

    static async get24hrTicker(
        symbol?: string
        )
    {
        const resource = symbol
            ? `${ApplicationSettings.ENDPOINTS.TICKER_24HR}?symbol=${ symbol }`
            : ApplicationSettings.ENDPOINTS.TICKER_24HR;

        return HttpClient.get( resource );
    }

    // ~~

    static buildWebSocketUrl(
        symbols: string[]
        ): string | null
    {
        const symbolCount = symbols.length;

        if ( symbolCount === 0 ) return null;
        
        const streams = symbols.map( symbol => `${ symbol.toLowerCase() }@ticker` ).join( '/' );

        return `${ ApplicationSettings.WEBSOCKET_BASE_URL }/${ streams }`;
    }
}