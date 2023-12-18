<template>
  <v-app-bar
    flat
    color="primary"
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
          <router-link
            :to="{ name: 'cart' }"
            style="color: inherit"
          >
            <v-btn
              icon
              v-if="isLoggedIn"
              class="mx-4"
            >
              <v-badge
                color="error"
                :content="cartData.length > 99 ? '99+' : cartData.length"
                v-if="cartData.length > 0"
              >
                <v-icon icon="mdi-cart" />
              </v-badge>
              <v-icon
                v-else
                icon="mdi-cart"
              />
              <v-tooltip
                activator="parent"
                location="bottom"
              >
                Keranjang
              </v-tooltip>
            </v-btn>
          </router-link>
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
                <v-tooltip
                  activator="parent"
                  location="bottom"
                >
                  Pengguna
                </v-tooltip>
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
              </v-list-item>
            </v-list>
          </v-menu>
          <router-link
            v-else
            :to="{ name: 'login' }"
            style="color: inherit"
          >
            <v-tooltip
              activator="parent"
              location="bottom"
            >
              Login
            </v-tooltip>
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
        v-model="currentTab"
        hide-slider
        align-tabs="center"
        grow
        show-arrows
      >
        <v-tab
          :value="1"
          @click="goTo('home')"
          text="Home"
        />
        <v-tab
          :value="2" 
          @click="goTo('products')"
          text="Shop"
        />
        <v-tab
          :value="3"
          text="About Us"
          @click="goTo('about')"
        />
        <v-tab 
          :value="4"
          text="Custom Manufacture"
          @click="goTo('custom-manufacture')"
        />
        <v-tab
          :value="5"
          text="Silver Course"
        />
        <v-tab 
          :value="6"
          text="Support"
        />
        <v-tab 
          :value="7"
          text="Support Silversmith"
        />
        <v-tab 
          :value="8"
          text="Blog"
        />
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useAuthStore, usePageStore, useCartStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import useUser from '@/composables/useUser'
import router from '@/router'
export default {
	setup() {
		const logo = ref(new URL('@assets/logo_main.png', import.meta.url).href)
		const  { userData, isLoggedIn }  = storeToRefs(useAuthStore())
		const  { cartData }  = storeToRefs(useCartStore())
		const { currentTab } = storeToRefs(usePageStore())

		const {signOut, loadingLogout } = useUser()
		const dialogLogout = ref(false)

		const logout = () => {
			signOut().then(() => {
				router.push({ name: 'home' }).then(() => {
					location.reload()
				})
			})
		}
    
		const goTo = (name: string) => {
			router.push({ name })
		}
		
		return {
			userData,
			isLoggedIn,
			logo,
			loadingLogout,
			dialogLogout,
			currentTab,
			cartData,
      
			goTo,
			logout,
		}
	},
}
</script>
