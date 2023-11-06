<template>
  <v-row class="my-4">
    <v-col
      cols="12"
      md="2"
    />
    <v-col
      cols="12"
      md="2"
    >
      <v-tabs
        v-model="selectedTab"
        :direction="$vuetify.display.mdAndUp ? 'vertical' : 'horizontal'"
        grow
        show-arrows
        mandatory
        color="primary"
      >
        <v-tab value="0">
          <v-icon
            icon="mdi-account"
            start
          />
          Profil
        </v-tab>
        <v-tab value="1">
          <v-icon
            icon="mdi-lock"
            start
          />
          Security
        </v-tab>
      </v-tabs>
    </v-col>
    <v-divider vertical />
    <v-col
      cols="12"
      md="6"
    >
      <v-card
        flat
        class="mx-4"
      >
        <div class="d-flex justify-end mb-4">
          <v-btn
            color="primary"
            size="small"
            text="Edit Profil"
            @click="editMode = !editMode"
            v-if="!editMode"
          >
            <template #prepend>
              <v-icon>mdi-pencil</v-icon>
            </template>
          </v-btn>
          <div v-else>
            <v-btn
              color="error"
              size="small"
              text="Batal"
              class="me-2"
              @click="resetProfile"
            />
            <v-btn
              color="success"
              text="Simpan"
              size="small"
              @click="saveProfile"
            />
          </div>
        </div>
        <v-form
          ref="profileForm"
          v-model="isProfileValid"
          @submit.prevent
          fast-fail
        >
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                hide-details="auto"
                label="Nama depan"
                v-model="formData.first_name"
                :disabled="!editMode"
                :rules="[required]"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                hide-details="auto"
                label="Nama belakang"
                v-model="formData.last_name"
                :disabled="!editMode"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                hide-details="auto"
                label="No. HP"
                v-model="formData.phone"
                :disabled="!editMode"
                @input="filterTel"
              />
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <v-row>
            <v-col
              cols="12"
              lg="6"
            >
              <v-text-field
                hide-details="auto"
                label="Email"
                disabled
                v-model="formData.email"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="2"
    />
  </v-row>
</template>
<script lang="ts">
import { onMounted, ref } from 'vue'
import useUser from '@composables/useUser'
import { required } from '@helpers/validations'
import { filterTel } from '@helpers/filters'

export default {
	setup() {
		const selectedTab = ref(0)
		const editMode = ref(false)
		const isProfileValid = ref(false)
		const profileForm = ref(null)
		const formData = ref({
			first_name: '',
			last_name: '',
			phone: '',
			email: '',
		})

		const resetProfile = () => {
			editMode.value = false
			loadProfile()
		}
		const { getProfileInfo, updateProfile } = useUser()

		const loadProfile = () => {
			getProfileInfo().then(({ profileInfo }: any) => {
				formData.value.first_name = profileInfo.first_name
				formData.value.last_name = profileInfo.last_name
				formData.value.phone = profileInfo.phone
				formData.value.email = profileInfo.email
			})
		}
		onMounted(() => {
			loadProfile()
		})

		const saveProfile = async () => {
			const valid = (await (profileForm.value as any).validate()).valid
			if (valid) {
				const data = {
					first_name: formData.value.first_name,
					last_name: formData.value.last_name,
					phone: formData.value.phone,
				}
				updateProfile(data).then(() => {
					editMode.value = false
					loadProfile()
				})
			}
		}
		
		return {
			selectedTab,
			formData,
			editMode,
			isProfileValid,
			profileForm,

			resetProfile,
			saveProfile,
			required,
			filterTel,
		}
	},
}
</script>
<style scoped>
</style>