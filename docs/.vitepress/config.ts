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
      { text: "Ментейнерам 🫂", link: "/maintainers" },
      { text: "Туториал 🐤", link: "/tutor" }
    ],
    sidebar: [
      { text: "Полезные ресурсы", link: "/resources" },
      { text: "Сообщество", link: "/community" },
      { text: "Guidelines", link: "https://ocaml.org/docs/guidelines" },
      {
        text: "Рецепты",
        base: "/recipes/",
        link: "/index",
        items: [
          // { text: "Labels 🏷️", link: "/labels" },
          // { text: "Channels", link: "/channels" },
          { text: "Обработка ошибок", link: "/errors" },
          { text: "Параметры выполнения", link: "/runparams" },
          {
            text: "Performance", link: "/performance", collapsed: false, items: [
              { text: "Хвостовая рекурсия", link: "/tailcall" },
              { text: "Unsafe", link: "/unsafe" },
              { text: "Backtrace recording", link: "/backtrace-recording" },

            ]
          },
          {

            text: "OPAM репозиторий",
            items: [
              {
                text: "Публикация пакета", link: "/publish-package"
              },
              {
                text: "Ведение пакета", link: "/package-maintenance"

              },
            ]
          },

          { text: "Без Stdlib", link: "/without-stdlib" },
          { text: "Освобождение ресурсов", link: "/dispose-resources" },
          {
            text: "Модули", collapsed: false, items: [
              { text: "Тип - модуль", link: "/modistype" },
              { text: "Конструкторы", link: "/constructor" },

            ]
          },
          { text: "Работа с байтами", link: "/working-with-bytes" },
          { text: "Абстрагирование IO", link: "/agnostic-io" },
          { text: "C interfacing", link: "/interfacing-c" }
        ],
      },
      {
        text: "Топики",
        base: "/topics/",
        collapsed: true,
        items: [
          { text: "Синтаксический анализ", link: "syntax-analyze" },
          { text: "Interfacing C with OCaml", link: "ffi" },
        ]
      },
      // {
      //   text: "Статьи",
      //   base: "/articles/",
      //   // link: "/articles",
      //   collapsed: false,
      //   items: [
      //     { text: "Парсеры комбинаторы с нуля", link: "/write-parsers-combs-lib" },

      //   ]
      // },
      {
        text: "Внутренности",
        base: "/internals/",
        items: [
          { text: "Встроенные примитивы", link: "/builtin" },
        ]
      },
      {
        text: "Тулчейн",
        items: [
          { text: "Система сборки Dune", link: "/tools/dune" },
          { text: "Пакетный менеджер OPAM", link: "/tools/opam" },
          { text: "Universal Toplevel (UTop)", link: "/tools/utop" },
          { text: "Ocamlformat", link: "/tools/ocamlformat" },
          { text: "Sherlodoc & Sherlocode", link: "/tools/sherlo" },
          { text: "Тулчейн OCaml", link: "/tools/ocaml" },
        ],
      },
      {
        text: "Библиотеки",
        collapsed: true,
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
      { text: "Мат. часть", link: "/theory" },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/dx3mod/ocamlportal.ru" },
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
