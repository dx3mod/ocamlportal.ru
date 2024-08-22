# Eio

[Eio] &mdash; современный основанный на эффектах стек ввода-вывода для OCaml 5.
Предлагает эффективный кроссплатформенный API, например, по работе с файловой системой, сетью, интенсивными CPU вычислениями и параллельностью.

> [!NOTE] Документация
>
> - [Полный гайд с описанием всех возможностей](https://github.com/ocaml-multicore/eio?tab=readme-ov-file#eio--effects-based-parallel-io-for-ocaml)
> - [Документация API](https://ocaml-multicore.github.io/eio/)

## Buf_read

Это модуль для разбора буферизованного ввода. [Документация](https://ocaml-multicore.github.io/eio/eio/Eio/Buf_read/index.html).

### Неполный разбор

Стандартная функция `Buf_read.parse` ожидает, что принимаемый ею парсер читает весь поток данный. Если вы хотите прочитать только часть потока, то необходимо самостоятельно реализовать этот функционал.

Пример реализации:

```ocaml
let of_flow ~initial_size ~max_size flow =
  let buf = Eio.Buf_read.of_flow flow ~initial_size ~max_size in
  Eio.Buf_read.format_errors parser buf
```

[Eio]: https://github.com/ocaml-multicore/eio

### signed/unsigned integers

| Тип      | Знаковость |
| -------- | ---------- |
| `uint8`  | unsigned   |
| `uint16` | unsigned   |
| `uint32` | signed     |
| `uint64` | signed     |

Почему `uint32` и `uint64` знаковые, но помечены как unsigned? У автора по этому безумные [шизомысли](https://discuss.ocaml.org/t/rpmfile-library-v0-3-0-with-new-eio-based-reader/15149/6).

> [!NOTE] Знаковый int8 и int16 своими руками
>
> ```ocaml
> module R = struct
>   include Eio.Buf_read
>
>   (* Простой способ, но не самый эффективный. *)
>
>   let int8 = map (Fun.flip String.get_int8 0) (take 1)
>   let int16_be = map (Fun.flip String.get_int16_be 0) (take 2)
> end
> ```
