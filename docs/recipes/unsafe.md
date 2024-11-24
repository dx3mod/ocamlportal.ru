---
outline: [2,3]
---

# Unsafe

В стандартной библиотеке можно встретить `unsafe_` функции, такие функции ориентированны на опытных пользователей и при правильном использование способы повысить производительность за счёт ручного контроля.

> [!IMPORTANT] Преждевременная оптимизация
>
> > Преждевременная оптимизация — корень всех зол.
>
> Старайтесь покрывать тестами участки кода, зависимые от unsafe преобразований.

## Zero-cost преобразование

Основной паттерн таких функций это понятие _владения_ (или уникальности), которое мы должны гарантировать.

Типичный пример &mdash; мы хотим преобразовать `bytes` в строку. Если воспользоваться функцией `Bytes.to_string`, то она создаст копию, преобразует её в строку и вернёт эту копию.

> [!NOTE] Почему жто так?
> Дело в том, что `bytes` это изменяемая (mutable) структура данных, а строки &mdash; нет. Из-за чего если мы не скопируем значение, то при изменение `bytes` будет изменяться и строка, а это не то поведение, что мы хотели бы, это было бы нарушением абстракций.
>
> Демонстрация:
>
> ```ocaml
> let () =
>   let b = Bytes.make 10 'a' in (* "aaaaaaaaaa" *)
>   let s = string_of_bytes b in (* "aaaaaaaaaa" *)
>
>   Bytes.set b 2 'B';
>
>   print_endline s (* aaBaaaaaaa *)
> ```

Но если мы **уверены** и готовы **гарантировать**, что исходный объект не будет изменяться, то можем сделать `unsafe_to_string`, которые не произведет никаких новых выделений памяти, а просто вернёт новый тип для того же объекта.

## Unchecked

Другой распространённый паттерн &mdash; unchecked операции, такие операции не производят никаких runtime проверок и всю обязанность перекладывают на пользователя.

### Операции с коллекцией

Пример с массивом:
```ocaml
let () =
  let arr = [|"первый"; "второй" |] in
  print_endline @@ Array.unsafe_get arr 3;
  Array.unsafe_set arr 3 "третий";
  print_endline @@ Array.unsafe_get arr 3
```

> [!TIP] Итерация
> По возможности используйте итерацию, а не явный цикл.

::: details В ассемблере
Unchecked.

```ocaml
let x = Array.unsafe_get arr 1
(* movq    8(%rax), %rax *)
```

Checked.

```ocaml
let x = arr.(1)
(* movq    -8(%rax), %rbx
   cmpq    $2047, %rbx
   jbe     .L104
   movq    8(%rax), %rax *)
```

:::

### Флаг `-unsafe`

При использовании этого флага отключаются проверки при обращение по индексу через конструкции `v.(i)` и `s.[i]`. При компиляции в нативный код также отключается проверка деления на ноль. 

## Внутренние представление

В стандартной библиотеке есть модуль [`Obj`](https://ocaml.org/manual/api/Obj.html) дающий операции над 
внутреннем представлением OCaml-значений. Not for the casual user!

> [!INFO] Мат. часть
> Смотрите [RWO, Memory Representation of Values](https://dev.realworldocaml.org/runtime-memory-layout.html) и [Interfacing C with OCaml](https://ocaml.org/manual/intfc.html). 

### Transmute

Мы можем интерпретировать одно значение как другое, либо преобразовать его в полиморфную форму, 
посредством функции `Obj.magic`:

```ocaml
# Obj.magic 121;;
- : 'a = <poly>
```
```ocaml
# (Obj.magic 121 : char);;
- : char = 'y'
```
```ocaml
# (Obj.repr 121 |> Obj.obj : char);;
- : char = 'y'
```

Это может быть нужно, чтобы местами сломать систему типов для реализации каких-нибудь 
умных или не очень умных вещей.

#### Юзкейсы

> [!NOTE] Примеры в реальном мире
> - [Abuse системы типов в библиотеке Lwt](https://github.com/ocsigen/lwt/blob/master/src/core/lwt.ml#L311);

Одно из адекватных случаев применения &mdash; приведения типов, которые невозможно 
провернуть стандартными средствами.  

```ocaml
type incomplete = [ `A | `B of unit | `C of int ]

type complete = [ `A | `B of unit | `C of string ]

let transform : incomplete -> complete = function 
  | `C x -> `C (string_of_int x)
  | other -> Obj.magic other
```

```ocaml
let int_of_fd : Unix.file_descr -> int = Obj.magic
and fd_of_int : int -> Unix.file_descr = Obj.magic
```