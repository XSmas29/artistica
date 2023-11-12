<template>
  <v-app-bar
    flat
    color="#EEF0F0"
  >
    <v-col class="col-4" />
    <v-col class="col-4">
      <router-link to="/">
        <div>
          <v-img
            :src="logo"
            max-height="70"
          />
        </div>
      </router-link>
    </v-col>

    <v-col class="col-4">
      <div>
        <div class="d-flex justify-end">
          <v-btn icon>
            <v-icon icon="mdi-cart" />
          </v-btn>
          <v-menu v-if="userData">
            <template #activator="{ props }">
              <v-card
                class="d-flex align-center px-2"
                flat
                v-bind="props"
              >
                <v-icon
                  icon="mdi-account-circle"
                />
                <v-list-item
                  class="px-2"
                  :title="userData.email"
                  :subtitle="userData.first_name"
                />
              </v-card>
            </template>
            <v-list density="compact">
              <router-link
                :to="{ name: 'profile' }"
                style="text-decoration: none; color: inherit;"
              >
                <v-list-item
                  color="primary"
                  key="0"
                  value="0"
                >
                  <template #prepend>
                    <v-icon
                      size="30"
                      icon="mdi-account-circle"
                    />
                  </template>
                  <v-list-item-title>
                    Profile
                  </v-list-item-title>
                </v-list-item>
              </router-link>
              <v-list-item
                color="primary"
                key="1"
                value="1"
              >
                <template #prepend>
                  <v-icon
                    size="30"
                    icon="mdi-logout-variant"
                  />
                </template>
                <v-list-item-title>
                  Logout
                </v-list-item-title>
                <v-dialog
                  v-model="dialogLogout"
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
                        color="primary"
                        @click="dialogLogout = false"
                        text="Batal"
                      />  
                      <v-btn
                        color="error"
                        @click="logout"
                        text="Logout"
                      />  
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item>
            </v-list>
          </v-menu>
          <router-link
            v-else
            :to="{ name: 'login' }"
            style="color: inherit"
          >
            <v-btn icon>
              <v-icon icon="mdi-account-circle" />
            </v-btn>
          </router-link>
        </div>
      </div>
    </v-col>

    <!-- <template #prepend>
      <v-icon icon="mdi-magnifying-glass"></v-icon>
    </template> -->
    
    <template #extension>
      <v-tabs
        align-tabs="center"
        grow
        show-arrows
      >
        <v-tab>BEST SELLER</v-tab>
        <v-tab>SHOP</v-tab>
        <v-tab>ABOUT US</v-tab>
        <v-tab>CUSTOM MANUFACTURE</v-tab>
        <v-tab>WEDDING RING CUSTOM</v-tab>
        <v-tab>SILVER COURSE</v-tab>
        <v-tab>SUPPORT</v-tab>
        <v-tab>SUPPORT SILVERSMITH</v-tab>
        <v-tab>BLOG</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import useUser from '@/composables/useUser'
import router from '@/router'
export default {
	setup() {
		const logo = ref(new URL('@assets/logo_main.png', import.meta.url).href)
		const authStore = useAuthStore()
		const { userData, isLoggedIn } = storeToRefs(authStore)
		const {signOut, loadingLogout} = useUser()

		const dialogLogout = ref(false)

		const logout = async () => {
			await signOut().then(() => {
				router.push({ name: 'home' })
			})
		}
		
		return {
			userData,
			isLoggedIn,
			logo,
			logout,
			loadingLogout,
			dialogLogout,
		}
	},
}
</script>
