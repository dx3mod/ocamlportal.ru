# Встроенные примитивы

Вы могли видеть, что некоторые функции из стандартной библиотеки определены как-то странно, как external функция, имя которой начинается с `%` знака:

```ocaml
external succ : int -> int = "%succint"
```

> [!NOTE] Скринкаст
> <iframe width="560" height="315" src="https://www.youtube.com/embed/PcUBd9DuzFg?si=ZaG4NGlIQyAwQ3ED" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Это, так называемые, *примитивы* или *встроенные примитивы*, реализация которых определена внутри компилятора. Так, например, определены функции по работе с числами, что делает возможным генерировать более эффективный машинный код.

Если брать ещё один пример, то выражения `1 + 2` и `1 |> (+) 1` в действительности преобразуются в одинаковый код, благодаря тому, что `|>` реализован *через компилятор*, а не через "настоящую" функцию.

Все встроенные примитивы описываются в таблице [primitives_table](https://sourcegraph.com/github.com/ocaml/ocaml@9702e43b2052af1e2324cbdd9d34dee1de28f975/-/blob/lambda/translprim.ml?L124) из файла `lambda/translprim.ml` в формате ключ-значение, где ключ это строковая метка примитива, а значение &mdash; тот код (промежуточно представления), в который она должен быть преобразована. Пример всё того же `succ`:

```ocaml
let primitives_table = 
  create_hashtable _ [
    (* ... *)
    "%succint", Primitive ((Poffsetint 1), 1);
    (* ... *)
  ]
```
