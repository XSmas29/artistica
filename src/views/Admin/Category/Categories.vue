<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-card flat>
      <div class="d-flex justify-end">
        <v-dialog
          max-width="500"
          v-model="addCategoryDialog"
        >
          <template #default="{ isActive }">
            <v-form ref="addCategoryForm">
              <v-card
                title="Form Tambah Kategori"
                :loading="loadingCreateCategory"
              >
                <v-card-text>
                  <v-text-field
                    v-model="addCategoryFormData.name"
                    label="Nama Kategori"
                    outlined
                    dense
                    :rules="[required]"
                    class="mb-2 my-4"
                  />
                </v-card-text>
                <v-card-actions class="mb-1">
                  <v-spacer />
                  <v-btn
                    color="success"
                    variant="flat"
                    :loading="loadingCreateCategory"
                    @click="addCategory"
                  >
                    <v-icon class="me-1">
                      mdi-floppy
                    </v-icon>
                    Simpan Kategori
                  </v-btn>
                  <v-btn
                    text="Batal"
                    @click="isActive.value = false"
                  />
                </v-card-actions>
              </v-card>
            </v-form>
          </template>
          <template #activator="{ props }">
            <v-btn
              flat
              color="success"
              v-bind="props"
            >
              <v-icon>mdi-plus</v-icon>
              Tambah Kategori
            </v-btn>
          </template>
        </v-dialog>
      </div>
      <v-card-title class="d-flex align-center px-0">
        Daftar Kategori

        <v-spacer />
        <v-text-field
          v-model="categoryListFilterAdmin.search"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          label="Search"
          single-line
          flat
          hide-details
          variant="solo-filled"
          @update:model-value="debouncedLoadCategory(true)"
        />
      </v-card-title>
      <v-divider />
      <v-data-table-server
        :loading="loadingCategoryList"
        :items="categoryList"
        :items-length="categoryCount"
        :headers="headerList"
        fixed-header
        multi-sort
        must-sort
        height="100%"
        class="layout"
        v-model:page="categoryListPaginationAdmin.page"
        v-model:items-per-page="categoryListPaginationAdmin.limit"
        @update:items-per-page="loadCategory(true)"
        @update:page="loadCategory(false)"
      >
        <template #[`header.action`]="{ column }">
          <div class="text-end">
            {{ column.title }}
          </div>
        </template>
        <template #[`item.no`]="{ index }">
          {{ ((categoryListPaginationAdmin.page - 1) * categoryListPaginationAdmin.limit) + index + 1 }}
        </template>
        <template #bottom>
          <v-data-table-footer
            :items-per-page-options="[10, 25, 50]"
            :total-items="categoryCount"
            :page-text="
              (((categoryListPaginationAdmin.page - 1) * categoryListPaginationAdmin.limit) + 1) + '-' + 
                (categoryListPaginationAdmin.page * categoryListPaginationAdmin.limit > categoryCount
                  ? categoryCount
                  : categoryListPaginationAdmin.page * categoryListPaginationAdmin.limit
                )
                + ' dari ' + categoryCount
            "
          />
        </template>
        <template #[`item.action`]="{ item }">
          <div class="text-end">
            <v-tooltip
              text="Edit Kategori"
              location="top"
            >
              <template #activator="{ props }">
                <router-link
                  :to="{ name: 'admin-product-edit', params: { id: item.id } }"
                >
                  <v-btn
                    icon
                    flat
                    density="comfortable"
                    v-bind="props"
                  >
                    <v-icon
                      size="35"
                      color="warning"
                    >
                      mdi-pencil-circle
                    </v-icon>
                  </v-btn>
                </router-link>
              </template>
            </v-tooltip>
            
            <v-dialog
              max-width="500"
            >
              <template #activator="{ props }">
                <v-btn
                  icon
                  flat
                  density="comfortable"
                  v-bind="props"
                >
                  <v-icon
                    color="error"
                    size="35"
                  >
                    mdi-delete-circle
                  </v-icon>
                  <v-tooltip
                    text="Hapus Kategori"
                    location="top"
                    activator="parent"
                  />
                </v-btn>
              </template>
              <template #default="{ isActive }">
                <v-card
                  title="Hapus Kategori?"
                >
                  <v-card-text>
                    Yakin mau menghapus kategori <b>{{ item.name }}</b>?
                  </v-card-text>
                  
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      text="Hapus"
                      color="error"
                      :loading="loadingRemoveProduct"
                      @click="deleteProduct(item.id)"
                    />
                    <v-btn
                      text="Batal"
                      @click="isActive.value = false"
                    />
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
  </xyztransition>
</template>
<script lang="ts">
import useCategory from '@/composables/useCategory'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/store/modules'
import { useDebounceFn } from '@vueuse/core'
import { required } from '@helpers/validations'

export default {
	setup() {
		const { 
			getCategoryList, loadingCategoryList, categoryList, categoryCount,
			createCategory, loadingCreateCategory,
		} = useCategory()
		const { categoryListFilterAdmin, categoryListPaginationAdmin } = storeToRefs(useCategoryStore())

		const addCategoryFormData = ref({
			name: '',
		})

		const addCategoryForm = ref(null as any)
		const addCategoryDialog = ref(false)

		const headerList = ref([
			{
				text: 'No',
				value: 'no',
				title: 'No',
			},
			{
				text: 'Nama',
				value: 'name',
				title: 'Nama',
			},
			{
				text: 'Aksi',
				value: 'action',
				title: 'Aksi',
			},
		])

		onMounted(() => {
			loadCategory(true)
		})

		const loadCategory = async (resetPage: boolean) => {
			if (resetPage) categoryListPaginationAdmin.value.page = 1
			await getCategoryList(categoryListFilterAdmin.value, categoryListPaginationAdmin.value)
		}

		const debouncedLoadCategory = useDebounceFn((resetPage: boolean) => {
			
			loadCategory(resetPage)
		}, 500)

		const addCategory = async () => {
			addCategoryForm.value.validate()
			if (addCategoryForm.value.isValid) {
				createCategory(addCategoryFormData.value).then(() => {
					loadCategory(true)
					addCategoryForm.value.reset()
					addCategoryDialog.value = false
				})
			}
		}

		return {
			loadCategory,
			debouncedLoadCategory,
			required,
      
			loadingCategoryList,
			categoryList,
			categoryCount,

			headerList,

			categoryListFilterAdmin,
			categoryListPaginationAdmin,
			addCategoryFormData,
			addCategoryForm,
			addCategoryDialog,

			loadingCreateCategory,
			addCategory,
		}
	}
}
</script>