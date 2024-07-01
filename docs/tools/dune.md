# Система сборки Dune

**Dune** - самое популярное решение для сборки OCaml-проектов, оно глубоко интегрировано в экосистему языка,
обладает современным функционалом (на подобие инкрементальной сборки, параллельности) и позволяет собирать
как исполняемые программы, так и библиотеки, вызывать тесты.

## Базовые понятия 

Проекты Dune состоят из компонентов. Компонент может быть 
- **Исполняемым** (executable)
- **Библиотечным** (library)
- **Тестом** (test)

Проект содержит один или более компонент любого типа, которые могут зависеть друг от друга.

Эти компоненты могут быть объеденины в пакеты для [OPAM](./opam.md).
Для их последующего распространения.

<!-- Внутри проекта может находиться сколько угодно подобных компонентов, которые 
могут быть объеденины в пакеты (package) для [OPAM](./opam.md). Определяемых 
пакетов тоже может быть множество. -->

## Работа с Dune

### Создание проекта

Для создания проекта можно воспользоваться командой `dune init`:
```sh
$ dune init project demo
```

- где `demo` название проекта (название может содержать только буквы английского алфавита, цифры и символ нижнего подчёркивания)

### Типичная структура 

```
demo/
├── bin
│   ├── dune
│   └── main.ml
├── demo.opam
├── dune-project
├── lib
│   └── dune
└── test
    ├── dune
    └── test_demo.ml
```

#### `dune-project`

Корневой файл конфигурации проекта, в нём описываются пакеты 
и другая информация. Для сборки проекта на самом деле достаточна иметь только первую строчку, указывающая версию, если нам не нужен OPAM-файл.

```dune_project
(lang dune 3.16)

(name demo)

(generate_opam_files true)

(source
 (github username/reponame))

(authors "Author Name")

(maintainers "Maintainer Name")

(license LICENSE)

(documentation https://url/to/documentation)

(package
 (name demo)
 (synopsis "A short synopsis")
 (description "A longer description")
 (depends ocaml dune)
 (tags
  (topics "to describe" your project)))
```

#### `bin`, `lib`, `test`

Всё это компоненты, для них можно видеть характерный файл `dune`.

##### `bin`

```dune
(executable
 (public_name demo)
 (name main)
 (libraries demo))
```

##### `lib`

```dune
(library
 (name demo))
```

##### `test`

```dune
(test
 (name test_demo))
```



<!-- - `dune-project` к;
- `demo.opam` манифест OPAM пакета, он автоматически создается при сборки проекта;  -->