# Рецепты

## Labels

Изначально стандартная библиотека не сильно использует возможности именованных аргументов, поэтому существует модули-двойники. 

Например, `List` и `ListLabels`. Различие в сигнатуре функции `map`:
```ocaml
(* list.mli *)
val map : ('a -> 'b) -> 'a list -> 'b list

(* listLabels.mli *)
val map : f:('a -> 'b) -> 'a list -> 'b list
```

Подход именованных аргументов позволяет не заботиться о позиции аргументов, что актуально при композиции. 

Подобный подход лёг в основу некоторых альтернативных стандартных библиотек, вроде [`Base`](./libraries/core/base.md).

## Channels 

Канала (channels) это пара модулей (`In_channel` и `Out_channel`) из `Stdlib` для работы с файлами. 

### Именование 

Сокращать название переменных можно до `oc` (`Out_channel`) и `ic` (`In_channel`), либо просто `ch`.

### Работа с файлами

Предпочитайте при работе с файлами функции `with_open_` из модулей `In_channel` и `Out_channel`, так как в случае исключения они безопасно закроют файл. 

#### Пример

```ocaml
let () = 
  In_channel.with_open_text "some.file" @@ fun ic -> (* ... *)
```

## Backtrace recording

По-умолчанию отслеживание бектрейса исключений выключен из-за того, что это дополнительный оверхед. 

Чтобы его включить можно воспользоваться переменной окружения, либо явно вызвать функцию в программе. 

```sh
# in shell 
$ OCAMLRUNPARAM=b ocaml main.ml
```
```ocaml
(* in code *)
Printexc.record_backtrace true
```

### Результат 

```
Fatal error: exception Not_found

Fatal error: exception Not_found
Raised at Dune__exe__Main in file "bin/main.ml", line 6, characters 8-23
```
