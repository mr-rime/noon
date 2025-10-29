import { ApolloClient, InMemoryCache, from, ApolloLink } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
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

const uploadLink = createUploadLink({
  uri: graphqlUri,
  credentials: 'include',
})

// batch non-upload graphQL operations to reduce request overhead and latency
const batchLink = new BatchHttpLink({
  uri: graphqlUri,
  credentials: 'include',
  batchInterval: 15,
  batchMax: 15,
})

// route multipart uploads to uploadLink everything else to batchLink
const splitLink = ApolloLink.split(
  (operation) => {
    const context = operation.getContext()
    const headers = context.headers || {}
    const contentType: string | undefined = headers['content-type'] || headers['Content-Type']
    return typeof contentType === 'string' && contentType.includes('multipart/form-data')
  },
  uploadLink as unknown as ApolloLink,
  batchLink as unknown as ApolloLink
)

export const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: from([errorLink, splitLink]),
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
})