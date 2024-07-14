# Core.Command

Модуль `Command` нужен для разбора аргументов командой строки (CLI),
имеет очень удобный декларативный интерфейс, но не самую лучшую реализацию.

В RWO использованию этого модуля повещена отдельная глава [Command-Line Parsing](https://dev.realworldocaml.org/command-line-parsing.html). Иной документации нету.

Штука мощнее, чем [`Arg`](https://ocaml.org/manual/api/Arg.html), но ощущается убого:
ужаснейший вывод ошибок (его нет); длинные флаги, начинающиеся с одного `-` (например, `-help`, хотя `--help` он тоже скушает).   

## Пример

```ocaml
open Core

let do_hash file =
  Md5.digest_file_blocking file |> Md5.to_hex |> print_endline

let command =
  Command.basic
    ~summary:"Generate an MD5 hash of the input data"
    ~readme:(fun () -> "More detailed information")
    (let%map_open.Command filename =
       anon (maybe ("filename" %: string))
     in
     fun () -> do_hash filename)

let () = Command_unix.run ~version:"1.0" ~build_info:"RWO" command
```


## Альтернативы

- [`Cmdliner`](../cli/cmdliner.md) &mdash; мощнейший комбайн для тех, кто понял как его использовать, для остальных это непонятное overengineering поделие от сумасшедших.   
- [`Arg`](https://ocaml.org/manual/api/Arg.html) &mdash; для простых интерфейсов, где надо принять пару флагов, наиболее удачное решение.
