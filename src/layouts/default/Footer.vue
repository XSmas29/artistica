<template>
  <v-footer
    height="175"
    color="primary"
    class="text-center d-flex flex-column mt-4"
  >
    <div class="text-h6 font-weight-bold my-2">
      Tetap Terhubung
    </div>
    <!-- <div>
			Daftarkan alamat email Anda untuk mendapatkan promo, pembaruan produk, dan info lainnya
		</div> -->
    <div>
      Dapatkan Berita terbaru mengenai Artistica Jewelry melalui media sosial kami
    </div>
    <!-- <div class="d-flex my-4">
			<v-responsive width="280">
				<v-text-field variant="filled" density="compact" label="Email" hide-details="auto"></v-text-field>
			</v-responsive>
			<v-btn size="large" color="black">Submit</v-btn>
		</div> -->
    <div class="d-flex justify-center my-2">
      <v-btn
        icon
        class="mx-2"
        target="_blank"
        href="https://www.facebook.com/ArtisticaJewelry"
      >
        <v-icon
          icon="mdi-facebook"
          size="30"
        />
      </v-btn>
      <v-btn
        icon
        class="mx-2"
        target="_blank"
        href="https://www.instagram.com/artisticajewelry"
      >
        <v-icon
          icon="mdi-instagram"
          size="30"
        />
      </v-btn>
    </div>
  </v-footer>
</template>