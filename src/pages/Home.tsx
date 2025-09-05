// -- IMPORTS

import { TradingDashboard } from '@/components/TradingDashboard';
import { TradingProvider } from '@/context/TradingContext';

// -- FUNCTIONS

export default function Home(
    )
{
    return (
        <TradingProvider>
            <div className="dark">
                <TradingDashboard/>
            </div>
        </TradingProvider>
        );
}