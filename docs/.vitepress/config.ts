import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ocamlportal",
  description: "Ресурс по OCaml и его экосистеме.",
  lang: "ru-RU",
  // base: "https://dx3mod.github.io/ocamlportal.ru/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "favicon.ico",
    nav: [
      { text: 'Главная', link: '/' },
      { text: "Ментейнерам", link: "/maintainers" }
    ],
    sidebar: [
      { text: "Полезные ресурсы", link: "/resources" },
      {
        text: "Тулчейн",
        collapsed: false,
        items: [
          { text: "Система сборки Dune", link: "/tools/dune" },
          { text: "Пакетный менеджер OPAM", link: "/tools/opam" }],
      },
      {
        text: "Библиотеки",
        collapsed: false,
        items: [
          { text: "Decoders", link: "/libraries/decoders" }
        ]
      }

    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dx3mod/ocamlportal.ru' }
    ]
  }
})
