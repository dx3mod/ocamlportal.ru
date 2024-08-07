# Base

[Base] &mdash; одна из самых популярных альтернатив стандартной библиотеке OCaml'а. 
Она добавляет значительный функционал, исправляет проблемные места в дизайне, 
а также добавляет больше полиморфных возможностей.

Ее использование в составе [Core](./index.md) полностью раскрывается в книге [RWO](https://dev.realworldocaml.org/).

#### Смотрите также

- [Stdio](https://v3.ocaml.org/p/stdio/latest/doc/Stdio/index.html)
- [ppx_jane](https://github.com/janestreet/ppx_jane)

## Дизайн

Целью Base является быть *портативной заменой* оригинальной стандартной библиотеки,
из-за чего в ней недоступны некоторые I/O функции. Но при необходимости их можно вызвать через модуль `Stdlib`.

### Явный контроль ошибок

Использование монад `Option.t` и `Result.t` является предпочтительным, поэтому все функции Base в случае ошибки
возвращают один из этих типов. 

Но чтобы не быть совсем чопорным, в Base существуют функции-двойники, что возвращают эксепшен. Их можно отличить 
по характерному суффиксу `_exn` в название функции.   

Например:
```ocaml
utop # List.hd [];;
(* - : 'a option/2 = None *)

utop # List.hd_exn [];;
(* Exception: Failure "hd". *)
```

> [!NOTE] Backtrace recording 
> В Base по-умолчанию **включён** [backtrace recording](../../recipes.md#backtrace-recording), в отличие от стандартной библиотек.
> Почему это так можно прочитать [тут](https://discuss.ocaml.org/t/why-isnt-ocaml-recording-bactrace-by-default/9915/4).

### Полиморфное сравнение

Оригинальные операторы сравнения (`=`, `>`, ...) являются операторами *структурного* сравнения представления данных в во время исполнения, что не совсем то, что вы хотели бы.

Поэтому в Base операторы сравнения (глобально) работают только с `int`. Чтобы сравнивать другие типы
вы должны явно использовать соответствующую функцию модуля или оператор. 

Пример:
```ocaml
utop # String.equal "привет" "privet";;
utop # String.("привет" = "privet");;
```

В случае если необходим прям настоящий полиморфизм, то для этого есть модуль `Comparable`.

```ocaml
let max (type t) (module C : Comparable.S with type t = t) = 
    List.reduce ~f:(fun max_val x -> if C.(max_val < x) then x else max_val)
```

## Синтаксические расширения

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