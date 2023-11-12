/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

//PLUG IN
import Toast, { PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import VueAnimXYZ from '@animxyz/vue3'
import '@animxyz/core'

// Composables
import { createApp, h} from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import MyIcon from '@components/MyIcon.vue'
import { registerPlugins } from '@/plugins'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { apolloProvider } from './vue-apollo'

library.add(fas)
library.add(fab)
library.add(far)

const app = createApp({
	render: () => h(App),
})

registerPlugins(app)
app.use(apolloProvider)

const toastDefault : PluginOptions = {
	position: POSITION.BOTTOM_RIGHT,
	timeout: 2500,
	maxToasts: 4,
	showCloseButtonOnHover: true,
	transition: 'Vue-Toastification__fade'
}

app.use(Toast, toastDefault)
app.use(VueAnimXYZ)

app.component('FaIcon', FontAwesomeIcon)
app.component('MyIcon', MyIcon)
app.mount('#app')
