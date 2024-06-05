// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
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
		port: 8080,
	},
})
