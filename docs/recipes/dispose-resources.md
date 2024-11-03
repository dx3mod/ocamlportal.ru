# Освобождение ресурсов

Процесс освобождения ресурсов является распространённой задачей: закрыть файловый дескриптор, 
закрыть соединение и т.д.. 

При ручном освобождении ресурсов (она же функция `close`) могут 
возникнуть множество проблем &mdash; это можно забыть сделать или закрыть слишком рано.


:::details Пример ручного закрытия файла
```ocaml
let read_first_line_from_file filename = 
  let file = open_in filename in 
  let line = input_line file in 
  close_in file;
  line
```
:::

> [!INFO] Как это в других языках?
> 
> В языке вроде C++ или Rust для это существует нативная поддержка механизма [RAII],
> но он не сильно подходит средам с автоматическим управлением памятью (т.е [GC]).

Далее приведены идиомы и возможные варианты как это делать правильно на OCaml.

## Функция открытия &mdash; также функция закрытия 

> [!NOTE] Смотрите также 
> - [Channels: Безопасная работа](./channels.md#безопасная-работа)
> - [Switches](#switches) &mdash; далее

> [!NOTE] Пример
> Абстрактный пример того, как реализуется идиоматичная функции автоматического освобождения 
> некоторого ресурса.
> ```ocaml
> let initialize _ = (* ... *)
> let dispose _ = (* ... *)
> 
> let with_initialize _ f = 
>   let resource = initialize _ in 
>   Fun.protect 
>     (fun () -> f resource)
>     ~finally:(fun () -> dispose resource) 
> ```

Данный шаблон вы можете встретить как в стандартной библиотеке, так и в множестве других,
ибо он позволяет правильно завершить код даже в случае исключения внутри callback-функции.

## Освобождение при уничтожении объекта

Используя интерфейс сборщика мусора (модуль [Gc](https://ocaml.org/manual/api/Gc.html)) мы можем установить функцию, 
что должна быть выполнена во время освобождения объекта сборщика мусора.

Работает исключительно на heap-allocated объектах! 

> [!NOTE] Материалы
> Для этого смотрите функции [`finalise`](https://ocaml.org/manual/5.2/api/Gc.html#VALfinalise) и 
> [`alarm`](https://ocaml.org/manual/5.2/api/Gc.html#TYPEalarm).

> [!IMPORTANT] Стоит понимать
> Освобождения ресурса произойдёт только тогда, когда OCaml решит очистить объект, 
> а это может не произойти вообще. Смотрите [Memory management](./performance.md#memory-management).

> [!TIP] Библиотека Lwt
> В пакете `lwt.unix` (часть [Lwt](../libraries/concurrency/lwt.md)) есть модуль `Lwt_gc` и функция `finalise_or_exit`, которая гарантирует, что
> при завершении программы ресурс будет освобождён (будет вызвана функция, в которой произойдёт освобождение).
> 
> :::details Пример
> ```ocaml
> let main = 
>   let res = String.make 10 'x' in
>   Lwt_gc.finalise_or_exit (Lwt_io.printlf "free '%s'") res;
>   Lwt.return_unit
> ```
> :::

## Switches 
 
**Switch** (свитч) &mdash; область видимости, к которой привязываются ресурсы, и по завершению которой ресурсы должны будут быть освобождены. 

Эдакая прокаченная версия [with-функций](#функция-открытия--также-функция-закрытия) и [finalise из Gc](#освобождение-при-уничтожении-объекта). 

Этот паттерн можно особенно ярко встретить в библиотеке [Eio](../libraries/concurrency/eio.md).
Он там повсеместен и без него нельзя ничего сделать, так как ресурс должен быть к чему-то привязан.

> [!NOTE] Пример использования Eio.Switch
> ```ocaml
> let run_client ~net ~addr =
>   Switch.run ~name:"client" @@ fun sw ->
>   traceln "Client: connecting to server";
>   let flow = Eio.Net.connect ~sw net addr in
>   (* Read all data until end-of-stream (shutdown): *)
>   traceln "Client: received %S" (Eio.Flow.read_all flow)
> ```

> [!NOTE] Пример использования Lwt_switch
> В [Lwt] тоже можно найти свитчи как доп. абстракции &mdash; модуль [Lwt_switch].
> ```ocaml
> let main = 
>   Lwt_switch.with_switch @@ fun sw ->
>   let* file = Lwt_io.open_file "some-file" ~mode:Output in
>   Lwt_switch.add_hook (Some sw) (fun () -> Lwt_io.close file);
>   Lwt.return_unit
> ```



[RAII]: https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5_%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%B0_%D0%B5%D1%81%D1%82%D1%8C_%D0%B8%D0%BD%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F
[GC]: https://ru.wikipedia.org/wiki/%D0%A1%D0%B1%D0%BE%D1%80%D0%BA%D0%B0_%D0%BC%D1%83%D1%81%D0%BE%D1%80%D0%B0

[Lwt]: ../libraries/concurrency/lwt.md
[Lwt_switch]: https://ocsigen.org/lwt/latest/api/Lwt_switch