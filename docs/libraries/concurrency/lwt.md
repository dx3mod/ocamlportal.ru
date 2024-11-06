---
outline: deep
---

# Lwt

[Lwt](https://github.com/ocsigen/lwt) &mdash; самая полярная библиотека для асинхронного программирования посредством [*промисов*](https://cs3110.github.io/textbook/chapters/ds/promises.html) для не multicore OCaml. Под капотом использует [libev].

[Основное руководство](http://ocsigen.org/lwt/latest/manual/manual) находится на сайте [Ocsigen]. Помимо этого библиотека
хорошо документирована в коде, как для просто юзеров, так и внутренние вещи.

Также активно используется в среде [MirageOS].

## Пример

Оф. пример Lwt-программы, которая запрашивает первую страницу Google и терпит неудачу, если запрос не завершен в течение пяти секунд:

```ocaml
open Lwt.Syntax

let () =
  let request =
    let* addresses = Lwt_unix.getaddrinfo "google.com" "80" [] in
    let google = Lwt_unix.((List.hd addresses).ai_addr) in

    Lwt_io.(with_connection google (fun (incoming, outgoing) ->
      let* () = write outgoing "GET / HTTP/1.1\r\n" in
      let* () = write outgoing "Connection: close\r\n\r\n" in
      let* response = read incoming in
      Lwt.return (Some response)))
  in

  let timeout =
    let* () = Lwt_unix.sleep 5. in
    Lwt.return None
  in

  match Lwt_main.run (Lwt.pick [request; timeout]) with
  | Some response -> print_string response
  | None -> prerr_endline "Request timed out"; exit 1

(* ocamlfind opt -package lwt.unix -linkpkg example.ml && ./a.out *)
```

## Ppx

Препроцессинг для `do`-подобного синтаксиса ([`ppx_lwt`](https://ocsigen.org/lwt/4.1.0/api/Ppx_lwt)):
```ocaml
let%lwt user = get_user_from_api "dad" in
(* ... *)
send_message "some text";%lwt
```

## Switches

> [!NOTE] Смотрите также
> - Рецепт по [освобождения ресурсов](../../recipes/dispose-resources.md)
> - Применение в библиотеке [nats.ocaml](../web/nats-ocaml.md)

Библиотека Lwt предоставляет удобную абстракцию под названием [switches](https://ocsigen.org/lwt/latest/api/Lwt_switch) 
(свитчи), эдакая область видимости, к которой мы привязываем ресурсы, и по выходу из которой они будут 
освобождены, даже в случае исключения. 

Интерфейс модуля построен так, что он должен быть использован внутри функций с опциональными параметрами.

```ocaml
let connect ?switch uri = 
  let%lwt conn = open_connection uri in 
  (* ... *)
  Lwt_switch.add_hock switch (fun () -> close_connection conn);
  (* ... *)
```

```ocaml
let _ = 
  Lwt_switch.with_switch @@ fun switch ->
  let%lwt conn_a = connect ?switch uri in 
  let%lwt conn_b = connect ?switch uri in (* ... *)
```

[MirageOS]: https://mirage.io/ 
[Ocsigen]: https://ocsigen.org/home/intro.html
[libev]: http://software.schmorp.de/pkg/libev.html