// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from '@hey-api/client-fetch';
import type { GetHealthData, GetApiData } from './types.gen';
import { client as _heyApiClient } from './client.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
};

export const getHealth = <ThrowOnError extends boolean = false>(options?: Options<GetHealthData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        url: '/health',
        ...options
    });
};

export const getApi = <ThrowOnError extends boolean = false>(options?: Options<GetApiData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        url: '/api',
        ...options
    });
};