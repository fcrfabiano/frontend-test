// -- TYPES

export interface BinanceSymbol
    {
        symbol: string;
        status: string;
        baseAsset: string;
        baseAssetPrecision: number;
        quoteAsset: string;
        quotePrecision: number;
        orderTypes: string[];
        icebergAllowed: boolean;
        ocoAllowed: boolean;
        isSpotTradingAllowed: boolean;
        isMarginTradingAllowed: boolean;
    }
  
export interface ExchangeInfo
    {
        timezone: string;
        serverTime: number;
        symbols: BinanceSymbol[];
    }
  
export interface TickerData
    {
        e: string; // Event type
        E: number; // Event time
        s: string; // Symbol
        c: string; // Close price (last price)
        o: string; // Open price
        h: string; // High price
        l: string; // Low price
        v: string; // Total traded base asset volume
        q: string; // Total traded quote asset volume
        O: number; // Statistics open time
        C: number; // Statistics close time
        F: number; // First trade ID
        L: number; // Last trade id
        n: number; // Total number of trades
        x: string; // Previous day's close price
        P: string; // Price change percent
        p: string; // Price change
        Q: string; // Last quantity
        B: string; // Best bid quantity
        b: string; // Best bid price
        A: string; // Best ask quantity
        a: string; // Best ask price
    }
  
export interface WebSocketMessage
    {
        stream: string;
        data: TickerData;
    }
  
export interface PriceData
    {
        symbol: string;
        lastPrice: string;
        bidPrice: string;
        askPrice: string;
        priceChange: string;
        priceChangePercent: string;
        volume: string;
        lastUpdated: number;
    }
  
export interface WatchlistState
    {
        symbols: string[];
        prices: Record<string, PriceData>;
        isConnected: boolean;
        error: string | null;
    }
  
export interface TradingContextType
    {
        allSymbols: BinanceSymbol[];
        isLoadingSymbols: boolean;
        symbolsError: string | null;
        
        watchlist: WatchlistState;
        addToWatchlist: (symbol: string) => void;
        removeFromWatchlist: (symbol: string) => void;
        clearWatchlist: () => void;
        
        connectWebSocket: () => void;
        disconnectWebSocket: () => void;
        
        refreshData: () => void;
    }