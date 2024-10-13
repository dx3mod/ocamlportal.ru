# Сборка программы без Stdlib

> [!NOTE] Ссылки
> - [Discuss. Build a project without Stdlib](https://discuss.ocaml.org/t/build-a-project-without-stdlib/15374)

Для отключения стандартной библиотеки можно использовать недокументированные возможности, 
а именно флаги `-nostdlib` и `-nopervasives`. Смотрите [репозиторий](https://github.com/dx3mod/ocaml-without-stdlib).

:::details Ручная сборка
```sh
$ ocamlopt -nopervasives -cclib -lasmrun -ccopt "-lm -ldl" -- main.ml
```
:::