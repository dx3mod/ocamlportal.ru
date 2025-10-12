# Rpmfile

[Rpmfile] &mdash; библиотека для чтения [RPM]-пакетов, реализована с использованием [Angstrom](./angstrom.md)
(библиотека парсеров-комбинаторов).

```ocaml
# #require "rpmfile";;

# let pkg =
    In_channel.with_open_bin Sys.argv.(1) Rpmfile.Reader.of_channel
    |> Result.get_ok;;

# Rpmfile.View.name pkg;;
- : string = "hello"
```

Подробнее смотрите в репозитории библиотеки.

> [!NOTE] Документация
>
> - [Страница на OCaml Packages](https://ocaml.org/p/rpmfile)
> - [Репозиторий на GitHub](https://github.com/dx3mod/rpmfile)

> [!WARNING] Версии ниже 0.8 &mdash; deprecated! 

[Rpmfile]: https://github.com/dx3mod/rpmfile
[RPM]: https://ru.wikipedia.org/wiki/RPM
