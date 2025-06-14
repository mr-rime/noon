import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://d8df-156-203-223-112.ngrok-free.app/graphql',
    cache: new InMemoryCache(),
    credentials: 'include'
});

export default client;