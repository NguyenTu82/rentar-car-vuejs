import VueI18n from '@intlify/vite-plugin-vue-i18n';
import Vue from '@vitejs/plugin-vue';
import LinkAttributes from 'markdown-it-link-attributes';
import Prism from 'markdown-it-prism';
import path, { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import Inspect from 'vite-plugin-inspect';
import Pages from 'vite-plugin-pages';
import { VitePWA } from 'vite-plugin-pwa';
import Layouts from 'vite-plugin-vue-layouts';
import Markdown from 'vite-plugin-vue-markdown';
import generateSitemap from 'vite-ssg-sitemap';

const markdownWrapperClasses = 'prose lg:prose-xl mx-auto text-left dark:prose-invert';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.');

	const htmlPlugin = () => {
		return {
			name: 'html-transform',
			transformIndexHtml(html: string) {
				return html.replace(/{{%(.*?)%}}/g, function (match, p1) {
					return env[p1];
			});
			},
		};
	};

	return {
		build: {
			rollupOptions: {
				input: {
					main: resolve(__dirname, 'index.html'),
					ekyc: resolve(__dirname, 'ekyc.html'),
					gmo: resolve(__dirname, 'gmo_payment.html'),
				}
			},
		},

		resolve: {
			alias: {
				'~/': `${path.resolve(__dirname, 'src')}/`,
				'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
			},
		},

		plugins: [
			Vue({
				include: [/\.vue$/, /\.md$/],
				reactivityTransform: true,
			}),			

			htmlPlugin(),

			// https://github.com/hannoeru/vite-plugin-pages
			Pages({
				extensions: ['vue', 'md'],
				pagesDir: [{ dir: 'src/**/pages', baseRoute: '' }],
			}),

			// https://github.com/JohnCampionJr/vite-plugin-vue-layouts
			Layouts({
				layoutsDirs: 'src/common/layouts',
			}),

			// https://github.com/antfu/unplugin-auto-import
			AutoImport({
				imports: ['vue', 'vue-router', 'vue-i18n', 'vue/macros', '@vueuse/head', '@vueuse/core'],
				dts: 'src/auto-imports.d.ts',
			}),

			// https://github.com/antfu/unplugin-vue-components
			Components({
				// relative paths to the directory to search for components
				dirs: ['src/**/components'],

				// allow auto load markdown components under `./src/components/`
				extensions: ['vue', 'md'],

				// search for subdirectories
				deep: true,

				dts: 'src/components.d.ts',

				// allow auto import and register components used in markdown
				include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

				// custom resolvers
				resolvers: [
					// auto import icons
					// https://github.com/antfu/unplugin-icons
					IconsResolver({
						prefix: false,
						// enabledCollections: ['carbon']
					}),
				],
			}),

			// https://github.com/antfu/unplugin-icons
			Icons({
				autoInstall: true,
			}),

			// https://github.com/antfu/vite-plugin-vue-markdown
			// Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
			Markdown({
				wrapperClasses: markdownWrapperClasses,
				headEnabled: true,
				markdownItSetup(md) {
					// https://prismjs.com/
					md.use(Prism);
					md.use(LinkAttributes, {
						matcher: (link: string) => /^https?:\/\//.test(link),
						attrs: {
							target: '_blank',
							rel: 'noopener',
						},
					});
				},
			}),

			// https://github.com/antfu/vite-plugin-pwa
			VitePWA({
				registerType: 'autoUpdate',
				includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
				manifest: {
					name: 'Vitesse',
					short_name: 'Vitesse',
					theme_color: '#ffffff',
					icons: [
						{
							src: '/pwa-192x192.png',
							sizes: '192x192',
							type: 'image/png',
						},
						{
							src: '/pwa-512x512.png',
							sizes: '512x512',
							type: 'image/png',
						},
						{
							src: '/pwa-512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any maskable',
						},
					],
				},
			}),

			// https://github.com/intlify/vite-plugin-vue-i18n
			VueI18n({
				runtimeOnly: true,
				compositionOnly: true,
				include: [path.resolve(__dirname, 'locales/**')],
			}),

			// https://github.com/antfu/vite-plugin-inspect
			// Visit http://localhost:3333/__inspect/ to see the inspector
			Inspect({
				enabled: false,
			}),

			// https://github.com/webfansplz/vite-plugin-vue-inspector
			// Inspector({
			//   enabled: false,
			// }),
		],

		// https://github.com/vitest-dev/vitest
		test: {
			include: ['test/**/*.test.ts'],
			environment: 'jsdom',
			deps: {
				inline: ['@vue', '@vueuse', 'vue-demi'],
			},
		},

		// https://github.com/antfu/vite-ssg
		ssgOptions: {
			script: 'async',
			formatting: 'minify',
			onFinished() {
				generateSitemap();
			},
		},

		ssr: {
			// TODO: workaround until they support native ESM
			noExternal: ['workbox-window', /vue-i18n/],
		},
	};
});
