---
outline: deep
---

# Обработка ошибок

> [!WARNING] Ахтунг
> Этот раздел находится в неопределённом состоянии. 

> [!NOTE] Смотрите по теме
>
> - [Composable Error Handling in OCaml](https://keleshev.com/composable-error-handling-in-ocaml) Vladimir Keleshev 
> - [Advanced Error Handling in OCaml](https://keleshev.com/advanced-error-handling-in-ocaml) Vladimir Keleshev 

> [!TIP] Когда и что использовать
> Используйте **исключения для фатальных ошибок**, либо ошибок, которые зачастую не произойдут. **Монады для ожидаемых ошибок**, ошибок бизнес-логики, вроде некорректных данных от пользователя и т.д..

> [!NOTE] Двойники
> Иногда для удобства делают функции-двойники (с суффиксом `_exn`), которые выкидывают исключение в случае ошибки.