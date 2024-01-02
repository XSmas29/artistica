<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-form ref="addProductForm">
      <v-card flat>
        <v-card-text class="px-0">
          <div class="px-3">
            <v-row>
              <v-col
                cols="12"
                sm="2"
                class="d-flex flex-column justify-center"
              >
                Foto Produk
              </v-col>
              <v-col
                cols="12"
                sm="10"
              >
                <div
                  class="d-flex"
                  style="overflow-x: scroll;"
                >
                  <div
                    v-for="i in 5"
                    :key="i"
                    class="ma-1"
                  >
                    <vue-dropzone
                      ref="productDropzone"
                      width="100"
                      height="100"
                      v-model="product.images[i-1]"
                    />
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="2"
                class="d-flex flex-column justify-center"
              >
                Nama Produk
              </v-col>
              <v-col
                cols="12"
                sm="10"
              >
                <div
                  class="d-flex flex-wrap"
                >
                  <v-text-field
                    v-model="product.name"
                    label="Nama Produk"
                    outlined
                    dense
                    hide-details="auto"
                    :rules="[required]"
                  />
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="2"
                class="d-flex flex-column justify-center"
              >
                Deskripsi Produk
              </v-col>
              <v-col
                cols="12"
                sm="10"
              >
                <div
                  class="d-flex flex-wrap"
                >
                  <v-textarea
                    v-model="product.description"
                    label="Deskripsi Produk"
                    outlined
                    dense
                    hide-details="auto"
                    :rules="[required]"
                  />
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="2"
                class="d-flex flex-column justify-center"
              >
                Kategori
              </v-col>
              <v-col
                cols="12"
                sm="10"
              >
                <div
                  class="d-flex flex-wrap"
                >
                  <v-select
                    v-model="product.category_id"
                    label="Kategori"
                    outlined
                    dense
                    hide-details="auto"
                    :items="categoryList"
                    item-title="name"
                    item-value="id"
                    :loading="loadingCategoryList"
                    :rules="[required]"
                  />
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="2"
                class="d-flex flex-column justify-center"
              >
                Material
              </v-col>
              <v-col
                cols="12"
                sm="10"
              >
                <div
                  class="d-flex flex-wrap"
                >
                  <v-select
                    v-model="product.material_id"
                    label="Material"
                    outlined
                    dense
                    hide-details="auto"
                    :items="materialList"
                    item-title="name"
                    item-value="id"
                    :loading="loadingMaterialList"
                    :rules="[required]"
                  />
                </div>
              </v-col>
            </v-row>
          </div>
          <v-divider class="my-6" />
          <v-card
            variant="flat"
            border
          >
            <v-card-text class="px-0">
              <div class="d-flex flex-wrap align-center justify-space-between px-4">
                <div>
                  <p class="text-h6 font-weight-medium">
                    Varian (Opsional)
                  </p>
                  <p class="text-subtitle-2 font-weight-light">
                    Tambahkan varian produk seperti warna, ukuran, dll. Maksimal 2.
                  </p>
                </div>
                <v-btn
                  color="accent"
                  variant="flat"
                  @click="addVariantAttribute"
                  :disabled="variant_attributes.length >= 2"
                >
                  <v-icon>mdi-plus</v-icon>
                  Tambah Varian
                </v-btn>
              </div>
              
              <div
                v-for="(attr, index) in variant_attributes"
                :key="index"
              >
                <v-divider class="my-4" />
                <v-row class="px-4">
                  <v-col
                    cols="12"
                    md="3"
                  >
                    <v-text-field
                      v-model="attr.name"
                      label="Nama Varian"
                      variant="outlined"
                      dense
                      hide-details="auto"
                      :rules="[required]"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="9"
                  >
                    <div
                      class="d-flex align-center"
                    >
                      <v-combobox
                        v-model:search="cbSearch"
                        v-model="attr.values"
                        :items="attr.values"
                        :hide-no-data="false"
                        label="Opsi / Pilihan"
                        variant="outlined"
                        hide-details="auto"
                        multiple
                        chips
                        persistent-hint
                        clearable
                        :rules="[required]"
                      >
                        <template #no-data>
                          <v-list-item>
                            <v-list-item-title>
                              No results matching "<strong>{{ cbSearch }}</strong>". Press <kbd>enter</kbd> to create a new one
                            </v-list-item-title>
                          </v-list-item>
                        </template>
                      </v-combobox>
                      <v-btn
                        icon
                        flat
                        class="ms-3"
                        @click="variant_attributes.splice(index, 1)"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
          <v-card
            variant="flat"
            border
            class="mt-5"
            v-if="variant_attributes.length > 0"
          >
            <v-card-title>Tabel varian</v-card-title>
            <v-card-text class="pb-0">
              <v-data-table
                :headers="variantTableHeaders"
                :items="variantTableItems"
                fixed-header
                disable-pagination
              >
                <template #bottom />
                <template #[`item.sku`]="{ index }">
                  <v-text-field
                    v-model="variantItems[index].sku"
                    variant="outlined"
                    hide-details
                    :rules="[required]"
                  />
                </template>
                <template #[`item.price`]="{ index }">
                  <v-text-field
                    v-model="variantItems[index].price"
                    variant="outlined"
                    hide-details
                    prefix="IDR"
                    type="number"
                    hide-spin-buttons
                    :rules="[required]"
                  />
                </template>
                <template #[`item.stock`]="{ index }">
                  <v-text-field
                    v-model="variantItems[index].stock"
                    variant="outlined"
                    hide-details
                    type="number"
                    hide-spin-buttons
                    :rules="[required]"
                  />
                </template>
                <template #[`item.image`]="{ index }">
                  <div class="my-2">
                    <vue-dropzone
                      ref="productDropzone"
                      width="64"
                      height="64"
                      v-model="variantItems[index].image"
                    />
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
          <template v-else>
            <div class="px-3 mt-5">
              <v-row>
                <v-col
                  cols="12"
                  sm="2"
                  class="d-flex flex-column justify-center"
                >
                  SKU
                </v-col>
                <v-col
                  cols="12"
                  sm="10"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <v-text-field
                      v-model="variantItems[0].sku"
                      label="SKU"
                      outlined
                      dense
                      hide-details="auto"
                      :rules="[required]"
                    />
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="2"
                  class="d-flex flex-column justify-center"
                >
                  Harga Produk
                </v-col>
                <v-col
                  cols="12"
                  sm="10"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <v-text-field
                      v-model="variantItems[0].price"
                      label="Harga Produk"
                      outlined
                      dense
                      hide-details="auto"
                      type="number"
                      hide-spin-buttons
                      prefix="IDR"
                      :rules="[required]"
                    />
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="2"
                  class="d-flex flex-column justify-center"
                >
                  Stok Produk
                </v-col>
                <v-col
                  cols="12"
                  sm="10"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <v-text-field
                      v-model="variantItems[0].stock"
                      label="Stok"
                      outlined
                      dense
                      hide-details="auto"
                      type="number"
                      hide-spin-buttons
                      :rules="[required]"
                    />
                  </div>
                </v-col>
              </v-row>
            </div>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="success"
            variant="flat"
            @click="addProduct"
            :disabled="loadingCreateProduct"
            :loading="loadingCreateProduct"
          >
            <v-icon class="me-1">
              mdi-floppy
            </v-icon>
            Simpan Produk
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </XyzTransition>
</template>
<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import VueDropzone from '@/components/VueDropzone.vue'
import useMaterial from '@/composables/useMaterial'
import useCategory from '@/composables/useCategory'
import useProduct from '@/composables/useProduct'
import { required } from '@helpers/validations'
import router from '@/router'
import { toast } from '@helpers/utils'

