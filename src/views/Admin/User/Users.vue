<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-card flat>
      <v-card-title class="d-flex align-center px-0">
        Daftar Pengguna
        <v-spacer />
        <v-text-field
          v-model="userListFilterAdmin.search"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          label="Search"
          single-line
          flat
          hide-details
          variant="solo-filled"
          @update:model-value="debouncedLoadUser(true)"
        />
      </v-card-title>
      <v-divider />
      <v-data-table-server
        :loading="loadingUserList"
        :items="userList"
        :items-length="userCount"
        :headers="headerList"
        fixed-header
        multi-sort
        must-sort
        height="100%"
        class="layout"
        v-model:page="userListPaginationAdmin.page"
        v-model:items-per-page="userListPaginationAdmin.limit"
        @update:items-per-page="loadUser(true)"
        @update:page="loadUser(false)"
      >
        <template #[`header.action`]="{ column }">
          <div class="text-end">
            {{ column.title }}
          </div>
        </template>
        <template #[`item.no`]="{ index }">
          {{ ((userListPaginationAdmin.page - 1) * userListPaginationAdmin.limit) + index + 1 }}
        </template>
        <template #[`item.name`]="{ item }">
          {{ item.first_name + ' ' + item.last_name }}
        </template>
        <template #[`item.is_verified`]="{ item }">
          {{ item.is_verified ? 'Sudah' : 'Belum' }}
        </template>
        <template #[`item.created_at`]="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <template #bottom>
          <v-data-table-footer
            :items-per-page-options="[10, 25, 50]"
            :total-items="userCount"
            :page-text="
              (((userListPaginationAdmin.page - 1) * userListPaginationAdmin.limit) + 1) + '-' + 
                (userListPaginationAdmin.page * userListPaginationAdmin.limit > userCount
                  ? userCount
                  : userListPaginationAdmin.page * userListPaginationAdmin.limit
                )
                + ' dari ' + userCount
            "
          />
        </template>
        <!-- <template #[`item.action`]="{ item }">
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
                        @click="updateMaterial(item.id, isActive)"
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
        </template> -->
      </v-data-table-server>
    </v-card>
  </xyztransition>
</template>
<script lang="ts">
import { useUserStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import useUser from '@composables/useUser'
import { useDebounceFn } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { formatDate } from '@helpers/utils'

export default {
	setup() {
		const { userListFilterAdmin, userListPaginationAdmin } = storeToRefs(useUserStore())
		const { getUserList, loadingUserList, userList, userCount } = useUser()

		const loadUser = async (resetPage: boolean) => {
			if (resetPage) userListPaginationAdmin.value.page = 1
			await getUserList(userListFilterAdmin.value, userListPaginationAdmin.value)
		}

		const debouncedLoadUser = useDebounceFn((resetPage: boolean) => {
			
			loadUser(resetPage)
		}, 500)

		onMounted(() => {
			loadUser(true)
		})

		const headerList = ref([
			{
				text: 'No',
				value: 'no',
				title: 'No',
			},
			{
				text: 'Email',
				value: 'email',
				title: 'Email',
			},
			{
				text: 'Nama',
				value: 'name',
				title: 'Nama',
			},
			{
				text: 'No. Telp',
				value: 'phone',
				title: 'No. Telp',
			},
			{
				text: 'Status Verifikasi',
				value: 'is_verified',
				title: 'Status Verifikasi',
			},
			{
				text: 'Tanggal Bergabung',
				value: 'created_at',
				title: 'Tanggal Bergabung',
			},
			{
				text: 'Aksi',
				value: 'action',
				title: 'Aksi',
			},
		])

		return {
			loadUser,
			debouncedLoadUser,
			formatDate,
      
			loadingUserList,

			userListFilterAdmin,
			userListPaginationAdmin,
			userList,
			userCount,
			headerList,
		}
	},
}
</script>