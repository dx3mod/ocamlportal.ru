# Performance

Стоит понимать, что оптимизирующий компилятор OCaml'а хоть и имеет под собой достаточно теории,
но всё равно не сравниться с LLVM или GCC.

> [!NOTE] Документация 
> 
> - [OCaml guide: Profiling](https://ocaml.org/docs/profiling) 

## Сборка с оптимизациями 

Смотрите [Release-сборка проекта](../tools/dune.md#release-сборка-проекта) и [flambda](https://ocaml.org/manual/flambda.html).

## Склейка строк

Если вам требуется склеить больше двух строк &mdash; не используйте оператор `Stdlib.(^)`.
Заместо него используйте модули `Format`, `Printf` или подобное.

> [!NOTE] Пример
> 
> ```ocaml
> (* Плохо! *)
> let greet name = 
>   (* Почему: две аллокации (по одной на каждую склейку) *)
>   print_endline @@ "Привет, " ^ name ^ "!"
> 
> (* Хорошо *)
> let greet name = 
>   (* Почему: примерно одна аллокация *)
>   Printf.printf "Привет, %s!\n" name
> ```

Компилятор никак не сворачивает строковые константы, то есть склейка констант производится в рантайме!
Будьте осторожны.

:::details Микрооптимизации 

Использование буфера дает явный контроль над выделением памяти.

```ocaml
let greet name = 
  let buf = Buffer.create (16 + String.length name) in 
  Buffer.add_string buf "Привет, ";
  Buffer.add_string buf name;
  Buffer.add_string buf "!\n";
  Buffer.output_buffer stdout buf
```

:::