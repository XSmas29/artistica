<template>
  <v-app-bar flat color="#F4F4F4">
    <v-col class="col-4"></v-col>
    <v-col class="col-4"><v-img :src="logo" /></v-col>
    <v-col class="col-4">
      <div>
        <div class="d-flex justify-end">
          <v-btn icon>
            <fa-icon icon="fa-cart-shopping"></fa-icon>
          </v-btn>
          <v-btn icon>
            <fa-icon icon="fa-user"></fa-icon>
          </v-btn>
        </div>
      </div>
    </v-col>

    <!-- <template #prepend>
      <fa-icon icon="fa-magnifying-glass"></fa-icon>
    </template> -->

    <template #extension>
      <v-tabs align-tabs="center" grow hide-slider>
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

<script lang="ts" >
export default {
  computed: {
    logo() {
      return new URL('@assets/logo_main.png', import.meta.url).href;
    }
  }
};

</script>
