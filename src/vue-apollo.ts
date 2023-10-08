import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import VueApollo from 'vue-apollo'
// HTTP connection to the API

const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: import.meta.env.VITE_GRAPHQL_HTTP_URL,
})


// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
