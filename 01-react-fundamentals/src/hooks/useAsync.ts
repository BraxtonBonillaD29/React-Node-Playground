import { useState, useCallback } from 'react';

/**
 * Discriminated Union for Async State
 * This prevents impossible states (e.g., being "success" but having an "error").
 */
type AsyncState<T> =
    | { status: 'idle'; data: null; error: null }
    | { status: 'pending'; data: null; error: null }
    | { status: 'success'; data: T; error: null }
    | { status: 'error'; data: null; error: string };

export function useAsync<T>() {
    const [state, setState] = useState<AsyncState<T>>({
        status: 'idle',
        data: null,
        error: null,
    });

    const run = useCallback(async (promise: Promise<T>) => {
        setState({ status: 'pending', data: null, error: null });
        try {
            const data = await promise;
            setState({ status: 'success', data, error: null });
        } catch (error) {
            setState({
                status: 'error',
                data: null,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }, []);

    return { ...state, run };
}
