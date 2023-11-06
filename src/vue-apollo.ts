import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import VueApollo from 'vue-apollo'

// HTTP connection to the API
const token = localStorage.getItem('token')
console.log('token di vue-apollo:', token)
const httpLink = createHttpLink({
	// You should use an absolute URL here
	uri: import.meta.env.VITE_GRAPHQL_HTTP_URL,
	headers: {
		Authorization: token ? token : '',
	}
})

// Create the apollo client
export const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
})

export const apolloProvider = new VueApollo({
	defaultClient: apolloClient,
})
