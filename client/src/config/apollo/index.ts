import { ApolloClient, InMemoryCache } from '@apollo/client'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'

const isDashboard = typeof window !== 'undefined' && window.location.hostname === 'dashboard.localhost'

const graphqlUri = isDashboard
  ? 'https://noon-btwv.onrender.com/graphql'
  : 'http://localhost:8000/graphql'

export const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: createUploadLink({
    uri: graphqlUri,
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
})