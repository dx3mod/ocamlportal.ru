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
          { text: "Decoders", link: "/libraries/decoders" },
          {
            text: "Core", link: "/libraries/core", collapsed: false, items: [
              { text: "Base", link: "/libraries/core/base" },
              { text: "Command", link: "/libraries/core/command" }
            ]
          },
          {
            text: "Сеть", collapsed: false, items: [
              { text: "Cohttp", link: "/libraries/web/cohttp" },
              { text: "Vkashka", link: "/libraries/web/vkashka" },
            ]
          },
          {
            text: "Парсеры", collapsed:false,items:[
              { text: "Angstrom", link: "/libraries/parsers/angstrom" },
              
            ]
          }

        ]
      }

    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dx3mod/ocamlportal.ru' },
      { icon: "discord", link: "https://discord.gg/MJvmEsVXk8" }
    ]
  }
})
