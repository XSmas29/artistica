<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
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
        <v-window v-model="selectedTab">
          <v-window-item value="0">
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
                    :loading="loadingEditProfile"
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
                      v-model="profileFormData.first_name"
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
                      v-model="profileFormData.last_name"
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
                      v-model="profileFormData.phone"
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
                      v-model="profileFormData.email"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
          </v-window-item>
          <v-window-item value="1">
            <v-card
              flat
              class="mx-4"
            >
              <v-card-title class="mb-3">
                Ubah Password
              </v-card-title>
              <v-form
                ref="passwordForm"
                v-model="isPasswordValid"
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
                      label="Password lama"
                      v-model="passwordFormData.old_password"
                      :rules="[required, min(passwordFormData.old_password, 8)]"
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
                      label="Password baru"
                      v-model="passwordFormData.new_password"
                      :rules="[required, min(passwordFormData.new_password, 8)]"
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
                      label="Konfirmasi password baru"
                      v-model="passwordFormData.password_confirmation"
                      :rules="[required, min(passwordFormData.password_confirmation, 8), passwordEqual(passwordFormData.password_confirmation, passwordFormData.password_confirmation)]"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <div class="d-flex">
                      <v-spacer />
                      <v-btn
                        color="success"
                        text="Simpan"
                        size="small"
                        @click="savePassword"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
      <v-col
        cols="12"
        md="2"
      />
    </v-row>
  </xyztransition>
</template>
<script lang="ts">
import { onMounted, ref } from 'vue'
import useUser from '@composables/useUser'
import { required, min, passwordEqual } from '@helpers/validations'
import { filterTel } from '@helpers/filters'

export default {
	setup() {
		const selectedTab = ref(0)
		const editMode = ref(false)
		const isProfileValid = ref(false)
		const isPasswordValid = ref(false)
		const profileForm = ref(null)
		const passwordForm = ref(null)
		const profileFormData = ref({
			first_name: '',
			last_name: '',
			phone: '',
			email: '',
		})

		const passwordFormData = ref({
			old_password: '',
			new_password: '',
			password_confirmation: '',
		})

		const resetProfile = () => {
			editMode.value = false
			loadProfile()
		}
		const { getProfileInfo, 
			updateProfile, loadingEditProfile,
			updatePassword, loadingUpdatePassword,
		} = useUser()

		const loadProfile = () => {
			getProfileInfo().then((profileInfo: any) => {
				profileFormData.value.first_name = profileInfo.first_name
				profileFormData.value.last_name = profileInfo.last_name
				profileFormData.value.phone = profileInfo.phone
				profileFormData.value.email = profileInfo.email
			})
		}
		onMounted(() => {
			loadProfile()
		})

		const saveProfile = async () => {
			const valid = (await (profileForm.value as any).validate()).valid
			if (valid) {
				const data = {
					first_name: profileFormData.value.first_name,
					last_name: profileFormData.value.last_name,
					phone: profileFormData.value.phone,
				}
				updateProfile(data).then(() => {
					editMode.value = false
					loadProfile()
				})
			}
		}

		const savePassword = async () => {
			console.log(await (profileForm.value as any).validate())
			console.log(isPasswordValid.value)
		}
		
		return {
			selectedTab,
			profileFormData,
			editMode,
			isProfileValid,
			profileForm,
			passwordForm,
			passwordFormData,
			isPasswordValid,
			loadingEditProfile,

			resetProfile,
			saveProfile,
			required,
			filterTel,
			min,
			passwordEqual,
			savePassword,
		}
	},
}
</script>
<style scoped>
</style>