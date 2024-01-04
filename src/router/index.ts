// Composables
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { MyRouteRecord } from './types'
import useUser from '@/composables/useUser'
import { aboutBreadcrumb, cartBreadcrumb, homeBreadCrumb, loginBreadcrumb, productDetailBreadcrumb, productListBreadcrumb, profileBreadcrumb, purchaseInfoBreadcrumb, registerBreadcrumb, verifyBreadcrumb } from './breadcrumbs'

const routes: MyRouteRecord[] = [
	{
		path: '',
		component: () => import('@/layouts/default/Default.vue'),
		children: [
			{
				path: '',
				name: 'home',
				meta: {
					pageTitle: 'Home',
					public: true,
					breadcrumbs: [homeBreadCrumb],
				},
				component: () => import('@views/Home.vue'),
			},
			{
				path: '/register',
				name: 'register',
				meta: {
					pageTitle: 'Register',
					public: true,
					breadcrumbs: [
						homeBreadCrumb,
						registerBreadcrumb,
					],
				},
				component: () => import('@views/Register.vue'),
			},
			{
				path: '/verify',
				name: 'verify',
				meta: {
					pageTitle: 'Verify',
					public: true,
					breadcrumbs: [
						homeBreadCrumb,
						verifyBreadcrumb,
					],
				},
				component: () => import('@views/Register2.vue'),
			},
			{
				path: '/login',
				name: 'login',
				meta: {
					pageTitle: 'Login',
					public: true,
					breadcrumbs: [
						homeBreadCrumb,
						loginBreadcrumb,
					],
				},
				component: () => import('@views/Login.vue'),
			},
			{
				path: '/profile',
				name: 'profile',
				meta: {
					pageTitle: 'Profil',
					public: false,
					user: true,
					breadcrumbs: [
						homeBreadCrumb,
						profileBreadcrumb,
					],
				},
				component: () => import('@views/Profile.vue'),
			},
			{
				path: '/about',
				name: 'about',
				meta: {
					pageTitle: 'Home',
					public: true,
					breadcrumbs: [homeBreadCrumb, aboutBreadcrumb],
				},
				component: () => import('@views/About.vue'),
			},
			{
				path: '/products',
				name: 'products',
				meta: {
					pageTitle: 'Daftar Produk',
					public: true,
					breadcrumbs: [
						homeBreadCrumb,
						productListBreadcrumb,
					],
				},
				component: () => import('@views/Product/Products.vue'),
			},
			{
				path: '/products/:id',
				name: 'product-detail',
				meta: {
					pageTitle: 'Detail Produk',
					public: true,
					breadcrumbs: [
						homeBreadCrumb,
						productListBreadcrumb,
						productDetailBreadcrumb,
					],
				},
				component: () => import('@views/Product/ProductDetail.vue'),
			},
			{
				path: '/cart',
				name: 'cart',
				meta: {
					pageTitle: 'Keranjang Belanja',
					public: false,
					user: true,
					breadcrumbs: [
						homeBreadCrumb,
						cartBreadcrumb,
					],
				},
				component: () => import('@views/Transaction/Cart.vue'),
			},
			{
				path: '/purchase-information',
				name: 'purchase-information',
				meta: {
					pageTitle: 'Informasi Pembelian',
					public: false,
					user: true,
					breadcrumbs: [
						homeBreadCrumb,
						cartBreadcrumb,
						purchaseInfoBreadcrumb,
					],
				},
				component: () => import('@views/Transaction/PurchaseInformation.vue'),
			}
		],
	},
	{
		path: '/admin',
		meta: {
			pageTitle: 'Informasi Pembelian',
			public: false,
			admin: true,
		},
		component: () => import('@/layouts/admin/Admin.vue'),
		children: [
			{
				path: '/admin/dashboard',
				name: 'admin-dashboard',
				meta: {
					pageTitle: 'Dashboard',
					public: false,
					admin: true,
				},
				component: () => import('@/views/Admin/Dashboard.vue'),
			},
			{
				path: '/admin/users',
				name: 'admin-users',
				meta: {
					pageTitle: 'Pengguna',
					public: false,
					admin: true,
				},
				component: () => import('@/views/Admin/Users.vue'),
			},
			{
				path: '/admin/products',
				name: 'admin-products',
				meta: {
					pageTitle: 'Produk',
					public: false,
					admin: true,
				},
				component: () => import('@views/Admin/Product/Products.vue'),
			},
			{
				path: '/admin/products/add',
				name: 'admin-product-add',
				meta: {
					pageTitle: 'Tambah Produk',
					public: false,
					admin: true,
				},
				component: () => import('@/views/Admin/Product/AddProduct.vue'),
			},
			{
				path: '/admin/products/:id/edit',
				name: 'admin-product-edit',
				meta: {
					pageTitle: 'Edit Produk',
					public: false,
					admin: true,
				},
				component: () => import('@/views/Admin/Product/EditProduct.vue'),
			},
			{
				path: '/admin/categories',
				name: 'admin-categories',
				meta: {
					pageTitle: 'Kategori',
					public: false,
					admin: true,
				},
				component: () => import('@/views/Admin/Categories.vue'),
			},
			{
				path: '/admin/materials',
				name: 'admin-materials',
				meta: {
					pageTitle: 'Material',
					public: false,
					admin: true,
				},
				component: () => import('@/views/Admin/Materials.vue'),
			},
			{
				path: '/admin/transactions',
				name: 'admin-transactions',
				meta: {
					pageTitle: 'Transaksi',
					public: false,
					admin: true,
				},
				component: () => import('@/views/Admin/Transactions.vue'),
			},
		]
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes: routes as RouteRecordRaw[],
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
		const {getProfileInfo} = useUser()
		const userData = await getProfileInfo()
		
		if (to.name === 'login' || to.name === 'register') return next({ name: 'home' })
		if (userData.is_admin && !to.meta.admin) return next({ name: 'admin-dashboard' })
	}

	// else if (to.meta.public) {
	// 	return next()
	// }

	return next()
})

router.afterEach(async () => {
	// const hasToken = localStorage.getItem('token')
	// if (hasToken) {
	// 	const {getProfileInfo} = useUser()
	// 	await getProfileInfo()
	// }
})

export default router
