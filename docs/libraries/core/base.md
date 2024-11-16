---
outline: deep
---

# Base

[Base] &mdash; одна из самых популярных альтернатив стандартной библиотеке OCaml'а. 
Она добавляет значительный функционал, исправляет проблемные места в дизайне, 
а также добавляет больше полиморфных возможностей посредством 

> [!INFO] Изучение
> Ее использование в составе [Core](./index.md) полностью раскрывается в книге [Real World OCaml](https://dev.realworldocaml.org/).

## Дизайн

Целью Base является быть *портативной заменой* оригинальной стандартной библиотеки,
полностью скрывающая оригинальный API,
из-за чего в ней недоступны некоторые I/O функции. Но при необходимости их можно вызвать через модуль `Stdlib` (или старый вариант `Caml`).

Далее опишем особенности использования Base в сравнение с оригинальной Stdlib.

### Явный контроль ошибок

Использование монад `Option.t` и `Result.t` является предпочтительным, поэтому все функции Base в случае ошибки
возвращают один из этих типов. 

Но чтобы не быть совсем чопорным, в Base существуют функции-двойники, что возвращают эксепшен. Их можно отличить 
по характерному суффиксу `_exn` в название функции.   

> [!NOTE] Пример функций-двойников 
> ```ocaml
> utop # List.hd [];;
> (* - : 'a option/2 = None *)
> 
> utop # List.hd_exn [];;
> (* Exception: Failure "hd". *)
> ```

> [!IMPORTANT] Backtrace recording 
> В Base по-умолчанию **включён** [backtrace recording](../../recipes/backtrace-recording.md), в отличие от стандартной библиотек. Поэтому обильное использование исключений может замедлить ваш код.
> 
> Почему это так сделано можно прочитать [тут](https://discuss.ocaml.org/t/why-isnt-ocaml-recording-bactrace-by-default/9915/4). Но очевидно, чтобы пользователь предпочитал 
> монадический способ обработки ошибок. 

Также, конечно, можно делать unwrap (если вы знакомы с Rust, то вам знакомо это понятие), то есть 
достать значение из контейнера, либо упасть с паникой (в случае OCaml'а &mdash; с исключением).

```ocaml
# Error "что-то пошло не так..." |> Result.ok_or_failwith;;
Exception: Failure "что-то пошло не так..."
```

### Явный полиморфизм и модули

Base не рекомендует использовать полиморфные функции сравнения OCaml, которые непоследовательны и чреваты ошибками. Полиморфное сравнение скрыто по умолчанию, и на него нужно явно ссылаться из модуля `Poly`.

Для сравнения значений отличных значений от int предлагают использовать соответствующие функции 
и операторы из модулей типа. 
> [!NOTE] Пример со сравнением строк
> ```ocaml
> utop # String.equal "привет" "privet";;
> utop # String.("привет" = "privet");;
> ```

Если нам требуется полиморфное сравнение, то используйте соответствующий type module, 
(как трейты или интерфейсы в других языках). 

> [!NOTE] Пример полиморфной функции max3
> ```ocaml
> let max3 (type a) (module T : Comparable.S with type t = a) x y z =
>   T.max x (T.max y z)
> ```
> ---
> ```ocaml
> # max3 (module Int) 3 9 4
> ```

В Base очень развито использование функтор для, например, генерации множество функций 
из базового определения. Опять же та же идея, что с трейтами, интерфейсами, классами.  

> [!NOTE] Пример использования функтор для автогенерации функций
> ```ocaml
> (* user.ml *)
> 
> module T = struct
>   type t = { name: string; age: int }
> 
>   let compare ua ub = Int.compare ua.age ub.age
>   let sexp_of_t _ = failwith "..."
> end
> 
> include Comparable.Make (T)
> ```
> 
> :::details Сигнатура
> ```ocaml
> module User :
>   sig
>     module T : sig ... end
>     val ( >= ) : T.t -> T.t -> bool
>     val ( <= ) : T.t -> T.t -> bool
>     val ( = ) : T.t -> T.t -> bool
>     val ( > ) : T.t -> T.t -> bool
>     val ( < ) : T.t -> T.t -> bool
>     val ( <> ) : T.t -> T.t -> bool
>     val equal : T.t -> T.t -> bool
>     val compare : T.t -> T.t -> int
>     val min : T.t -> T.t -> T.t
>     val max : T.t -> T.t -> T.t
>     val ascending : T.t -> T.t -> int
>     val descending : T.t -> T.t -> int
>     val between : T.t -> low:T.t -> high:T.t -> bool
>     val clamp_exn : T.t -> min:T.t -> max:T.t -> T.t
>     val clamp : T.t -> min:T.t -> max:T.t -> T.t Base__.Or_error.t
>     type comparator_witness = Base.Comparable.Make(T).comparator_witness
>     val comparator : (T.t, comparator_witness) Base.Comparator.t
>   end
> ```
> :::


## Полезности


### Открытие Base для всего Dune-проекта

Взято из [основной статьи про Dune](../../tools/dune.md#открытие-модуля-для-всего-проекта).

```Dune
(env (_ (flags (:standard -open Base))))
```

Данное решение позволяет не писать `open Base` в каждом файле вашего проекта. 

### Синтаксические расширения

Благодаря `ppx_jane` можно автогенерировать функции для наших модулей. 

Как пример:
```ocaml
utop # module M = struct
        type t = { id : int; aliases : Set.M(String).t }
        [@@deriving sexp, compare, hash]
      end

module M :
  sig
    type t = { id : int; aliases : Base.Set.M(Base.String).t; }
    val t_of_sexp : Sexp.t -> t
    val sexp_of_t : t -> Sexp.t
    val compare : t -> t -> int
    val hash_fold_t :
      Base_internalhash_types.state -> t -> Base_internalhash_types.state
    val hash : t -> int
  end
```

Пакет `ppx_jane` является эдаким мета-пакетом, в котором просто перечислены [зависимости](https://opam.ocaml.org/packages/ppx_jane/).
Смотрите зависимости, чтобы узнать о всех возможностях. 

[Base]: https://opensource.janestreet.com/base/