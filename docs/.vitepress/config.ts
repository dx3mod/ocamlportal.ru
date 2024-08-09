import { defineConfig } from "vitepress";

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
      { text: "Главная", link: "/" },
      { text: "Ментейнерам", link: "/maintainers" },
    ],
    sidebar: [
      { text: "Полезные ресурсы", link: "/resources" },
      { text: "Мат. часть", link: "/theory" },
      { text: "Сообщество", link: "/community" },
      {
        text: "Рецепты",
        collapsed: true,
        base: "/recipes/",
        link: "/index",
        items: [
          { text: "Labels", link: "/labels" },
          { text: "Channels", link: "/channels" },
          { text: "Backtrace recording", link: "/backtrace-recording" },
          { text: "Unsafe", link: "/unsafe" },
          { text: "Обработка ошибок", link: "/errors" },
          { text: "Хвостовая рекурсия", link: "/tailcall" },
        ],
      },
      {
        text: "Тулчейн",
        collapsed: false,
        items: [
          { text: "Система сборки Dune", link: "/tools/dune" },
          { text: "Пакетный менеджер OPAM", link: "/tools/opam" },
          { text: "Utop", link: "/tools/utop" },
          { text: "Ocamlformat", link: "/tools/ocamlformat" },
          { text: "Sherlodoc & Sherlocode", link: "/tools/sherlo" },
        ],
      },
      {
        text: "Библиотеки",
        collapsed: false,
        items: [
          { text: "Decoders", link: "/libraries/decoders" },
          {
            text: "Core",
            link: "/libraries/core",
            collapsed: true,
            items: [
              { text: "Base", link: "/libraries/core/base" },
              { text: "Command", link: "/libraries/core/command" },
            ],
          },
          {
            text: "Сеть",
            collapsed: true,
            items: [
              { text: "Cohttp", link: "/libraries/web/cohttp" },
              { text: "Vkashka", link: "/libraries/web/vkashka" },
            ],
          },
          {
            text: "Парсеры",
            collapsed: true,
            items: [
              { text: "Angstrom", link: "/libraries/parsers/angstrom" },
              { text: "Rpmfile", link: "/libraries/parsers/rpmfile" },
            ],
          },
          {
            text: "Concurrency",
            collapsed: true,
            items: [{ text: "Lwt", link: "/libraries/concurrency/lwt" }],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/dx3mod/ocamlportal.ru" },
      { icon: "discord", link: "https://discord.gg/MJvmEsVXk8" },
    ],
  },
  markdown: {
    theme: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
  },
});
