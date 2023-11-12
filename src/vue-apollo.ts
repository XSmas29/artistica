import { ApolloClient, ApolloLink, createHttpLink, from, InMemoryCache } from '@apollo/client/core'
import VueApollo from 'vue-apollo'

// HTTP connection to the API
const httpLink = createHttpLink({
	// You should use an absolute URL here
	uri: import.meta.env.VITE_GRAPHQL_HTTP_URL,
})

const authMiddleware = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	operation.setContext(({ headers = {} }) => ({
		headers: {
			...headers,
			authorization: localStorage.getItem('token') || null,
		}
	}))

	return forward(operation)
})

// Create the apollo client
export const apolloClient = new ApolloClient({
	link: from([authMiddleware, httpLink]),
	cache: new InMemoryCache(),
})

export const apolloProvider = new VueApollo({
	defaultClient: apolloClient,
})
