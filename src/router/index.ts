// Composables
import { createRouter, createWebHistory } from 'vue-router';
import useUser from '@/composables/useUser';
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
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
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
});

router.beforeEach(async (to, from, next) => {
	window.document.title = to.meta && to.meta.pageTitle
    ? `${to.meta.pageTitle} | Artistica Jewelry`
    : 'Artistica Jewelry'

	// if (to.name === 'login' || to.name === 'register') {
	// 	const hasToken = localStorage.getItem('token')
	// 	if (hasToken) return next({ name: 'home' })
	// }

	const hasToken = localStorage.getItem('token')
	if (!hasToken && !to.meta.public) return next({ name: 'login' })
	else {
		const {getProfileInfo} = useUser()
		try {
			console.log(hasToken)
			await getProfileInfo()
		} catch {
			console.log('get profile error')
			// localStorage.removeItem('token')
			return next()
		}
	}
	
	if (to.meta.public) {
		return next()
	}

	return next()
})

export default router;
