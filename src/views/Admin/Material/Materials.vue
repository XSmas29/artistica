<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-card flat>
      <div class="d-flex justify-end">
        <v-dialog
          max-width="500"
          v-model="addMaterialDialog"
        >
          <template #default="{ isActive }">
            <v-form ref="addMaterialForm">
              <v-card
                title="Form Tambah Material"
                :loading="loadingCreateMaterial"
              >
                <v-card-text>
                  <v-text-field
                    v-model="addMaterialFormData.name"
                    label="Nama Material"
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
                    :loading="loadingCreateMaterial"
                    @click="addMaterial"
                  >
                    <v-icon class="me-1">
                      mdi-floppy
                    </v-icon>
                    Simpan Material
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
              Tambah Material
            </v-btn>
          </template>
        </v-dialog>
      </div>
      <v-card-title class="d-flex align-center px-0">
        Daftar Material

        <v-spacer />
        <v-text-field
          v-model="materialListFilterAdmin.search"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          label="Search"
          single-line
          flat
          hide-details
          variant="solo-filled"
          @update:model-value="debouncedLoadMaterial(true)"
        />
      </v-card-title>
      <v-divider />
      <v-data-table-server
        :loading="loadingMaterialList"
        :items="materialList"
        :items-length="materialCount"
        :headers="headerList"
        fixed-header
        multi-sort
        must-sort
        height="100%"
        class="layout"
        v-model:page="materialListPaginationAdmin.page"
        v-model:items-per-page="materialListPaginationAdmin.limit"
        @update:items-per-page="loadMaterial(true)"
        @update:page="loadMaterial(false)"
      >
        <template #[`header.action`]="{ column }">
          <div class="text-end">
            {{ column.title }}
          </div>
        </template>
        <template #[`item.no`]="{ index }">
          {{ ((materialListPaginationAdmin.page - 1) * materialListPaginationAdmin.limit) + index + 1 }}
        </template>
        <template #bottom>
          <v-data-table-footer
            :items-per-page-options="[10, 25, 50]"
            :total-items="materialCount"
            :page-text="
              (((materialListPaginationAdmin.page - 1) * materialListPaginationAdmin.limit) + 1) + '-' + 
                (materialListPaginationAdmin.page * materialListPaginationAdmin.limit > materialCount
                  ? materialCount
                  : materialListPaginationAdmin.page * materialListPaginationAdmin.limit
                )
                + ' dari ' + materialCount
            "
          />
        </template>
        <template #[`item.action`]="{ item }">
          <div class="text-end">
            <v-dialog
              max-width="500"
            >
              <template #activator="{ props }">
                <v-btn
                  icon
                  flat
                  density="comfortable"
                  v-bind="props"
                  @click="editMaterialFormData.name = item.name"
                >
                  <v-icon
                    size="35"
                    color="warning"
                  >
                    mdi-pencil-circle
                  </v-icon>
                  <v-tooltip
                    text="Edit Material"
                    location="top"
                    activator="parent"
                  />
                </v-btn>
              </template>
              <template #default="{ isActive }">
                <v-form ref="editMaterialForm">
                  <v-card
                    title="Form Edit Material"
                  >
                    <v-card-text>
                      <v-text-field
                        v-model="editMaterialFormData.name"
                        label="Nama Material"
                        outlined
                        dense
                        :rules="[required]"
                        class="mb-2 my-4"
                      />
                    </v-card-text>
                    
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="success"
                        variant="flat"
                        @click="updateMaterial(item.id).then(() => isActive.value = false)"
                        :loading="loadingEditMaterial"
                        :disabled="loadingEditMaterial"
                      >
                        <v-icon class="me-1">
                          mdi-floppy
                        </v-icon>
                        Simpan
                      </v-btn>
                      <v-btn
                        text="Batal"
                        @click="isActive.value = false"
                      />
                    </v-card-actions>
                  </v-card>
                </v-form>
              </template>
            </v-dialog>
            
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
                    text="Hapus Material"
                    location="top"
                    activator="parent"
                  />
                </v-btn>
              </template>
              <template #default="{ isActive }">
                <v-card
                  title="Hapus Material?"
                >
                  <v-card-text>
                    Yakin mau menghapus material <b>{{ item.name }}</b>?
                  </v-card-text>
                  
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      text="Hapus"
                      color="error"
                      :loading="loadingRemoveMaterial"
                      @click="deleteMaterial(item.id)"
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
  </XyzTransition>
</template>
<script lang="ts">
import { required } from '@helpers/validations'
import useMaterial from '@composables/useMaterial'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMaterialStore } from '@/store/modules'
import { useDebounceFn } from '@vueuse/core'

export default {
	setup() {
		const { materialListFilterAdmin, materialListPaginationAdmin } = storeToRefs(useMaterialStore())
		const { 
			getMaterialList, loadingMaterialList, materialList, materialCount,
			createMaterial, loadingCreateMaterial,
			editMaterial, loadingEditMaterial,
			removeMaterial, loadingRemoveMaterial,
		} = useMaterial()
		const addMaterialForm = ref(null as any)
		const editMaterialForm = ref(null as any)

		const addMaterialDialog = ref(false)

		const addMaterialFormData = ref({
			name: '',
		})

		const editMaterialFormData = ref({
			name: '',
		})

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

		const addMaterial = async () => {
			addMaterialForm.value.validate()
			if (addMaterialForm.value.isValid) {
				createMaterial(addMaterialFormData.value).then(() => {
					loadMaterial(true)
					addMaterialForm.value.reset()
					addMaterialDialog.value = false
				})
			}
		}

		const updateMaterial = async (id: number) => {
			editMaterialForm.value.validate()
			if (editMaterialForm.value.isValid) {
				editMaterial(id, editMaterialFormData.value).then(() => {
					loadMaterial(false)
					editMaterialForm.value.reset()
				})
			}
		}

		const deleteMaterial = (id: number) => {
			removeMaterial(id).then(() => {
				loadMaterial(true)
			})
		}

		const loadMaterial = async (resetPage: boolean) => {
			if (resetPage) materialListPaginationAdmin.value.page = 1
			await getMaterialList(materialListFilterAdmin.value, materialListPaginationAdmin.value)
		}

		const debouncedLoadMaterial = useDebounceFn((resetPage: boolean) => {
			
			loadMaterial(resetPage)
		}, 500)

		onMounted(() => {
			loadMaterial(true)
		})
    
		return {
			required,
			loadMaterial,
			debouncedLoadMaterial,
			addMaterial,
			updateMaterial,
			deleteMaterial,

			loadingCreateMaterial,
			loadingMaterialList,
			loadingEditMaterial,
			loadingRemoveMaterial,

			headerList,
			materialList,
			materialCount,

			addMaterialDialog,
			addMaterialForm,
			addMaterialFormData,
      
			editMaterialForm,
			editMaterialFormData,

			materialListFilterAdmin,
			materialListPaginationAdmin,
		}
	}
}
</script>