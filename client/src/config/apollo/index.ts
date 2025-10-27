import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { errorLink } from './error-link'

const getGraphqlUri = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname

    if (hostname === 'noon-market.vercel.app') {
      return 'https://noon-btwv.onrender.com/graphql'
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

export const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: from([errorLink, uploadLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})