# Utop

[Utop] &mdash; универсальный [toplevel] (он же REPL) для OCaml. Входит в состав [Platform]
и является стандартом де-факто взамен *из-коробочного*.

Поддерживает редактирование, историю, автокомплиты, цветовые схемы и т.д..


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