---
outline: deep
---

# Lwt — OCaml promises and concurrent I/O 

[Lwt](https://github.com/ocsigen/lwt) &mdash; самая популярная и распространенная монадическая библиотека для асинхронного 
программирования посредством механизма [*обещаний*](https://cs3110.github.io/textbook/chapters/ds/promises.html) (с англ. [promises](https://ru.wikipedia.org/wiki/Futures_and_promises)). 

В сущности состоит из независимой реализации промисов (библиотека `lwt`) и реализации взаимодействия с системой и 
исполнения (resolving) промисов (библиотека `lwt.unix`).

[Основное руководство](http://ocsigen.org/lwt/latest/manual/manual) находится на сайте [Ocsigen]. Помимо этого библиотека
хорошо документирована [в коде](https://github.com/ocsigen/lwt), как публичный интерфейс так и внутренние вещи.

Помимо прочего активно используется в среде [MirageOS].

> [!INFO] 🗞️ 6.x  
> Начиная с шестой версии библиотеки ввелась поддержка direct-style написания асинхронного кода
>  взамен громоздкой монадики на базе алгебраических эффектов, введенных в OCaml 5.
>
> Данная функциональная доступна в модуле `Lwt_direct`:

```ocaml
utop # #require "lwt_direct";;
utop # open Lwt_direct;;

spawn @@ fun () ->
  let continue = ref true in
  while !continue do
    match await @@ Lwt_io.read_line Lwt_io.stdin with
    | "" | exception End_of_file -> continue := false
    | line -> await @@ Lwt_io.write_line Lwt_io.stdout line
  done
```

> [!NOTE] Интересные ссылки
> - [Заметка о Lwt, Василий Ёркин](https://vyorkin.org/ru-ru/posts/about-lwt/)
> - Детали реализации core'а смотрите в файле [`lwt.ml`](https://github.com/ocsigen/lwt/blob/master/src/core/lwt.ml) и т.д.;

> [!NOTE] Устройство под капотом 
> 
> - [Lwt: a Cooperative Thread Library](https://www.irif.fr/~vouillon/publi/lwt.pdf) &mdash; whitepaper про устройство Lwt;
> - [CS3110, 8.7. Promises](https://cs3110.github.io/textbook/chapters/ds/promises.html) &mdash; детальной рассмотрение дизайна и устройства промисов;  
> - Скринкаст [Промисы под капотом](https://t.me/zenofrel/299)
> - [tiny-async-lib](https://github.com/dx3mod/tiny-async-lib) &mdash; игрушечная библиотека для понимания устройства Lwt, можете также посмотреть [видео-разбор](https://t.me/zenofrel/305) его исходного кода и [пост с форума](https://discuss.ocaml.org/t/tiny-educational-concurrent-i-o-and-promises-library);
> - Gist [`dead_simple_read_files_in_lwt.ml`](https://gist.github.com/dx3mod/1999b99d0d26f95705d1641722f474ab);
> > [!TIP] Промисы под капотом
> > <iframe src="https://vkvideo.ru/video_ext.php?oid=164536802&id=456239837&hash=e26d4237e613d2b5&hd=3" width="100%" height="300" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>

>  [!NOTE] Пример 
> 
> Пример Lwt-программы, которая запрашивает первую страницу Google и терпит неудачу, если запрос не завершен в течение пяти секунд:
> 
> ```ocaml
> open Lwt.Syntax
> 
> let () =
>   let request =
>     let* addresses = Lwt_unix.getaddrinfo "google.com" "80" [] in
>     let google = Lwt_unix.((List.hd addresses).ai_addr) in
> 
>     Lwt_io.(with_connection google (fun (incoming, outgoing) ->
>       let* () = write outgoing "GET / HTTP/1.1\r\n" in
>       let* () = write outgoing "Connection: close\r\n\r\n" in
>       let* response = read incoming in
>       Lwt.return (Some response)))
>   in
> 
>   let timeout =
>     let* () = Lwt_unix.sleep 5. in
>     Lwt.return None
>   in
> 
>   match Lwt_main.run (Lwt.pick [request; timeout]) with
>   | Some response -> print_string response
>   | None -> prerr_endline "Request timed out"; exit 1
> 
> ```

> [!NOTE] Монадический синтаксис 
>
> ---
>
> **PPX**
>
> [`ppx_lwt`](https://ocsigen.org/lwt/4.1.0/api/Ppx_lwt) &mdash; препроцессинг для удобной монадики с Lwt-промисами.
> 
> ```ocaml
> let%lwt user = get_user_from_api "dad" in
> (* ... *)
> send_message "some text";%lwt
> ```
>
> **Модуль `Lwt.Syntax`**
>
> ```ocaml
> let open Lwt.Syntax in
> let* user =  get_user_from_api "dad" in
> (* ... *)
> send_message "some text"
> ```

## Использование в [Dune]-проекте 

1. Произведите установку библиотеки согласно [инструкции](https://github.com/ocsigen/lwt?tab=readme-ov-file#installing) 
2. Добавьте его в ваш `dune`-файл вашего компонента
    ```dune
    (executable 
      ...
      (libraries lwt.unix))
    ```

## Использование в [Utop] 

Utop умееь автоматически резолвить промис.
```utop
utop # #require "lwt.unix";;
utop # Lwt.return ();;
- : unit = ()
```
 
## Switches — управление освобождением ресурсов

> [!NOTE] См. также
> - Рецепт [Освобождения ресурсов](../../recipes/dispose-resources.md)

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
  let%lwt conn_a = connect ~switch uri in 
  let%lwt conn_b = connect ~switch uri in 
  (* ... *)
```

> [!NOTE] Примеры использования
> - Применение в библиотеке [nats.ocaml](../web/nats-ocaml.md)

## Работа с TCP/IP (в примере)

> [!WARNING] To-Do
> Добавить больше слов что-ли...

### TCP клинт

> [!NOTE] В реальных проектах 
> - [Nats_lwt.Connection](https://github.com/romanchechyotkin/nats.ocaml/blob/main/lwt/connection.ml) &mdash; реализация подключения к NATS серверу;

```ocaml
open Lwt.Infix

let host = "127.0.0.1"
and port = 8080

let () =
  Lwt_main.run
  @@ Lwt_io.with_connection
       Unix.(ADDR_INET (inet_addr_of_string host, port))
       (fun (ic, oc) ->
         Lwt_io.write oc "GET / HTTP/1.1\r\n\r\n";%lwt
         Lwt_io.read_line ic >>= Lwt_io.printl)
```

```ocaml
module Tcp_connection = struct
  type t = { ic : Lwt_io.input_channel; oc : Lwt_io.output_channel }

  let create ~host ~port =
    let open Unix in

    (* Создание "сырого" Unix-сокет. *)
    let socket_fd = Lwt_unix.socket PF_INET SOCK_STREAM 0 in

    (* Создание TCP-соединения по указному адресу. *)
    let address = ADDR_INET (inet_addr_of_string host, port) in
    Lwt_unix.connect socket_fd address;%lwt

    (* Оборачивание сокета в удобную абстракцию каналов. *)
    let ic = Lwt_io.of_fd ~mode:Lwt_io.Input socket_fd in
    let oc = Lwt_io.of_fd ~mode:Lwt_io.Output socket_fd in

    Lwt.return { ic; oc }

  let read { ic; _ } = Lwt_io.read ic
  let write { oc; _ } s = Lwt_io.write oc s

  (* Для закрытия сокета достаточно закрыть один из каналов. *)
  let close { ic; _ } = Lwt_io.close ic
end

open Lwt.Infix

let () =
  Lwt_main.run @@
  let%lwt connection = Tcp_connection.create ~host:"127.0.0.1" ~port:8080 in

  (* Чтение и вывод считанной строки в stdout. *)
  Tcp_connection.read connection >>= Lwt_io.printl;%lwt

  Tcp_connection.close connection
```

### TCP сервер

```ocaml
let serve ~host ~port =
  let%lwt server =
    Lwt_io.establish_server_with_client_address
      (ADDR_INET (Unix.inet_addr_of_string host, port))
    @@ fun _ (_, oc) ->
    Lwt_io.write_line oc "Hello from server!";%lwt
    Lwt_io.flush oc
  in

  let%lwt _ = fst @@ Lwt.wait () in
  Lwt_io.shutdown_server server

let () = Lwt_main.run @@ serve ~host:"127.0.0.1" ~port:8080
```

```ocaml
let serve ~host ~port =
  let socket = Lwt_unix.socket PF_INET SOCK_STREAM 0 in

  Lwt_unix.bind socket (ADDR_INET (Unix.inet_addr_of_string host, port));%lwt
  Lwt_unix.listen socket 10;

  while%lwt true do
    let%lwt client_socket, _ = Lwt_unix.accept socket in
    let oc = Lwt_io.of_fd ~mode:Output client_socket in

    Lwt_io.write_line oc "Hello from server!";%lwt
    Lwt_io.flush oc;%lwt
    
    Lwt_unix.close client_socket
  done;%lwt

  Lwt_unix.close socket

let () = Lwt_main.run @@ serve ~host:"127.0.0.1" ~port:8080
```

## Фичи

### Never-промис

Тут мы создаем промис, который никогда не будет зарезолвен, а значит последовательность 
не продолжится.  

```ocaml
let never = fst @@ Lwt.wait ()
```
```ocaml
let%lwt _ = never in (* ... *)
```


[MirageOS]: https://mirage.io/ 
[Ocsigen]: https://ocsigen.org/home/intro.html
[libev]: http://software.schmorp.de/pkg/libev.html
[Dune]: ../../tools/dune.md
[Utop]: ../../tools/utop.md