// -- TYPES

export class ApplicationSettings
{
    // -- ATTRIBUTES

    public static readonly API_URL = 'https://api.binance.com/api/v3';
    public static readonly WEBSOCKET_BASE_URL = 'wss://stream.binance.com:9443/ws';

    static readonly ENDPOINTS =
        {
            EXCHANGE_INFO: '/exchangeInfo',
            TICKER_PRICE: '/ticker/price',
            TICKER_24HR: '/ticker/24hr',
        };
}