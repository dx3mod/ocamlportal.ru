# Пакетный менеджер OPAM

[OCaml Package Manager](https://opam.ocaml.org/) (или просто OPAM) &mdash; пакетный менеджер для OCaml,
управляющий пакетами в их исходном виде (в виде исходников), является частью [OCaml Platform](https://ocaml.org/platform), 
как и [Dune](./dune.md). 

Через него можно поставить компилятор и всё остальное.

::: details Опыт использования OPAM
![](https://i.ibb.co/Q6YSgG3/photo-2024-07-05-23-01-27.jpg)
:::

### Документация

- [Using opam](https://opam.ocaml.org/doc/Usage.html) &mdash; всё что нужно знать, чтобы использовать;
- Полный [мануал](https://opam.ocaml.org/doc/Manual.html) с описанием всех возможностей;

## Обновление пакетов

```sh
$ opam update
$ opam upgrade
```
Могут возникать ошибки, из-за конфликта версий, но тут остается страдать.

## Окружения (они же switches)

OPAM позволяет управляться виртуальными окружениями, которые называются `switch`. 
Из коробки у нас всегда есть `default` окружение, оно же глобальное. 

### Создание локального окружения для проекта

Распространенная задача, если у нас некий проект и мы хотим иметь специфичный набор пакетов, определённый компилятор и т.д.
В случае если у нас есть OPAM-манифест, мы можем создать локальное окружение следующей командой:

```sh
$ opam switch create . --deps-only
```

## Публикация пакета

Центральный репозиторий пакетов для OCaml называется [opam-repository](https://github.com/ocaml/opam-repository) и является GitHub-репозиторием, содержащий файлы манифестов. 

Чтобы опубликовать ваш проект в opam-репозитории и сделать его общедоступным вам потребуется:

1. Во-первых манифест проекта, файл [`<название-проекта>.opam`](https://opam.ocaml.org/doc/Packaging.html#Creating-a-package-definition-file). Самый простой и современный способ его получить &mdash; использовать [Dune](./dune.md);
2. Во-вторых GitHub-аккаунт для работы с репозиторием и [настроенные SSH-ключи](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent);
3. Ну и Git само собой... 

Официальный гайд доступен [тут](https://opam.ocaml.org/doc/Packaging.html#Creating-a-package-definition-file).

### Принцип

Внесение проекта в opam-репозиторий происходит посредством добавления файла манифеста в дерево репозитория. 
Например, манифест проекта с название `xyz` и версией `1.2.3` будет располагаться по пути `packages/xyz/xyz.1.2.3/opam`. 

У такого манифеста должно быть указано поле `url` с информацией откуда достать исходный код проекта:
```opam
url {
  src: "https://address/of/project.1.0.tar.gz"
  checksum: "md5=3ffed1987a040024076c08f4a7af9b21"
}
``` 

### opam-publish

К счастью, для автоматизации сего процесса есть специальная утилита `opam-publish`, плагин к `opam`. 
Достаточно создать тег для фиксации последней версии проекта и выполнить команду `opam publish`.

Пример из документации:
```sh
$ git tag -a 0.1 
$ git push origin 0.1

$ opam publish
```

После чего утилита попросит ввести GitHub-токен, она сделает форк opam-репозитория и создаст pull-request (PR), где начнется автоматизированное тестирования на сборку платформой [ocaml-ci](https://ocaml.ci.dev/). 

### Принятие 

После того как вы исправите все свои косяки, ваш PR сольют с репозиторием и вы сможете установить 
пакет обычным `opam install`. 

## Зависимости

### pin-depends

Если вы хотите *запинить* зависимость в вашем пакете, то вы должно прописать поле `pin-depends` в ваш `.opam` манифест (для [Dune](./dune.md#opam-template) смотрите `.opam.template`).

Пример добавления библиотеки [vkashka](../libraries/web/vkashka.md) с Git репозитория:
```opam
pin-depends: [
  [ "vkashka.dev" "git+https://github.com/dx3mod/vkashka.git" ]
]
```

Оф. документация: <https://opam.ocaml.org/doc/Manual.html#opamfield-pin-depends>.