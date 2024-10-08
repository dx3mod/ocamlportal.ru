---
outline: deep
---

# Обработка ошибок

> [!WARNING] Ахтунг
> Этот раздел находится в неопределённом состоянии. 

## Монады vs исключения

Всё зависит от вашего стиля написания кода.

> [!TIP] Когда и что использовать
> Используйте **исключения для фатальных ошибок**, либо ошибок, которые зачастую не произойдут. **Монады для ожидаемых ошибок**, ошибок бизнес-логики, вроде некорректных данных от пользователя и т.д..

> [!NOTE] Двойники
> Иногда для удобства делают функции-двойники (с суффиксом `_exn`), которые выкидывают исключение в случае ошибки.

:::details Мем
![](https://i.ibb.co/JtbT1Sk/IMG-20240529-101235-082.jpg)
:::

### Монады

> [!NOTE] Преимущества
>
> - Кодируются в сигнатуре функции (про них сложно "забыть")
> - Требуют явной обработки, либо использования [монадики](#монадика)

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

Для некоторых библиотек, вроде [`lwt`](../libraries/concurrency/lwt.md), делают ppx-расширения.

> [!NOTE] Пример
>
> ```ocaml
> let%lwt users = get_users_from_db ()
> (* Lwt.bind (get_users_from_db ()) @@ fun users -> ... *)
> ```

## Исключения

### Перехват исключений

Помимо обычной конструкции `try ... with` для перехвата возникших исключений, их можно ловаить внутри `match` выражения:

```ocaml
let try_hd xs = 
    match List.hd xs with 
    | x -> Some x
    | exception Failure "hd" -> None
```