// -- IMPORTS

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// -- FUNCTIONS

export function getClassNames(
    ...inputs: ClassValue[]
    )
{
    return twMerge( clsx( inputs ) );
}

// ~~


export function formatPrice(
    price: string
    )
{
    const num = parseFloat( price );

    if ( num === 0 ) return '0.00';
    
    if ( num >= 1 )
    {
        return num.toLocaleString(
            'en-US',
            { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            }
            );
    }
    else
    {
        return num.toLocaleString(
            'en-US',
            { 
                minimumFractionDigits: 4, 
                maximumFractionDigits: 8 
            }
            );
    }
};

// ~~

export function formatPercentage(
    percentage: string
    )
{
    const num = parseFloat( percentage );

    return num.toFixed( 2 );
};

// ~~

export function getPriceChangeColor(
    percentage: string
    )
{
    const num = parseFloat( percentage );

    if ( num > 0 ) return 'text-trading-positive';
    if ( num < 0 ) return 'text-trading-negative';

    return 'text-trading-neutral';
};