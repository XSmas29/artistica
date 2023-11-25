// Composables
import { createRouter, createWebHistory } from 'vue-router'
import useUser from '@/composables/useUser'
const routes = [
	{
		path: '',
		component: () => import('@/layouts/default/Default.vue'),
		children: [
			{
				path: '',
				name: 'home',

				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				meta: {
					pageTitle: 'Home',
					public: true,
				},
				component: () => import('@views/Home.vue'),
			},
			{
				path: '/register',
				name: 'register',

				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				meta: {
					pageTitle: 'Register',
					public: true,
				},
				component: () => import('@views/Register.vue'),
			},
			{
				path: '/verify',
				name: 'verify',

				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				meta: {
					pageTitle: 'Verify',
					public: true,
				},
				component: () => import('@views/Register2.vue'),
			},
			{
				path: '/login',
				name: 'login',

				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				meta: {
					pageTitle: 'Login',
					public: true,
				},
				component: () => import('@views/Login.vue'),
			},
			{
				path: '/profile',
				name: 'profile',

				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				meta: {
					pageTitle: 'Profil',
					public: false,
					user: true,
				},
				component: () => import('@views/Profile.vue'),
			},
			{
				path: '/products',
				name: 'products',

				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				meta: {
					pageTitle: 'Daftar Produk',
					public: true,
				},
				component: () => import('@views/Product/Products.vue'),
			},
		],
	},

	// {
	// 	path: '/register',
	// 	component: () => import('@/layouts/default/Default.vue'),
	// 	children: [
	// 		{
	// 			path: '',
	// 			name: 'Home',
	// 			// route level code-splitting
	// 			// this generates a separate chunk (about.[hash].js) for this route
	// 			// which is lazy-loaded when the route is visited.
	// 			component: () => import(/* webpackChunkName: "home" */ '@/views/home-page.vue'),
	// 		},
	// 	],
	// },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (to.hash) {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve({ el: to.hash })
				}, 600)
			})
		}

		return new Promise(resolve => {
			setTimeout(() => {
				resolve({ left: savedPosition ? savedPosition.left : 0, top: savedPosition ? savedPosition.top : 0, behavior: 'smooth' })
			}, 500)
		})
	},
})

router.beforeEach(async (to, from, next) => {
	window.document.title = to.meta && to.meta.pageTitle
		? `${to.meta.pageTitle} | Artistica Jewelry`
		: 'Artistica Jewelry'

	const hasToken = localStorage.getItem('token')
	if (!hasToken && !to.meta.public) return next({ name: 'login' })
	if (hasToken) {
		if (to.name === 'login' || to.name === 'register') return next({ name: 'home' })
	}

	// else if (to.meta.public) {
	// 	return next()
	// }

	return next()
})

router.afterEach(async () => {
	const hasToken = localStorage.getItem('token')
	if (hasToken) {
		const {getProfileInfo} = useUser()
		await getProfileInfo()
	}
})

export default router
