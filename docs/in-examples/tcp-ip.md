---
outline: deep
---

# Работа с TCP/IP

В этой главе приведены примеры по работе с сетевыми протоколами.

> [!INFO] Смотрите также
> - [Unix system programming in OCaml](https://ocaml.github.io/ocamlunix/) &mdash; детальная книга по системному программированию
> - [Освобождение ресурсов](../recipes/dispose-resources.md) &mdash; при работе с ресурсами очень важно правильно их освобождать,обязательна к ознакомлению;

## С помощью [Lwt](../libraries/concurrency/lwt.md)

```Dune
(executable 
  ...
  (libraries lwt.unix)
  (preprocess
    (pps lwt_ppx)))
```

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