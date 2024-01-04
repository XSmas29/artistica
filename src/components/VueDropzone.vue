<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card
        flat
        v-bind="props"
        :width="width"
        :height="height"
        rounded="lg"

        :class="{ 'on-hover': isHovering, 'files': state }"
      >
        <div
          v-if="state"
        >
          <v-img
            :src="thumbnail"
            aspect-ratio="1/1"
            :width="width"
            :height="height"
            v-bind="props"
            :lazy-src="productPlaceholder"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  color="grey-lighten-4"
                  indeterminate
                />
              </div>
            </template>
            <div
              v-if="isHovering"
              class="d-flex align-center justify-center"
              style="height: 100%"
            >
              <v-btn
                icon
                density="comfortable"
                @click="handleClickDeleteFile"
              >
                <v-icon
                  size="30"
                >
                  mdi-close-circle
                </v-icon>
              </v-btn>
            </div>
          </v-img>
        </div>
        <div
          v-else
          class="dropzone cursor-pointer"
          v-bind="getRootProps()"
        >
          <div
            class="border text-center"
            :class="{
              isDragActive,
            }"
          >
            <input v-bind="getInputProps()">
            <p v-if="isDragActive">
              Drop the files here ...
            </p>
            <p v-else>
              <v-icon
                class="mb-1"
                size="22"
              >
                mdi-cloud-upload
              </v-icon>
              Upload
            </p>
          </div>
        </div>
      </v-card>
    </template>
  </v-hover>
</template>
<script lang="ts">
import { computed, ref, watch } from 'vue'
import { useDropzone } from 'vue3-dropzone'
import { toast } from '@helpers/utils'
import { productPlaceholder } from '@/utils/global'

export default {
	emits: ['update:modelValue'],
	props: {
		width: {
			type: String,
			default: '100%',
		},
		height: {
			type: String,
			default: '100%',
		},
		modelValue: {
			type: Object as () => Record<string, any> | null,
			default: () => null,
		},
	},
	setup(props, { emit }) {
		const thumbnail = ref(null as any)
    
		const onDrop = (acceptFiles: any, rejectReasons: any) => {
			if (rejectReasons.length > 0) {
        
				rejectReasons.forEach((reason: any) => {
					reason.errors.forEach((error: any) => {
						toast.error(error.message)
					})
				})
			}
			else {
				console.log(acceptFiles)
				state.value = acceptFiles[0]
				thumbnail.value = URL.createObjectURL(acceptFiles[0])
			}
		}

		// const state = ref({
		// 	file: null as any,
		// })
    
		const state = computed({
			get() {
				return props.modelValue
			},
			set(value) {
				emit('update:modelValue', value)
			},
		})

		watch(state, file => {
			if (file) thumbnail.value = URL.createObjectURL(props.modelValue as File)
		})

		// watch(() => state.value, file => {
		// 	emit('update:modelValue', file)
		// })

		const dropzoneOptions = ref({
			onDrop: onDrop,
			accept: 'image/*',
			maxSize: 2000000,
		})

		const { getRootProps, getInputProps, ...rest } = useDropzone(dropzoneOptions.value)

		const handleClickDeleteFile = () => {
			state.value = null
		}
		
		return {
			getRootProps,
			getInputProps,
			...rest,
			state,
			handleClickDeleteFile,
			thumbnail,
			productPlaceholder,
		}
	},
}
</script>
<style lang="scss" scoped>

.on-hover {
  background: rgba(0,0,0,0.1);
}

.dropzone {
  width: 100%;
  height: 100%;
  font-size: 12px;
}

.files {
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.2);
}

.border {
  border: 1px dashed rgba(0,0,0,0.2) !important;
  border-radius: 8px;

  width: 100%;
  height: 100%;
  
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transition: all 0.3s ease;

  &.isDragActive {
    border: 2px dashed rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.1);
  }
}

.file-item {
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(255 167 18 / 20%);
  padding: 7px;
  padding-left: 15px;
  margin-top: 10px;

  &:first-child {
    margin-top: 0;
  }
}
</style>