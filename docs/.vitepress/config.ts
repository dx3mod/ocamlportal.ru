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
    outlineTitle: 'Содержание',
    nav: [
      { text: "Главная", link: "/" },
      { text: "Ментейнерам", link: "/maintainers" },
    ],
    sidebar: [
      { text: "Полезные ресурсы", link: "/resources" },
      { text: "Мат. часть", link: "/theory" },
      { text: "Сообщество", link: "/community" },
      {
        text: "В примерах",
        collapsed: false,
        base: "/in-examples/",
        link: "/index",
        items: [
          { text: "JSON", link: "/json" },
          { text: "TCP/IP", link: "/tcp-ip" },
        ]
      },
      {
        text: "Рецепты",
        collapsed: false,
        base: "/recipes/",
        link: "/index",
        items: [
          { text: "Labels", link: "/labels" },
          { text: "Channels", link: "/channels" },
          { text: "Backtrace recording", link: "/backtrace-recording" },
          { text: "Unsafe", link: "/unsafe" },
          { text: "Обработка ошибок", link: "/errors" },
          { text: "Хвостовая рекурсия", link: "/tailcall" },
          { text: "Конструкторы", link: "/constructor" },
          { text: "Параметры выполнения", link: "/runparams" },
          { text: "Performance", link: "/performance" },
          { text: "Публикация пакета", link: "/publish-package" },
          { text: "Без Stdlib", link: "/without-stdlib" },
          { text: "Освобождение ресурсов", link: "/dispose-resources" },
          { text: "Тип &mdash; модуль", link: "/modistype" },
        ],
      },
      {
        text: "Внутренности",
        collapsed: false,
        base: "/internals/",
        items: [
          { text: "Встроенные примитивы", link: "/builtin" },
        ]
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
          { text: "Тулчейн OCaml", link: "/tools/ocaml" },
        ],
      },
      {
        text: "Библиотеки",
        collapsed: false,
        items: [
          { text: "Decoders", link: "/libraries/decoders" },
          { text: "Iter", link: "/libraries/iter" },
          {
            text: "Core",
            link: "/libraries/core",
            collapsed: false,
            items: [
              { text: "Base", link: "/libraries/core/base" },
              { text: "Command", link: "/libraries/core/command" },
            ],
          },
          {
            text: "Сеть",
            collapsed: false,
            items: [
              { text: "Cohttp", link: "/libraries/web/cohttp" },
              { text: "Vkashka", link: "/libraries/web/vkashka" },
              { text: "Nats", link: "/libraries/web/nats-ocaml" },
            ],
          },
          {
            text: "Парсеры",
            collapsed: false,
            items: [
              { text: "Angstrom", link: "/libraries/parsers/angstrom" },
              {
                text: "Eio.Buf_read",
                link: "/libraries/concurrency/eio#buf_read",
              },
              { text: "Rpmfile", link: "/libraries/parsers/rpmfile" },
            ],
          },
          {
            text: "Concurrency",
            collapsed: false,
            items: [
              { text: "Lwt", link: "/libraries/concurrency/lwt" },
              { text: "Eio", link: "/libraries/concurrency/eio" },
            ],
          },
          {
            text: "FFI",
            collapsed: false,
            items: [
              { text: "Ctypes", link: "/libraries/ffi/ctypes" },
            ],
          },
          {
            text: "Графика",
            collapsed: false,
            items: [
              { text: "Tdl", link: "/libraries/graphics/tdl" },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/dx3mod/ocamlportal.ru" },
      { icon: "discord", link: "https://discord.gg/MJvmEsVXk8" },
    ],

    search: {
      provider: "local",
    },
  },
  markdown: {
    theme: {
      light: "kanagawa-lotus",
      dark: "kanagawa-dragon",
    },
  },

});
