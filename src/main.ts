// register vue composition api globally
import GA4 from 'google-analytics-ga4';
import { setupLayouts } from 'virtual:generated-layouts';
import generatedRoutes from 'virtual:generated-pages';
import { ViteSSG } from 'vite-ssg';
import App from './App.vue';
import type { UserModule } from './types';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'vue-awesome-paginate/dist/style.css';
import './common/styles/main.css';
import './common/styles/main.scss';

import '@vuepic/vue-datepicker/dist/main.css';
// import './token'

const routes = setupLayouts(generatedRoutes);

GA4.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(App, { routes, base: import.meta.env.BASE_URL }, (ctx) => {
	// install all modules under `**/modules/`
	Object.values(
		import.meta.glob<{ install: UserModule }>('./**/modules/*.ts', {
			eager: true,
		}),
	).forEach((i) => i.install?.(ctx));
});
