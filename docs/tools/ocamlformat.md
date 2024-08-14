# ocamlformat

[ocamlformat] &mdash; инструмент для автоматического форматирование исходного кода на языке OCaml,
является частью [OCaml Platform](https://ocaml.org/platform). Имеет гибкую конфигурацию и профили,
умеет форматировать комментарии.

## В Dune-проекте

Для использования форматтера в Dune-проекте необходимо в корне проекта создать файл `.ocamlformat`. Его можно оставить пустым и тогда применяться настройки по умолчанию.

Для вызова форматтера используйте команды:

```sh
$ dune fmt
# или
$ dune build @fmt
# watch-режим форматирования
$ dune fmt -w
```

Документация: [How to Set up Automatic Formatting](https://dune.readthedocs.io/en/stable/howto/formatting.html).

## Вне проекта

```sh
$ ocamlformat --enable-outside-detected-project -i *.ml
```

[ocamlformat]: https://github.com/ocaml-ppx/ocamlformat
