---
outline: deep
---

# Работа с TCP/IP

В этой главе приведены примеры по работе с сетевыми протоколами.

> [!INFO] Смотрите также
> - [Unix system programming in OCaml](https://ocaml.github.io/ocamlunix/) &mdash; детальная книга по системному программированию

## С помощью [Lwt_unix](../libraries/concurrency/lwt.md)

> [!INFO] Смотрите также
> - [Освобождение ресурсов](../recipes/dispose-resources.md) &mdash; при работе с ресурсами очень важно правильно их освобождать,обязательна к ознакомлению;

### TCP клинт

```ocaml
type tcp_connection = { ic : Lwt_io.input_channel; oc : Lwt_io.output_channel }

let create_tcp_connection ~host ~port =
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

(* Для закрытия сокета достаточно закрыть один из каналов. *)
let close { ic; _ } = Lwt_io.close ic
```

```ocaml
open Lwt.Infix

let () =
  Lwt_main.run @@
  let%lwt connection = create_tcp_connection ~host:"127.0.0.1" ~port:8080 in

  (* Чтение и вывод считанной строки в stdout. *)
  Lwt_io.read_line connection.ic >>= Lwt_io.printl;%lwt

  close connection
```

> [!NOTE] В реальных проектах 
> - [Nats_lwt.Connection](https://github.com/romanchechyotkin/nats.ocaml/blob/main/lwt/connection.ml) &mdash; реализация подключения к NATS серверу;