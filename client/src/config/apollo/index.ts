import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { errorLink } from './error-link'

const getGraphqlUri = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname

    if (hostname === 'noon-market.vercel.app') {
      return 'https://noon-btwv.onrender.com/graphql'
    }

    if (hostname === 'dashboard.localhost') {
      return 'http://dashboard.localhost:8000/graphql'
    }

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000/graphql'
    }
  }

  return 'http://localhost:8000/graphql'
}

const graphqlUri = getGraphqlUri()

const batchLink = new BatchHttpLink({
  uri: graphqlUri,
  credentials: 'include',
  batchInterval: 15,
  batchMax: 15,
});

export const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: from([errorLink, batchLink]),
  cache: new InMemoryCache({
    resultCaching: true,
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  queryDeduplication: true,
});