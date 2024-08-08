---
outline: deep
---

# Рецепты

## Labels

Использование *именованных аргументов* ([labeled arguments](https://ocaml.org/manual/lablexamples.html))  зачастую предпочтительнее, если ваша функция принимает три и более параметра. 

> [!NOTE] Пример
> В стандартной библиотеке для некоторых модулей существуют модули-двойники, использующие подход именованных аргументов. 
> ```ocaml
> (* Bytes.sub *)
> val sub : bytes -> int -> int -> bytes
> 
> (* BytesLabels.sub *)
> val sub : bytes -> pos:int -> len:int -> bytes
> ```

Преимущества:

- Больше информации в сигнатуре 
- Более гибкая возможность композиции функций 


## Channels

Канала (channels) это пара модулей (`In_channel` и `Out_channel`) из стандартной библиотеке, абстрагирующие работу с файловыми потоками.

> [!NOTE] Именование
> Сокращать название каналов можно до `oc` (`Out_channel`) и `ic` (`In_channel`). Либо используйте осознанные имена, вроде `config_file`.

> [!NOTE] Безопасная работа
> Предпочитайте открытие _канала_ при помощи функций `with_open_*`, так как в случае исключений они безопасно закроют файл.
>  ```ocaml
>  let () =
>    In_channel.with_open_text "some.file" @@ fun ic -> (* ... *)
>  ```

## Монадика

Про монады можно почитать в [8.7. Monads](https://cs3110.github.io/textbook/chapters/ds/monads.html).

### Операторы

Смотрите [Binding operators](https://ocaml.org/manual/bindingops.html).

| Операторы             | Функция | Описание                                                              |
| --------------------- | ------- | --------------------------------------------------------------------- |
|                       |         |                                                                       |
| `>>=`, `let*`         | `bind`  | Монадическое связывание, определяющие монадическую последовательность |
| `>>\|`, `>\|=` `let+` | `map`   | Отображение (между двумя категориями)                                 |

> [!NOTE] Историческая справка
> Начиная с версии 4.08 появилась возможность определять `let-in` конструкцию.

> [!NOTE] Пример
> 
> ```ocaml
> let (let+) o f = Option.map f o
> let (and+) ao bo = Option.bind ao (fun a -> let+ b = bo in a, b)
> 
> let map2 f xo yo =
>   let+ x = xo
>   and+ y = yo in
>   f x y
> 
> (* - ('a -> 'b -> 'c) -> 'a option -> 'b option -> 'c option = <fun> *)
> ```

### ppx

Для некоторых библиотек, вроде [`lwt`](./libraries/concurrency/lwt.md), делают ppx-расширения.

> [!NOTE] Пример
>
> ```ocaml
> let%lwt users = get_users_from_db ()
> (* Lwt.bind (get_users_from_db ()) @@ fun users -> ... *)
> ``` 

## Монады vs исключения 

## Backtrace recording

По-умолчанию отслеживание бектрейса исключений **выключено**.

> [!IMPORTANT] Вопрос производительности
> Включение _backtrace recording_ может сказаться на производительности при обильном использование исключений в вашей программе.

> [!TIP] Рекомендации
> Используйте backtrace recording исключительно во время разработки.

Чтобы включить отслеживание можно воспользоваться переменной окружения, либо явно вызвав функцию в коде.

```sh
# in shell
$ OCAMLRUNPARAM=b ocaml main.ml
```

```ocaml
(* in code *)
Printexc.record_backtrace true
```

> [!NOTE] Результат
> До и после.
> 
> ```
> Fatal error: exception Not_found
> 
> Fatal error: exception Not_found
> Raised at Dune__exe__Main in file "bin/main.ml", line 6, characters 8-23
> ```
