<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card
        flat
        v-bind="props"
        :width="width"
        :height="height"
        rounded="lg"
        :class="{ 'on-hover': isHovering }"
      >
        <div
          v-if="state.files.length > 0"
          class="files"
        >
          <div
            v-for="(file, index) in state.files"
            :key="index"
          >
            <v-img
              :src="thumbnail"
              cover
              aspect-ratio="1/1"
              :width="width"
              :height="height"
            />
            <!-- <span
              class="delete-file"
              @click="handleClickDeleteFile(index)"
            >Delete</span> -->
          </div>
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
              Upload file
            </p>
          </div>
        </div>
      </v-card>
    </template>
  </v-hover>
</template>
<script lang="ts">
import { ref } from 'vue'
import { useDropzone } from 'vue3-dropzone'

export default {
	props: {
		width: {
			type: String,
			default: '100%',
		},
		height: {
			type: String,
			default: '100%',
		},
		rules: {
			type: Array,
			default: () => [],
		},
	},
	setup() {
		const thumbnail = ref(null as any)
    
		const onDrop = (acceptFiles: any, rejectReasons: any) => {
			console.log(acceptFiles)
			console.log(rejectReasons)
			state.value.files = acceptFiles
			thumbnail.value = URL.createObjectURL(acceptFiles[0])
		}

		const state = ref({
			files: [] as any[],
		})

		const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop })

		const handleClickDeleteFile = (index: number) => {
			state.value.files.splice(index, 1)
		}
		
		return {
			getRootProps,
			getInputProps,
			...rest,
			state,
			handleClickDeleteFile,
			thumbnail,
		}
	},
}
</script>
<style lang="scss" scoped>

.on-hover {
  background: rgba(0,0,0,0.1);
}

.dropzone, .files {
  width: 100%;
  height: 100%;
  font-size: 12px;
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
    border: 2px dashed #ffb300;
    background: rgb(255 167 18 / 20%);
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

  .delete-file {
    background: red;
    color: #fff;
    padding: 5px 10px;
    border-radius: 8px;
    cursor: pointer;
  }
}
</style>