export default {
	components: {
		VueDropzone,
	},
	setup() {
		const { getMaterialList, loadingMaterialList, materialList } = useMaterial()
		const { getCategoryList, loadingCategoryList, categoryList } = useCategory()
		const { createProduct, loadingCreateProduct } = useProduct()
		const addVariantAttribute = () => {
			variant_attributes.value.push({
				name: '',
				values: [],
			})
		}
		const variantTableHeaders = computed(() => {
			let headers = []

			variant_attributes.value.forEach((attr: any) => {
				if (attr.name) {
					headers.push({
						title: attr.name,
						value: attr.name,
					})
				}
			})
			const def = [
				{
					title: 'SKU',
					value: 'sku',
					width: '250',
					minWidth: '125',
				},
				{
					title: 'Harga',
					value: 'price',
					width: '250',
					minWidth: '175',
				},
				{
					title: 'Stok',
					value: 'stock',
					width: '150',
					minWidth: '100'
				},
				{
					title: 'Gambar',
					value: 'image',
					width: '200',
					minWidth: '150'
				},
			]

			headers.push(...def)
			
			return headers
		})

		const variantTableItems = computed(() => {
			let items = [] as any[]
			fillItems(variant_attributes.value, {}, 0, items)

			// variant_attributes.value.forEach((attr: any, index: number) => {
			// 	while (variant_attributes.value[index+1]) {}
			// 		if (attr.name && attr.values) {
          
			// 		// console.log(attr)
			// 		// attr.values.forEach((val: any) => {
			// 		// 	items.push({
			// 		// 		[attr.name]: val,
			// 		// 	})
			// 		// })
			// 		}
			// })
			// eslint-disable-next-line vue/no-side-effects-in-computed-properties
			variantItems.value = items
			
			return items
		})

		const variantItems = ref([{}] as any[])

		const addProductForm = ref(null as any)

		const fillItems = (attrs: any[], obj: any, index: number, items: any[]) => {
			if (index === attrs.length) {
				items.push({ ...obj })
				
				return
			}

			const currentAttribute = attrs[index]
			for (let i = 0; i < currentAttribute.values.length; i++) {
				obj[currentAttribute.name] = currentAttribute.values[i]
				fillItems(attrs, obj, index + 1, items)
			}
		}

		const cbSearch = ref('')
		const variant_attributes = ref([] as any[])
		const product = ref({
			name: '',
			description: '',
			category_id: null as any,
			material_id: null as any,
			images: [] as any[]
		})

		const addProduct = () => {
			addProductForm.value.validate()
			console.log(product.value)
			console.log(variant_attributes.value)
			console.log(variantItems.value)
			if (addProductForm.value.isValid) {
				if (product.value.images.length === 0) {
					toast.error('Foto produk minimal 1')
				}
				else {
					const formattedVariantItems = variantItems.value.map((item: any) => {
						return {
							sku: item.sku,
							price: +item.price,
							stock: +item.stock,
							image: item.image,
						}
					})

					product.value.images = product.value.images.filter((img: any) => img)

					const data = {
						product: product.value,
						attributes: variant_attributes.value,
						variants: formattedVariantItems,
					}
					console.log(data)
					createProduct(data).then(() => {
						router.push({ name: 'admin-products' })
					})
				}
				
			}
		}

		onMounted(() => {
			getMaterialList()
			getCategoryList()
		})

		return {
			addVariantAttribute,
			addProduct,

			product,

			loadingMaterialList,
			materialList,

			loadingCategoryList,
			categoryList,

			variant_attributes,
			cbSearch,

			variantTableHeaders,
			variantTableItems,
			variantItems,

			required,

			addProductForm,

			loadingCreateProduct,
		}
	}
}
</script>