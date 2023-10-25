// Composables
import { createRouter, createWebHistory } from 'vue-router';

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
				component: () => import('@views/Home.vue'),
			},
			{
				path: '/register',
				name: 'register',
				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				component: () => import('@views/Register.vue'),
			},
			{
				path: '/verify',
				name: 'verify',
				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				component: () => import('@views/Register2.vue'),
			},
			{
				path: '/login',
				name: 'login',
				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
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
});

export default router;
