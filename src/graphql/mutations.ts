import register from '@/graphql/mutation/register'
import verifyUser from '@/graphql/mutation/verifyUser'
import login from '@/graphql/mutation/login'
import editPassword from '@/graphql/mutation/editPassword'
import editProfile from '@/graphql/mutation/editProfile'
import addProduct from '@/graphql/mutation/addProduct'
import deleteProduct from '@/graphql/mutation/deleteProduct'
import updateProduct from '@/graphql/mutation/updateProduct'
import addCategory from '@/graphql/mutation/addCategory'
import deleteCategory from '@/graphql/mutation/deleteCategory'
import updateCategory from './mutation/updateCategory'
import addMaterial from './mutation/addMaterial'
import deleteMaterial from './mutation/deleteMaterial'
import updateMaterial from './mutation/updateMaterial'

export {
	register,
	verifyUser,
	login,
	editPassword,
	editProfile,
	addProduct,
	deleteProduct,
	updateProduct,
	addCategory,
	deleteCategory,
	updateCategory,
	addMaterial,
	deleteMaterial,
	updateMaterial,
}