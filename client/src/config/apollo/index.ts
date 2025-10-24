import { ApolloClient, InMemoryCache } from '@apollo/client'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'


const graphqlUri = 'https://noon-btwv.onrender.com/graphql'


export const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: createUploadLink({
    uri: graphqlUri,
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
})