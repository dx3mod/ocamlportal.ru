# Конструкторы типов

В стандартной библиотеке можно часто увидеть такие функции как `create`, `make` или `init`.
Все они используются для создание экземпляра значения, вроде списков или строк. Но какие они имеют значение?

> [!TIP] Что использовать для своего типа?
> Используйте `make`, если у вас [этот случай](https://github.com/ocaml-ppx/ppx_deriving#plugin-make).
> В ином случае `create`.

### `create`

Эта функция создаёт экземпляр из каких-нибудь параметров, не говоря _о содержимом_.

> [!NOTE] Пример
> Так, например, `Bytes.create` выделяет кусок памяти (байт), значение в котором никак не проинициализированы.
> Там могут находиться как пустые ячейки так и "мусор".
>
> ```ocaml
> # Bytes.create 10;;
> - : bytes = Bytes.of_string "\b\194\187\148,\127\000\000\000\000"
> ```

### `make`

Зачастую используется для инициализации коллекции неким значением.

> [!NOTE] Пример
>
> ```ocaml
> # Array.make 3 "yo";;
> - : string array = [|"yo"; "yo"; "yo"|]
> ```

### `init`

Даёт возможность инициализировать коллекцию при создание своим способом.

> [!NOTE] Пример
>
> ```ocaml
> # Array.init 3 (sprintf "yo%d");;
> - : string array = [|"yo0"; "yo1"; "yo2"|]
> ```