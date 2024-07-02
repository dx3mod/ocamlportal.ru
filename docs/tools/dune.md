# Система сборки Dune

**Dune** - самое популярное решение для сборки OCaml-проектов, оно глубоко интегрировано в экосистему языка, обладает современным функционалом (на подобие инкрементальной сборки, параллельности) и позволяет собирать как исполняемые программы, так и библиотеки, вызывать тесты.

- [Quick start](https://dune.readthedocs.io/en/stable/quick-start.html)

Стоит понимать, Dune не занимается управлением пакетами (сторонних библиотек), она способна только их подключать.
Для управления же используется пакетный менеджер [OPAM](./opam.md).


## Базовые понятия 

Проекты Dune состоят из компонентов. Компонент может быть 
- **Исполняемым** (executable)
- **Библиотечным** (library)
- **Тестом** (test)

Проект содержит один или более компонент любого типа, которые могут зависеть друг от друга.

Эти компоненты могут быть объеденины в пакеты для их последующего распространения.

## Автоматическое форматирование

Для этого у вас должен быть установлен [`ocamlformat`](https://github.com/ocaml-ppx/ocamlformat).
```sh
$ opam install ocamlformat
```

После чего в корень проекта добавьте файл `.ocamlformat`:
```sh
$ touch .ocamlformat
```

Этого достаточно, чтобы использовалось автоформатирование командами:
```sh
$ dune fmt # или dune build @fmt
```

Для настройки профиля и версии смотрите [документацию](https://dune.readthedocs.io/en/stable/howto/formatting.html).

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

Для этого существует *строфа* `install` в `dune` файле. Пример:

```dune
(install
 (files hello.txt)
 (section share)
 (package mypackage))
```
В этом примере файл `hello.txt` будет установлен по пути `<prefix>/share/mypackage`. 

За подробностями читайте [мануал](https://dune.readthedocs.io/en/stable/reference/dune/install.html).