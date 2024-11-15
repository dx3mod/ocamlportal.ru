# Тип &mdash; модуль 

Для OCaml хорошей практикой является оборачиванием типа в модуль с определениям типа 
и функциями по его созданию, обработки.

Так как модули является не только средством пространства имён, но и средством инкапсуляции
посредством сигнатур.

Общая практика состоит в том, что мы называем модуль названием типа, а внутри модуля определяем 
тип с именем `t` (сокращение от type  соответственно). Следование этому соглашению обеспечивает 
совместимость при работе с функторами и всем таким.

Если в одном модуле всё таки присутствует несколько определений типов, то к функциям по работе с ними 
добавляются суффиксы с названием типа (как в первом "плохом" примере). 

> [!INFO] Требования по знаниям
> - Language documentation: [Modules](https://ocaml.org/docs/modules)

## Пример

### Плохо

```ocaml
(* lib.ml *)

type user = { name: string; age: int }

let make_user ~name ~age = 
  assert (age > 0);
  { name; age }

let pp_user fmt { name; age } = 
  Format.fprintf fmt "User('%s', %d)" name age 
```

### Лучше

```ocaml
(* user.ml *)

type t = { name: string; age: int }

let make ~name ~age = 
  assert (age > 0);
  { name; age }

let pp fmt { name; age } = 
  Format.fprintf fmt "User('%s', %d)" name age 
```

```ocaml
(* user.mli *)

type t = private { name : string; age : int; }

val make : name:string -> age:int -> t
val pp : Format.formatter -> t -> unit
```

> [!INFO] Смотрите также 
> - [Сигнатуры модулей](https://ocaml.org/manual/moduleexamples.html#s%3Asignature) &mdash; описание возможностей сигнатур;
> - [Private types](https://ocaml.org/manual/privatetypes.html) &mdash; пояснение про ключевое слово `private`;


## В функторах

> [!NOTE] Пример c модулем Map
> ```ocaml
> module IntMap = Map.Make (Int)
> ```

Глупый пример из пальца:
```ocaml
(* list.ml *)

module Make (Item : sig type t end) = struct
  type t = Item.t list
end
```

```ocaml
module Users = List.Make (User)
```