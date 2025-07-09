import type { PageContextServer } from 'vike/types';

export default function queryClientConfig(pageContext: PageContextServer) {
  return {
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 2,
      },
    },
  };
}