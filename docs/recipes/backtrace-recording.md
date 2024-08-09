# Backtrace recording

По-умолчанию отслеживание бектрейса исключений **выключено**.

> [!IMPORTANT] Вопрос производительности
> Включение _backtrace recording_ может сказаться на производительности при обильном использование исключений в вашей программе.

> [!TIP] Рекомендации
> Используйте backtrace recording исключительно во время разработки.

Чтобы включить отслеживание можно воспользоваться переменной окружения, либо явно вызвав функцию в коде.

```sh
# in shell
$ OCAMLRUNPARAM=b ocaml main.ml
```

```ocaml
(* in code *)
Printexc.record_backtrace true
```

> [!NOTE] Результат
> До и после.
>
> ```
> Fatal error: exception Not_found
>
> Fatal error: exception Not_found
> Raised at Dune__exe__Main in file "bin/main.ml", line 6, characters 8-23
> ```