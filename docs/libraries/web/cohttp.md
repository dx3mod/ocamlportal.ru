# Cohttp для HTTP клиентов и серверов

[Cohttp] &mdash; решение для работы с HTTP: создание сетевых демонов, клиентов и сервер.
Заточен под асинхронную работу, имеет для этого разные *бекенды*: [Lwt](../lwt.md), Async, Eio, libcurl (даже) и другие.  

Это относительно "низкоуровневый" инструмент для веб-сервисов. Если вам интересна веб-разработка,
то обратите внимание на [Opium](./opium.md) или [Dream](./dream.md).

## Пример 

Пример из документации по использованию Cohttp с бекендом на `lwt_unix`.

```ocaml
open Lwt
open Cohttp
open Cohttp_lwt_unix

let body =
  Client.get (Uri.of_string "https://www.reddit.com/") >>= fun (resp, body) ->
  let code = resp |> Response.status |> Code.code_of_status in
  Printf.printf "Response code: %d\n" code;
  Printf.printf "Headers: %s\n" (resp |> Response.headers |> Header.to_string);
  body |> Cohttp_lwt.Body.to_string >|= fun body ->
  Printf.printf "Body of length: %d\n" (String.length body);
  body

let () =
  let body = Lwt_main.run body in
  print_endline ("Received body\n" ^ body)
```

Более комплексный пример можно найти всё в том же RWO, [Searching Definitions with DuckDuckGo](http://dev.realworldocaml.org/concurrent-programming.html#example-searching-definitions-with-duckduckgo).


## Related

Хотелось бы иметь иметь потоковый JSON-парсер для `Lwt_stream`, но оного я не нашёл в экосистеме 
(по крайней мере в меру живого). В примерах используют хороший [Yojson](../yojson.md), 
но он читает строки, хотя может большее.


## Альтернативы

Из треда [Simple, modern HTTP client library?](https://discuss.ocaml.org/t/simple-modern-http-client-library/11239)
  
- [Piaf](https://github.com/anmonteiro/piaf) только для клиентов
- [Httpaf](https://github.com/inhabitedtype/httpaf) ныне мёртв


[Cohttp]: https://github.com/mirage/ocaml-cohttp