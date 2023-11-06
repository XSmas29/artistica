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
            <fa-icon icon="fa-cart-shopping" />
          </v-btn>
          <v-menu v-if="userData">
            <template #activator="{ props }">
              <v-card
                class="d-flex align-center px-2"
                flat
                v-bind="props"
              >
                <fa-icon
                  icon="fa-user"
                  class="ms-1"
                />
                <v-list-item
                  class="pe-1 ps-3"
                  :title="userData.email"
                  :subtitle="userData.first_name"
                />
              </v-card>
            </template>
            <v-list density="compact">
              <router-link
                :to="{ name: 'profile' }"
                style="color: inherit"
              >
                <v-list-item color="primary">
                  <template #prepend>
                    <fa-icon
                      icon="fa-user"
                      class="me-3"
                    />
                  </template>
                  <v-list-item-title>Profile</v-list-item-title>
                </v-list-item>
              </router-link>
            </v-list>
          </v-menu>
          <router-link
            v-else
            :to="{ name: 'login' }"
            style="color: inherit"
          >
            <v-btn icon>
              <fa-icon icon="fa-user" />
            </v-btn>
          </router-link>
        </div>
      </div>
    </v-col>

    <!-- <template #prepend>
      <fa-icon icon="fa-magnifying-glass"></fa-icon>
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

export default {
	setup() {
		const logo = ref(new URL('@assets/logo_main.png', import.meta.url).href)
		const { userData } = useAuthStore()

		return {
			userData,
			logo,
		}
	},
}
</script>
