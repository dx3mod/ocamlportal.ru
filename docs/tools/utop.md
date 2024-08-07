# Utop

[Utop] &mdash; универсальный [toplevel] (он же REPL) для OCaml. Входит в состав [Platform]
и является стандартом де-факто взамен _из-коробочного_.

Поддерживает редактирование, историю, автокомплиты, цветовые схемы и т.д..

## Использование

| Команда    | Описание                                | Пример                                         |
| ---------- | --------------------------------------- | ---------------------------------------------- |
|            |                                         |                                                |
| `#help`    | Выводит список доступных команд         | `#help;;`                                      |
| `#show`    | Показ сигнатуры (функции, модуля, типа) | `#show List`, `#show Result.iter`, `#show exn` |
| `#require` | Подключает библиотеку                   | `#require "base"`                              |
| `#use`     | Подгружает файл в окружение             | `#use "./some.ml"`                             |

Подробнее в документации.

### Dune

В [Dune](./dune.md)-проекте.

```sh
$ dune utop
```

## Настройка

### Подсветка синтаксиса

Из коробки она выключена, а чтобы её настроить необходимо заполнить профиль: `~/.utoprc` или `~/.config/utoprc`.

Готовый пример вы можете найти тут [utoprc-dark](https://github.com/ocaml-community/utop/blob/master/utoprc-dark).

### Минимализм

Если вы хотите убрать всё лишнею мишуру:

```
utop # #utop_prompt_simple;;
utop # UTop.set_show_box false;;
```

[utop]: https://github.com/ocaml-community/utop
[Platform]: https://ocaml.org/platform
[toplevel]: https://ocaml.org/docs/toplevel-introduction
