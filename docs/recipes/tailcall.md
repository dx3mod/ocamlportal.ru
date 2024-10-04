---
outline: deep
---

# Хвостовая рекурсия

> [!NOTE] Из Википедии
> **Хвостовая рекурсия** — частный случай рекурсии, при котором любой рекурсивный вызов является последней операцией перед возвратом из функции.
>
> <https://ru.wikipedia.org/wiki/%D0%A5%D0%B2%D0%BE%D1%81%D1%82%D0%BE%D0%B2%D0%B0%D1%8F_%D1%80%D0%B5%D0%BA%D1%83%D1%80%D1%81%D0%B8%D1%8F>

> [!IMPORTANT] Оптимизация
> Использование хвостовой рекурсии позволяет компилятору оптимизировать её в эффективную итерацию. Если вам важна эффективность, то старайтесь укладывать ваш алгоритм в рамках хвостовой рекурсии.

::: details Типичный пример хвостовой и не хвостовой рекурсии

Рекурсия.

```ocaml
let rec sum = function
| [] -> 0
| hd::tl -> hd + sum tl
```

Хвостовая рекурсия.

```ocaml
let sum =
  let rec aux acc = function
    | [] -> acc
    | hd::tl -> aux (hd + acc) tl
  in aux 0
```

:::

## Внутренние вспомогательные функции

Для реализации хвостовой рекурсии нужна внутрення аккумулятивная переменная. Поэтому обычно внутри функции пишут рекурсивную вспомогательную-функцию.

::: details Пример
Helper-функция `loop`.

```ocaml
let reverse list =
  let loop rev_list list = (* реализация *)
  in loop [] list
```

Это является хорошей практикой.
:::

> [!NOTE] Частые названия helper-функций
>
> - `loop`
> - `aux` от слова auxiliary
> - `go` если вы знакомы с Haskell :)

## Аннотации 

Про аннотации смотрите в [мануале](https://ocaml.org/manual/attributes.html).

### `tailcall`

Аннотация `tailcall` может быть применена к применению функции, чтобы проверить, что вызов оптимизирован для хвостовой рекурсии. Если это не так, выдается предупреждение.

```ocaml
(* Хвостовая рекурсия. *)
let rec is_a_tail_call = function
  | [] -> ()
  | _ :: q -> (is_a_tail_call[@tailcall]) q

(* Не хвостовая. *)
let rec not_a_tail_call = function
  | [] -> []
  | x :: q -> x :: (not_a_tail_call[@tailcall]) q
(* Warning 51 [wrong-tailcall-expectation]:  *)
```

### `tail_mod_cons`

> [!NOTE] Документация
> [The “Tail Modulo Constructor” program transformation](https://ocaml.org/manual/tail_mod_cons.html)