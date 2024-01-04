<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-form ref="editProductForm">
      <v-card
        flat
        :loading="loadingProductDetail"
      >
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
                        @update:model-value="reloadVariantItems"
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
                        @click="removeVariantAttribute(index)"
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
          >
            <v-icon class="me-1">
              mdi-floppy
            </v-icon>
            Simpan Produk
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </xyztransition>
</template>
<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import VueDropzone from '@/components/VueDropzone.vue'
import { required } from '@helpers/validations'
import useCategory from '@/composables/useCategory'
import useMaterial from '@/composables/useMaterial'
import useProduct from '@/composables/useProduct'
import { useRoute } from 'vue-router'
import mime from 'mime'

// import router from '@/router'
// import { toast } from '@helpers/utils'

export default {
	components: {
		VueDropzone,
	},
	setup() {
		const route = useRoute()
    
		const product = ref({
			name: '',
			description: '',
			category_id: null as any,
			material_id: null as any,
			images: [] as any[]
		})

		const variant_attributes = ref([] as any[])
		const cbSearch = ref('')
		const variantItems = ref([{}] as any[])

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

		const variantTableItems = ref([] as any[])

		// const variantTableItems = computed(() => {
		// 	let items = [] as any[]
		// 	fillItems(variant_attributes.value, {}, 0, items)
		// 	// eslint-disable-next-line vue/no-side-effects-in-computed-properties
		// 	variantItems.value = items

		// 	fillItemData(variantItems.value, productData.value.variants)
			
		// 	return items
		// })

		const reloadVariantItems = () => {
			console.log('tes')
			let items = [] as any[]
			fillItems(variant_attributes.value, {}, 0, items)
			// eslint-disable-next-line vue/no-side-effects-in-computed-properties
			variantItems.value = items
			variantTableItems.value = items
			fillItemData(variantItems.value, productData.value.variants)
		}

		const fillItemData = async (items: any[], variants: any[]) => {
			items.forEach(async (item: any) => {
				const attribute_length = Object.entries(item).length
        
				//check if the property is an Object
				for (let j = 0; j < variants.length; j++) {
					let ctr = 0
					for (let k = 0; k < variants[j].attribute_values.length; k++) {
						for (const [key, value] of Object.entries(item)) {
							if (key === variants[j].attribute_values[k].attribute.name && value === variants[j].attribute_values[k].option.name) {
								ctr += 1
							}
						}
						if (ctr === attribute_length) {
							item.sku = variants[j].sku
							item.price = variants[j].price
							item.stock = variants[j].stock
              
							let response = await fetch(variants[j].image.path)
							let data = await response.blob()
							const type = response.headers.get('content-type') || 'image/*'
							const ext = mime.getExtension(type) || 'jpg'
							let metadata = {
								type: type
							}
							let file = new File([data], `image.${ext}`, metadata)
							item.image = file
						}
					}
				}
			})
		}

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

		const { getCategoryList, loadingCategoryList, categoryList } = useCategory()
		const { getMaterialList, loadingMaterialList, materialList } = useMaterial()
		const { getProductDetail, loadingProductDetail, productData } = useProduct()

		const loadProduct = () => {
			getProductDetail(+route.params.id).then(async () => {
				console.log(productData.value)
				product.value.name = productData.value.name
				variant_attributes.value = productData.value.attributes.map((attr: any) => {
					return {
						name: attr.name,
						values: attr.options.map((val: any) => val.name)
					}
				})
				reloadVariantItems()
				
				console.log(variantItems.value)

				// variantItems.value = productData.value.variants
				// console.log(variantItems.value)
        
				product.value.description = productData.value.description
				product.value.category_id = productData.value.category.id
				product.value.material_id = productData.value.material.id
				const images = productData.value.images.map(async (image: any) => {
					// const { ext } = parse(image.path)
					// console.log(ext)
					let response = await fetch(image.path)
					let data = await response.blob()
					const type = response.headers.get('content-type') || 'image/*'
					const ext = mime.getExtension(type) || 'jpg'
					let metadata = {
						type: type
					}
					let file = new File([data], `image.${ext}`, metadata)
					
					return file
				})

				product.value.images = await Promise.all(images)
			})
		}
		onMounted(() => {
			loadProduct()
			getMaterialList()
			getCategoryList()
		})

		const addVariantAttribute = () => {
			variant_attributes.value.push({
				name: '',
				values: [],
			})

			reloadVariantItems()
		}

		const removeVariantAttribute = (index: number) => {
			variant_attributes.value.splice(index, 1)
			reloadVariantItems()
		}

		return {
			required,
			addVariantAttribute,
			removeVariantAttribute,
			reloadVariantItems,

			loadingCategoryList,
			categoryList,

			loadingMaterialList,
			materialList,

			loadingProductDetail,
			productData,
      
			product,
			variant_attributes,
			cbSearch,
			variantItems,
			variantTableHeaders,
			variantTableItems,
      
		}
	},
}
</script>