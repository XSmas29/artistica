import { ApolloClient, from, InMemoryCache } from '@apollo/client/core'
import VueApollo from 'vue-apollo'
import { jwtDecode } from 'jwt-decode'
import useUser from '@composables/useUser'
import { setContext } from '@apollo/client/link/context'
import { createUploadLink } from 'apollo-upload-client'

// HTTP connection to the API
const httpLink = createUploadLink({
	// You should use an absolute URL here
	uri: import.meta.env.VITE_GRAPHQL_HTTP_URL,
	headers: {
		'Apollo-Require-Preflight': 'true',
	},
})

// const authMiddleware = new ApolloLink((operation, forward) => {
// 	// add the authorization to the headers
// 	operation.setContext(({ headers = {} }) => {
// 		if (localStorage.getItem('token')) {
			
// 			const currToken = jwtDecode(localStorage.getItem('token') || '') as any
// 			console.log(Date.now())
// 			if (currToken.exp * 1000 < Date.now()) {
// 				const { refreshAuthToken } = useUser()
// 				console.log('expired')
// 				console.log(localStorage.getItem('refresh_token'))
// 				refreshAuthToken(localStorage.getItem('refresh_token') || '').then((data: any) => {
// 					console.log(data)
// 				})
// 			}
// 			console.log(currToken)
// 			console.log(jwtDecode(localStorage.getItem('token') || '') as any)
// 		}

// 		return {
// 			headers: {
// 				...headers,
// 				authorization: localStorage.getItem('token') || null,
// 				test: 'test',
// 			}
// 		}
// 	})

// 	return forward(operation)
// })

const authMiddleware = setContext(async (_, { headers }) => {
	if (localStorage.getItem('token')) {
		const currToken = jwtDecode(localStorage.getItem('token') || '') as any

		if (currToken.exp * 1000 < Date.now()) {
			const { refreshAuthToken } = useUser()
			await refreshAuthToken(localStorage.getItem('refresh_token') || '')
		}
	}

	return {
		headers: {
			...headers,
			authorization: localStorage.getItem('token') || null,
			test: 'test',
		}
	}
})

// Create the apollo client
export const apolloClient = new ApolloClient({
	link: from([authMiddleware, httpLink]),
	cache: new InMemoryCache(),
})

export const apolloProvider = new VueApollo({
	defaultClient: apolloClient,
})
