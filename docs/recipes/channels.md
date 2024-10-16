# Channels

Канала (channels) это пара модулей (`In_channel` и `Out_channel`) из стандартной библиотеке, 
упрощающие работу с файловыми потоками. Это не абстракция, а именно обвёртка над файловым интерфейсом 
операционной системы.

> [!NOTE] Именование
> Сокращать название каналов можно до `oc` (`Out_channel`) и `ic` (`In_channel`). 
> Либо используйте осознанные имена, вроде `config_file`.

> [!NOTE] Смотрите также 
> Асинхронный ввод вывод: [Eio](../libraries/concurrency/eio.md), [Lwt](../libraries/concurrency/lwt.md).

## Безопасная работа

Предпочитайте открытие _канала_ при помощи функций `with_open_*`, так как 
в случае исключений они безопасно закроют файл.

```ocaml
let () =
  In_channel.with_open_text "some.file" @@ fun ic -> (* ... *)
```

## Канал из строчки 

Из-за особенности [устройства channels](https://sourcegraph.com/github.com/ocaml/ocaml/-/blob/runtime/caml/io.h?L50:8-50:15), замокать это нельзя, но можно несколько извратиться посредством [пайпов](https://man7.org/linux/man-pages/man2/pipe.2.html). Пример кода взят от [сюда](https://discuss.ocaml.org/t/how-can-i-create-an-in-channel-from-a-string/8761/17):

```ocaml
let in_channel_of_string str =
  let (in_file_fd, out_file_fd) = Unix.pipe () in

  let ic = Unix.in_channel_of_descr in_file_fd in
  let out = Unix.out_channel_of_descr out_file_fd in

  output_string out str;
  close_out out;

  ic
```

Есть также готовая библиотека для этого под названием [redirect].

[redirect]: https://github.com/thierry-martinez/redirect
