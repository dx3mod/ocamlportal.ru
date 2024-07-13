# Vkashka

[Vkashka](https://github.com/dx3mod/vkashka) &mdash; библиотека для работы с 
[VK API](https://dev.vk.com/ru/reference) версии 5.199. Построена на базе 
[Cohttp](./cohttp.md) и [Lwt](../lwt.md) без зависимости на конкретную реализацию.

Не покрывает весь функционал, так как создавалась для решения задачи *X*. Но даёт возможность 
самостоятельно расширить функционал, как обычным форком, либо in-place расширением модуля.

## Пример

```ocaml
(* Выбираете подходящий для себя Cohttp+Lwt совместимый бекенд. *)
#require "cohttp-lwt-unix";;
```

```ocaml
(* Создание first-class модуля Token для. *)
let token = Vkashka.access_token "YOUR_TOKEN"

(* Создание модуля для работы с API с внедренными зависимостями: 
   реализация HTTP-клиента и токен.  *)
module Vk_api = Vkashka.Api (Cohttp_lwt_unix.Client) (val token)

(* Получение одного пользователя.  *)
Vk_api.Users.(get ~user_ids:["username"] () >|= first)
(* - : (Vkashka.User.t, string) result *)
```