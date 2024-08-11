# Cohttp для HTTP клиентов и серверов

[Cohttp] &mdash; решение для работы с HTTP: создание сетевых демонов, клиентов и сервер.
Заточен под асинхронную работу, имеет для этого разные _бекенды_: [Lwt](../concurrency/lwt.md), Async, Eio, libcurl (даже) и другие.

Это относительно "низкоуровневый" инструмент для веб-сервисов. Если вам интересна веб-разработка,
то обратите внимание на [Opium](./opium.md) или [Dream](./dream.md).

## Пример использования

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

## Рекомендации по использованию

Используйте Cohttp в своих модулях, руководствуясь принципом инверсии зависимостей! Внедрять зависимости можно посредством [функторов](https://ocaml.org/docs/functors#injecting-dependencies-using-functors).

> [!NOTE] Библиотека-враппер API сервиса
>
> ```ocaml
> module ServiceApiWrapper = struct
>   module type S = sig
>     val get_user_by_id : _ -> (_, _) result
>   end
>
>   module type Auth = sig
>     val token : string
>   end
>
>   module Make (A : Auth) (C : Cohttp_lwt.S.Client) : S = struct
>     let get_user_by_id _ = failwith "todo"
>   end
>
>   let token s =
>     (module struct
>       let token = s
>     end : Auth)
> end
> ```
>
> Пользовательский код.
>
> ```ocaml
> module ServiceApi =
>   ServiceApiWrapper.Make
>     (val ServiceApiWrapper.token "...")
>     (Cohttp_lwt_unix.Client)
> ```
>
> Как вы видите, разработчик сам выбирает какую реализацию использовать.

Это актуально не только для библиотек, но и при разработки приложений.

## Eio бекенд

::: details Всем новичкам посвящается

Как выглядит любой, кто захотел уйти с [Lwt](../concurrency/lwt.md) на современный мульткор на базе эффектов.

![](../../public/memes/meme_multicore.png){width=60%}

:::

> [!WARNING] Использовать ли в продакшене?
> Какой-либо документации по использованию Eio-бекенда нету, на GitHub можно найти [много issue](https://github.com/mirage/ocaml-cohttp/issues?q=is%3Aissue+is%3Aopen+eio) связанные с ним. Поэтому использовать только на свой страх и риск, хотя должно быть всё стабильно. Пока что экосистема сырая.

Примеры использования можно найти тут: <https://github.com/mirage/ocaml-cohttp/tree/master/cohttp-eio/examples>.

### HTTPS

> [!NOTE] Зависимости
>
> - `tls-eio` (либо билдинги к `eio-ssl`, если вообще возможно)
> - `mirage-crypto-rng-eio`

Для работы TLS требуется сертификат:

```ocaml
let null_auth ?ip:_ ~host:_ _ =
  Ok None (* Warning: use a real authenticator in your code! *)
```

Чтобы загрузить системный используется библиотека [ca-certs](https://github.com/mirage/ca-certs/blob/main/lib/ca_certs.mli).

## Related

Хотелось бы иметь иметь потоковый JSON-парсер для `Lwt_stream`, но оного я не нашёл в экосистеме
(по крайней мере в меру живого). В примерах используют хороший [Yojson](../yojson.md),
но он читает строки, хотя может большее.

## Альтернативы

Из треда [Simple, modern HTTP client library?](https://discuss.ocaml.org/t/simple-modern-http-client-library/11239)

- [Piaf](https://github.com/anmonteiro/piaf) только для клиентов
- [Httpaf](https://github.com/inhabitedtype/httpaf) ныне мёртв, но вроде как завершён

[Cohttp]: https://github.com/mirage/ocaml-cohttp
