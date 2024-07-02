import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ocamlportal",
  description: "Ресурс по OCaml и его экосистеме.",
  lang: "ru-RU",
  // base: "https://dx3mod.github.io/ocamlportal.ru/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Главная', link: '/' },
      { text: "Ментейнерам", link: "/maintainers" }
    ],

    sidebar: [
      { text: "Полезные ресурсы", link: "/resources" },
      {
        text: "Тулчейн",
        collapsed: false,
        items: [{ text: "Система сборки Dune", link: "/tools/dune" }]
      }

    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dx3mod/ocamlportal.ru' }
    ]
  }
})
