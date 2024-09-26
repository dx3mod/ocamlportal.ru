# Пакетный менеджер OPAM

[OCaml Package Manager](https://opam.ocaml.org/) (или просто OPAM) &mdash; пакетный менеджер для OCaml,
управляющий пакетами в их исходном виде (в виде исходников), является частью [OCaml Platform](https://ocaml.org/platform),
как и [Dune](./dune.md).

Через него можно поставить компилятор и всё остальное.

::: details Опыт использования OPAM
![](https://i.ibb.co/Q6YSgG3/photo-2024-07-05-23-01-27.jpg)
:::

> [!NOTE] Документация
> 
> - [Управление зависимостями](https://ocaml.org/docs/managing-dependencies)
> - [Using opam](https://opam.ocaml.org/doc/Usage.html) &mdash; всё что нужно знать, чтобы использовать
> - Полный [мануал](https://opam.ocaml.org/doc/Manual.html) с описанием всех возможностей

## Обновление пакетов

```sh
$ opam update
$ opam upgrade
```

Могут возникать ошибки, из-за конфликта версий, но тут остается страдать.

## Установка зависимостей проекта

Если проект имеет OPAM-манифест, то вы можете установить зависимости прописанные в нём, 
используя следующую команду:

```sh
$ opam install . --deps-only
```

## Окружения (они же switches)

OPAM хранит компилятор и пакеты в окружениях, называемые `switch`. При стандартной установки у вас должно появиться глобальное `default` окружение.

> [!NOTE] Работа с окружениями
> Для работы с окружениями используйте команды из подгруппы `opam switch`.

### Локального окружения для проекта

Распространенная задача, если у нас некий проект и мы хотим иметь специфичный набор пакетов, определённый компилятор и т.д.
В случае если у нас есть OPAM-манифест, мы можем создать локальное окружение следующей командой:

```sh
$ opam switch create . --deps-only
```

## Публикация пакета

Смотрите [тут](../recipes/publish-package.md).

## Зависимости

### pin-depends

Если вы хотите _запинить_ зависимость в вашем пакете, то вы должно прописать поле `pin-depends` в ваш `.opam` манифест (для [Dune](./dune.md#opam-template) смотрите `.opam.template`).

Пример добавления библиотеки [vkashka](../libraries/web/vkashka.md) с Git репозитория:

```opam
pin-depends: [
  [ "vkashka.dev" "git+https://github.com/dx3mod/vkashka.git" ]
]
```

Оф. документация: <https://opam.ocaml.org/doc/Manual.html#opamfield-pin-depends>.
