// -- IMPORT

import { ApplicationSettings } from './application_settings';

// -- TYPES

export class HttpClient
{
    // -- INQUIRIES

    private static getHeaders(
        contentType: null | string = 'application/json'
        )
    {
        const headerMap: Record<string, string> = {};

        if ( contentType !== null )
        {
            headerMap[ 'Content-Type' ] = contentType;
        }

        return headerMap;
    }

    // ~~

    static async get<TResult>(
        resource: string
        ): Promise<TResult>
    {
        const headerMap = HttpClient.getHeaders();
        const requestOptionMap: RequestInit =
            {
                method: 'GET',
                redirect: 'follow',
                headers: headerMap
            };

        const url = ApplicationSettings.API_URL + resource;

        try
        {
            const response = await fetch( url, requestOptionMap );

            if ( !response.ok )
            {
                return Promise.reject( response.json() );
            }

            return Promise.resolve( response.json() );
        }
        catch( error )
        {
            return Promise.reject( error );
        }
    }
}

