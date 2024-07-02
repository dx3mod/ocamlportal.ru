# Декодирование с помощью decoders

[Decoders](https://github.com/mattjbray/ocaml-decoders) &mdash; это библиотека комбинаторов для декодировать JSON-подобных структур 
в пользовательские типы. 

Есть драйвера для JSON, S-выражений, MessagePack, CBOR и Bencode.


## Пример

```ocaml
module D = Decoders_yojson.Basic.Decode;;

type my_user =
  { name : string
  ; age : int
  }

let my_user_decoder : my_user decoder =
  let open D in
  let* name = field "name" string in
  let* age = field "age" int in
  succeed { name; age }

D.decode_string my_user_decoder {| { "name": "Артём", "age": 17 } |}
(*  - : (my_user, D.error) result =
    Decoders__Sig.Ok {name = "Артём"; age = 17} *)
```

## Use case

Если вам не нужен сложный разбор и ваши типа представляются *как есть*, то используйте 
решения на базе [ppx_deriving](https://github.com/ocaml-ppx/ppx_deriving), вроде [ppx_deriving_yojson](https://github.com/ocaml-ppx/ppx_deriving_yojson) и т.д..

Так как decoders даёт нам максимальную гибкость при помощи монадического интерфейса, которым мы не ограничены и можем 
самостоятельно разбирать *сырые* значения. Например, как в <span title="Проект @dx3mod"> [парсере конфига bavar](https://github.com/dx3mod/bavar/blob/master/lib/project_config.ml)</span>. 