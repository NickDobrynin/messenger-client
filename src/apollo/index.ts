import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import {getMainDefinition} from '@apollo/client/utilities';

const httpLink = createHttpLink({
  uri: 'https://messenger-server-production.up.railway.app/graphql',
});
const wsLink = new WebSocketLink(new SubscriptionClient('wss://messenger-server-production.up.railway.app/graphql/subscription'));
const splitLink = split(({query}) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  );
}, wsLink, httpLink);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export default new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});