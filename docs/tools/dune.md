---
outline: deep
---

# Система сборки Dune

[Dune] &mdash; composable система сборки OCaml-проектов, ныне является стандартом, входящим в список OCaml Platform. Помимо самой сборки проектов
обладает богатым функционалом по работе с экосистемой языка и другими инструментарием.

> [!NOTE] Как начать использовать?
> Рекомендуем начать с туториала [Your First OCaml Program](https://ocaml.org/docs/your-first-program), 
> после чего обращаться к [документации](https://dune.readthedocs.io) для получения полной справки.

> [!IMPORTANT] Управление зависимостями
> Стоит понимать, Dune не занимается управлением пакетами (зависимостями).
> Для этого используется пакетный менеджер [OPAM](./opam.md).

> [!TIP] Видео-иллюстрация из серии OCaml Tips
> 
> *TODO*
>
> Смотреть ~~на Youtube~~.


## Mental Model

Зачастую разработка большинства проектов происходит в рамках самодостаточного **Dune-проекта** (существует также Dune-workspace &mdash; множество связанных Dune-проектов), 
корень которого определяется по файлу `dune-project`.

 Проект в свою очередь состоит из **компонентов**.
| Компонент  | Описание                                   | dune              |
| ---------- | ------------------------------------------ | ----------------- |
| Executable | Содержит непосредственно исполняемый код   | `(executable ..)` |
| Library    | Код для использования другими компонентами | `(library ..)`    |
| Test       | Содержит тесты для компонентов             | `(test ..)`       |

### Компоненты

У компонента всегда есть имя (строфа `name`) по которому можно обращаться **внутри** проекта.
Если вы хотите сделать компонент публичным (дать доступ к нему не только в рамках проекта), то вы должны дать
ему публичное имя (строфа `public_name`) и, если требуется, указать в качестве пакета в `dune-project` или напрямую в `.opam` манифесте.

> [!TIP] Зависимости между компонентами
> Если ваши приватные компоненты зависят друг от друга, то явно указывайте к какому пакету они относятся!
> В противном случае Dune будет выдавать ошибку с просьбой сделать подключаемый компонент публичным
> при попытки подключить приватный библиотечный компонент к публичному библиотечному.

#### Публичные имена

Публичные имена могут иметь символы-разделители, такие как `-` или `.`, использование
которых является распространенной практикой. 

> [!NOTE] Примеры из экосистемы
> Пример из [Lwt](../libraries/concurrency/lwt.md):
> ```Dune
> (library
>  (name lwt_unix)
>  (public_name lwt.unix)
> ```
> Пример из [Cohttp](../libraries/web/cohttp.md):
> ```Dune
> (library
>  (name cohttp_eio)
>  (public_name cohttp-eio)
>  ```

Разница между `-` и `.` заключается в том, что `.` не может быть применен в качестве имени для отдельного пакета, 
точка обозначает *поддиректность* к проекту.

#### Приватный библиотечный компонент для библиотечного пакета

Если вы пишите библиотечный пакет и хотите иметь несколько "приватных" компонентов, 
от которых зависите, то вам надо прописать к какому пакету относятся эти компоненты.

```
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
```Dune
(library
 (public_name hello_world)
 (libraries foo))
```

`foo/dune`
```Dune
(library
  (name foo)
  (package hello_world))
```

:::

#### Исполняемый и библиотечный компонент с одним именем 

Если вы пишите библиотеку, то может быть удобным также сделать её в виде CLI утилиты. 
Например, CLI утилита для библиотеки HTTP-клиента.

Как это сделать?

:::details Пример 

`lib/dune`
```Dune
(library
 (public_name foo))
```

`bin/dune`
```Dune
(executable
 (name main)
 (public_name foo)
 (libraries foo))
```

`dune-project`
```
...
(package
 (name foo)
 ...)
```

:::

### Правила и Действия

Разговор про компоненты это разговор в самой высокой плоскости, более фундаментальными абстракциями для Дюны в конечном счете являются
так называемые rules (правила).

> A rule reads dependencies and writes targets using an action (and it can be attached to aliases).

> [!NOTE] Пример простого правила
> ```dune
> (rule
>  (target a.out)
>  (deps main.ml)
>  (action
>   (run ocamlopt main.ml)))
> ```

Правила могут зависеть от других правил и исполняются они при этом инкрементально, то есть исполняются при изменении своих зависимостей. 

## Platform-depend select

Если у вас есть логика, зависящая от конкретной платформой, то смотрите возможность [Alternative Dependencies](https://dune.readthedocs.io/en/stable/reference/library-dependencies.html#alternative-dependencies), select-механизм.

```dune
(select <target-filename> from
 (<literals> -> <filename>)
 (<literals> -> <filename>)
 ...)
```

> [!NOTE] Пример из экосистемы
> [ocaml-crypt](https://github.com/vbmithr/ocaml-crypt) &mdash; A tiny binding for the unix crypt function. 
> 
> ```dune
> (library
>  (public_name crypt)
>  (libraries
>   (select
>    ffi.ml
>    from
>    (if_is_linux_or_freebsd -> ffi.posix.extended.ml)
>    ...
>   ...)
> 
> (library
>  (name if_is_linux_or_freebsd)
>  (modules)
>  (package crypt)
>  (enabled_if
>   (or
>    (= %{system} "linux")
>    (= %{system} "freebsd"))))
> ```

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

```Dune
(test
 (name test_demo)
 (deps data.test.txt)) // [!code ++]
```

Подробнее смотрите в [Dependency Specification](https://dune.readthedocs.io/en/stable/concepts/dependency-spec.html).

## Зависимости при установки

Dune умеет в установку скомпилированных артефактов в систему, но помимо бинарника надо иногда иметь и сторонние ресурсы. Например, HTML-странички в случае веб-сайта.

Для этого существует _строфа_ `install` в `dune` файле. Пример:

```Dune
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

## Открытие модуля для всего проекта

Тоже самое, что `ocamlc -open <module>`. Может быть полезным, например, при использовании 
альтернативной стандартной библиотеке, вроде [Base](../libraries/core/base.md).

```Dune
(env (_ (flags (:standard -open Base))))
```

## Встраивание ресурсов

<https://dune.readthedocs.io/en/latest/howto/bundle.html>

::: code-group

```dune [dune]
(rule
 (with-stdout-to
  css.ml
  (progn
   (echo "let css = {|")
   (cat resources/site.css)
   (echo "|}"))))
```

```console [tree]
$ tree src
src
└── lib
    └── my_lib
        ├── dune
        └── resources
            └── site.css
```

```ocaml [code]
let () = Printf.printf "%s" Css.css
```

:::

Смотрите также про [установку зависимых артефактов](#зависимости-при-установки). 

## Загрузка printers в Toplevel

Смотрите также [UTop printers](./utop.md#свои-printers).

::: code-group
```ocaml [install_printers.ml]
let eval code =
  let as_buf = Lexing.from_string code in
  let parsed = !Toploop.parse_toplevel_phrase as_buf in
  ignore (Toploop.execute_phrase true Format.std_formatter parsed)

let () =
  eval {|#require "yourlib";;|};
  eval "#install_printer yourlib.pp_something;;"
```

```dune
(library
 (name lib_top)
 (public_name lib.top)
 (modes byte)
 (wrapped false)
 (libraries compiler-libs.common))
```
:::

## Перевод некоторых ошибок в предупреждения

Dune по-умолчанию очень строг, но иногда хотелось бы сделать его мягче. Например,
разрешить `unused-var-strict`, `unused-value-declaration` и т.д.. 

Это можно сделать при помощи флага `-warn-error`:
```Dune
(env (dev (flags :standard -warn-error -27-32)))
```

> [!NOTE] Смотрите также
> - [How to Turn Specific Errors into Warnings](https://dune.readthedocs.io/en/stable/faq.html#how-to-turn-specific-errors-into-warnings)
> - [Warning reference](https://ocaml.org/manual/comp.html#s:comp-warnings)

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


[Dune]: https://dune.build