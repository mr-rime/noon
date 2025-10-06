import { ApolloClient, InMemoryCache } from '@apollo/client'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'

const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: createUploadLink({
    uri: typeof window !== 'undefined' && window.location.hostname === 'dashboard.localhost'
      ? 'http://dashboard.localhost:8000/graphql'
      : 'http://localhost:8000/graphql',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
})

export default client
