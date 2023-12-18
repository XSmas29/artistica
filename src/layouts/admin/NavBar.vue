<template>
  <v-navigation-drawer
    permanent
    :rail="smAndDown"
  >
    <template #prepend>
      <v-list-item
        class="my-1"
        lines="one"
        prepend-icon="mdi-account-circle"
        size
        :title="userData.first_name"
      />
    </template>
    <v-divider />
    <v-list
      nav
    >
      <v-list-item
        v-for="(item, i) in drawerItems"
        :key="i"
        :title="item.title"
        :value="item.value"
        :prepend-icon="item.icon"
        :to="item.link"
      />
    </v-list>
    <template #append>
      <div class="pa-2">
        <v-btn
          block
          lines="one"
          prepend-icon="mdi-logout"
          flat
          color="error"
          @click="dialogLogout = true"
        >
          Logout
        </v-btn>
      </div>
    </template>
    <v-dialog
      v-model="dialogLogout"
      persistent
      activator="parent"
      width="auto"
    >
      <v-card
        title="Logout"
      >
        <v-card-text>
          Yakin ingin logout?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="dialogLogout = false"
            text="Batal"
          />  
          <v-btn
            color="error"
            @click="logout"
            :loading="loadingLogout"
            text="Logout"
          />  
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>
<script lang="ts">
import { useAuthStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import useUser from '@composables/useUser'
import router from '@/router'

export default {
	setup() {
		const { smAndDown } = useDisplay()
		const { userData } = storeToRefs(useAuthStore())
		const selectedItem = ref('dashboard')
		const drawerItems = ref([
			{
				title: 'Dashboard',
				value: 'dashboard',
				icon: 'mdi-view-dashboard',
				link: '/admin/dashboard',
			},
			{
				title: 'Pengguna',
				value: 'users',
				icon: 'mdi-account-group-outline',
				link: '/admin/users',
			},
			{
				title: 'Produk',
				value: 'products',
				icon: 'mdi-package-variant-closed',
				link: '/admin/products',
			},
			{
				title: 'Kategori',
				value: 'categories',
				icon: 'mdi-format-list-bulleted',
				link: '/admin/categories',
			},
			{
				title: 'Material',
				value: 'materials',
				icon: 'mdi-atom-variant',
				link: '/admin/materials',
			},
			{
				title: 'Transaksi',
				value: 'transactions',
				icon: 'mdi-cart',
				link: '/admin/transactions',
			},
		])
		
		const {signOut, loadingLogout } = useUser()
		const dialogLogout = ref(false)

		const logout = () => {
			signOut().then(() => {
				router.push({ name: 'home' }).then(() => {
					location.reload()
				})
			})
		}
		
		return {
			userData,
			selectedItem,
			drawerItems,
			smAndDown,

			dialogLogout,
			loadingLogout,
			logout,
		}
	},
}
</script>