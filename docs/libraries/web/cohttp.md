---
outline: deep
---

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

## Lwt-бекенд

### Рекомендации по использованию

Старайтесь использоваться `cohttp-lwt` в своих модулях, руководствуясь принципом инверсии зависимостей! Внедрять зависимости можно посредством [функторов](https://ocaml.org/docs/functors#injecting-dependencies-using-functors).

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
> Как вы видите, разработчик сам выбирает какую реализацию использовать, 
> что актуально для желающих засунуть свой код в [MirageOS].

Это актуально не только для библиотек, но и при разработки приложений.

### HTTPS

Для работы шифрованного обмена трафика у вас должен быть установлен один из пакетов:
[`lwt_ssl`](https://github.com/ocsigen/lwt_ssl) или [`tls-lwt`](https://github.com/mirleft/ocaml-tls). Первый является биндингом к OpenSSL, второй же полностью реализован на OCaml, что добавляет в переносимости, но существенно увеличивает размер бинарника и возможно несколько снижает производительность.

> [!NOTE] Смотрите также 
> Подобная вариация существует благодаря библиотеке [conduit](https://github.com/mirage/ocaml-conduit), 
> которая обеспечивает некоторую степень абстракции от конкретной используемой библиотеки SSL. 
>
> К сожалению, для multcore (aka Eio, Miou и т.д..) пока подобного нет.

## [Eio](../concurrency/eio.md)-бекенд

::: details Всем новичкам посвящается

Как выглядит любой, кто захотел уйти с [Lwt](../concurrency/lwt.md) на современный мульткор на базе эффектов.

![](../../public/memes/meme_multicore.png){width=60%}

:::

> [!WARNING] Использовать ли в продакшене?
> Вполне стабильно, но какой-либо документации по использованию Eio-бекенда нету. На GitHub [не так много issue](https://github.com/mirage/ocaml-cohttp/issues?q=is%3Aissue+is%3Aopen+eio) связанных с ним. Разбираться со всем придётся самостоятельно, либо просить помощи на [форуме](../../community.md).

Примеры использования можно найти тут: <https://github.com/mirage/ocaml-cohttp/tree/master/cohttp-eio/examples>.

### HTTPS

Для настройки шифрования потребуется дополнительные телодвижение в отличие от стандартаного `unix`-бекенда, где всё работает из коробки.

> [!NOTE] Зависимости
>
> - `tls-eio` &mdash; OCaml-реализация TLS
> - `mirage-crypto-rng-eio`
> - `ca-certs` &mdash; для загрузки системного сертификата

> [!NOTE] Пример HTTP-клиента
>
> ```ocaml
> open Cohttp_eio
>
> let https =
>   (* Загрузка системного (корневого) сертификата.  *)
>   let authenticator = Ca_certs.authenticator () |> Result.get_ok in
>   let tls_config = Tls.Config.client ~authenticator () in
>   fun uri raw ->
>     let host =
>       Uri.host uri
>       |> Option.map (fun x -> Domain_name.(host_exn (of_string_exn x)))
>     in
>     Tls_eio.client_of_flow ?host tls_config raw
>
> let main env =
>   let client = Client.make ~https:(Some https) env#net in
>   (* Switch управляет ресурсами, поэтому каждый запрос должен использовать новый switch. *)
>   Eio.Switch.run @@ fun sw ->
>   let resp, body =
>     Client.get ~sw client (Uri.of_string "https://example.com")
>   in
>   (* ... *)
>   if Http.Status.compare resp.status `OK = 0 then
>     (* Чтение тела из потока. *)
>     print_string @@ Eio.Buf_read.(parse_exn take_all) body ~max_size:max_int
>   else Fmt.epr "Unexpected HTTP status: %a" Http.Status.pp resp.status
>
> let () =
>   Eio_main.run @@ fun env ->
>   Mirage_crypto_rng_eio.run (module Mirage_crypto_rng.Fortuna) env @@ fun () ->
>   main env
> ```
>
> Если вы планируете обращаться только к _одному_ сервису, то можно убрать парсинг хоста и передавать в `Tls_eio.client_of_flow` просто константу.

## Related

Хотелось бы иметь иметь потоковый JSON-парсер для `Lwt_stream`, но оного я не нашёл в экосистеме
(по крайней мере в меру живого). В примерах используют хороший [Yojson](../yojson.md),
но он читает строки, хотя может большее.

## Альтернативы

Из треда [Simple, modern HTTP client library?](https://discuss.ocaml.org/t/simple-modern-http-client-library/11239)

- [Piaf](https://github.com/anmonteiro/piaf) только для клиентов
- [Httpaf](https://github.com/inhabitedtype/httpaf) ныне мёртв, но вроде как завершён

[Cohttp]: https://github.com/mirage/ocaml-cohttp
[MirageOS]: https://mirage.io/