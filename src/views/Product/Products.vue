<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="3"
        offset="0"
        offset-md="2"
        md="2"
      >
        <v-card rounded>
          Filter
        </v-card>
      </v-col>
      <v-col
        cols="6"
      >
        <v-sheet border="1">
          <h2 class="text-center">
            Daftar Produk
          </h2>
          <v-row>
            <v-col
              cols="12"
              md="4"
              v-for="(item, index) in products"
              :key="index"
            >
              <v-card rounded>
                {{ item }}
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      <v-col
        cols="2"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { ref } from 'vue'
export default {
	setup() {
		const products = ref<string[]>(['produk1', 'produk2', 'produk3','produk4', 'produk5', 'produk6','produk7', 'produk8', 'produk9','produk10', 'produk11', 'produk12'])
		
		return {
			products
		}
	}
}
</script>