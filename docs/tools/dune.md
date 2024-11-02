---
outline: deep
---

# Система сборки Dune

**Dune** - самое популярное решение для сборки OCaml-проектов, оно глубоко интегрировано в экосистему языка, обладает современным функционалом (на подобие инкрементальной сборки, параллельности) и позволяет собирать как исполняемые программы, так и библиотеки, вызывать тесты.

> [!NOTE] Документация
>
> - [Официальный сайт проекта](https://dune.build)
> - Стартовый туториал [Quick start](https://dune.readthedocs.io/en/stable/quick-start.html)
> - [Гайды OCaml Platform](https://ocaml.org/docs/bootstrapping-a-dune-project)

> [!IMPORTANT] Управление зависимостями
> Стоит понимать, Dune не занимается управлением пакетами (зависимостями).
> Для этого используется пакетный менеджер [OPAM](./opam.md).

## Базовые понятия

Разработка происходит в рамках **проекта**, корень проекта определяется по файлу `dune-project`. Проект в свою очередь состоит из **компонентов**.

| Компонент  | Описание                                   | dune              |
| ---------- | ------------------------------------------ | ----------------- |
| Executable | Содержит непосредственно исполняемый код   | `(executable ..)` |
| Library    | Код для использования другими компонентами | `(library ..)`    |
| Test       | Содержит тесты для компонентов             | `(test ..)`       |

### Компоненты

У компонента всегда есть имя (строфа `name`) по которому можно обращаться **внутри** проекта.
Если вы хотите сделать компонент публичным, то вы должны дать ему публичное имя (строфа `public_name`) и указать в качестве пакета в `dune-project` (если требуется).

> [!TIP] Зависимости между компонентами
> Если ваши компоненты зависят друг от друга, то явно указывайте к какому пакету они относятся.
> В противном случае Dune будет выдавать ошибку с просьбой сделать подключаемый компонент публичным
> при попытки подключить приватный библиотечный компонент к публичному библиотечному.

> [!TIP] Публичные имена
> Публичные имена могут иметь символы-разделители, такие как `-` или `.`, использование
> которых является распространенной практикой. 
>
> Пример из [Lwt](../libraries/concurrency/lwt.md):
> ```dune
> (library
>  (name lwt_unix)
>  (public_name lwt.unix)
> ```
> Пример из [Cohttp](../libraries/web/cohttp.md):
> ```dune
> (library
>  (name cohttp_eio)
>  (public_name cohttp-eio)
>  ```


### Приватный библиотечный компонент для библиотечного пакета

Если вы пишите библиотечный пакет и хотите иметь несколько "приватных" компонентов, 
от которых зависите, то вам надо прописать к какому пакету относятся эти компоненты.

```dune
(package <package-name>)
```

:::details Пример

```
.
├── dune-project
├── foo
│   ├── dune
│   └── foo.ml
├── hello_world.opam
└── lib
    └── dune
```

`lib/dune`
```dune
(library
 (public_name hello_world)
 (libraries foo))
```

`foo/dune`
```dune
(library
  (name foo)
  (package hello_world))
```

:::

### Исполняемый и библиотечный компонент с одним именем 

Если вы пишите библиотеку, то может быть удобным также сделать её в виде CLI утилиты. 
Например, CLI утилита для библиотеки HTTP-клиента.

Как это сделать?

:::details Пример 

`lib/dune`
```dune
(library
 (public_name foo))
```

`bin/dune`
```dune
(executable
 (name main)
 (public_name foo)
 (libraries foo))
```

`dune-project`
```dune
...
(package
 (name foo)
 ...)
```

:::

## Автоматическое форматирование

Смотрите статью про форматтер [ocamlformat](./ocamlformat.md).

## Чтения файлов в тестах

Распространённый кейс, когда в тестах вы читаете какой-нибудь файл. Если вы попробуете это сделать, то получите ошибку о том, что файл не найден, ибо этот файл не находится в каталоге `_build`.

Пример каталога с тестом:

```
test/
├── data.test.txt
├── dune
└── test_demo.ml
```

```ocaml
(* test_demo.ml *)
let () = open_in "data.test.txt" |> In_channel.input_all |> print_endline
```

```sh
$ dune runtest
File "test/dune", line 2, characters 7-16:
2 |  (name test_demo))
           ^^^^^^^^^
Fatal error: exception Sys_error("data.test.txt: No such file or directory") # [!code focus]
```

Для исправления этого в файле `dune` вы должны указать зависимости в поле `deps`.

```dune
(test
 (name test_demo)
 (deps data.test.txt)) // [!code ++]
```

Подробнее смотрите в [Dependency Specification](https://dune.readthedocs.io/en/stable/concepts/dependency-spec.html).

## Зависимости при установки

Dune умеет в установку скомпилированных артефактов в систему, но помимо бинарника надо иногда иметь и сторонние ресурсы. Например, HTML-странички в случае веб-сайта.

Для этого существует _строфа_ `install` в `dune` файле. Пример:

```dune
(install
 (files hello.txt)
 (section share)
 (package mypackage))
```

В этом примере файл `hello.txt` будет установлен по пути `<prefix>/share/mypackage`.

За подробностями читайте [мануал](https://dune.readthedocs.io/en/stable/reference/dune/install.html).

## Поддиректории

Если вам нужно иметь внутри _компонента_ древовидную структуру файлов, то об этом надо будет явно сообщить
посредством _строфы_ [`include_subdirs`](https://dune.readthedocs.io/en/latest/reference/dune/include_subdirs.html).

## .opam.template

Если вы используете автогенерацию `.opam` манифеста, то для добавления дополнительных значений (например, `pin-depends`) или переопределения существующих вам нужно создать _шаблонный_ файл, который будет включаться в сгенерированный манифест.

Файл должен называться как `<пакет>.opam.template` (название аналогично `<пакет>.opam`).

Из оф. документации:

> (package) stanzas do not support all opam fields or complete syntax for dependency specifications. If the package you are adapting requires this, keep the corresponding opam fields in a pkg.opam.template file. See [Packages](https://dune.readthedocs.io/en/stable/reference/packages.html).

Смотрите пример использования: [переопределение](https://github.com/mattjbray/ocaml-decoders/blob/master/decoders-msgpck.opam.template), [новые поля](https://github.com/dx3mod/repostbot/blob/master/repostbot.opam.template).

## Интеграция с LSP

Реализация языкового сервера OCaml использует генерируемые при сборки Dune'ой файлы для своей работы.
Это можно заметить при создания нового файла, который редактор будет помечать красным с просьбой обновить кеш (то есть собрать проект для получения необходимой информации о новом файле).

Поэтому для повышения отзывчивости вы можете воспользоваться командой

```sh
$ dune build @check -w
```

## Release-сборка проекта

Можно так, но он вообще работает?

```sh
$ dune build --profile release
# или
$ dune build release
```

::: details Мем

![](../public/memes/how-to-build-release.png)

:::

> [!TIP] Уменьшение размера исполняемого файла
> По-умолчанию при компиляции генерируется много debug-информации, 
> что существенно увеличивает размер исполняемого файла. 
> 
> Убрать её можно при помощи [утилиты `strip`](http://www.linuxlib.ru/manpages/STRIP.1.shtml).
> 
> Также стоит понимать, что компилятор OCaml не обладает большим количеством оптимизаций 
> и возможностей. Для повышения производительности можно использовать [Flambda](https://ocaml.org/manual/5.2/flambda.html) 
> (про [опции сборки компилятора](./ocaml.md#опции-конфигурации)), 
> но оно тоже не столько агрессивно, как GCC.
