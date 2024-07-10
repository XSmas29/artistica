
// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import process from 'node:process'

// Utilities
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/

/* eslint-disable @typescript-eslint/no-unused-vars */
export default defineConfig(({command, mode}) => {
	const env = loadEnv(mode, process.cwd(), '')

	return {
		plugins: [
			vue({ 
				template: { transformAssetUrls }
			}),

			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
			vuetify({
				autoImport: true,
				styles: {
					configFile: 'src/styles/settings.scss',
				},
			}),
		],
		define: { 'process.env': {} },
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				'@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
				'@views': fileURLToPath(new URL('./src/views', import.meta.url)),
				'@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
				'@graphql': fileURLToPath(new URL('./src/graphql', import.meta.url)),
				'@helpers': fileURLToPath(new URL('./src/helpers', import.meta.url)),
				'@components': fileURLToPath(new URL('./src/components', import.meta.url)),
			},
			extensions: [
				'.js',
				'.json',
				'.jsx',
				'.mjs',
				'.ts',
				'.tsx',
				'.vue',
			],
		},
		server: {
			port: Number(env.VITE_PORT),
		},
	}
})
