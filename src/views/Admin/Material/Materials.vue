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
                title="Form Tambah Kategori"
                :loading="loadingCreateMaterial"
              >
                <v-card-text>
                  <v-text-field
                    v-model="addMaterialFormData.name"
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
                    :loading="loadingCreateMaterial"
                    @click="addMaterial"
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
    </v-card>
  </XyzTransition>
</template>
<script lang="ts">
import { required } from '@helpers/validations'

export default {
	setup() {
		return {
			required, 
		}
	}
}
</script>