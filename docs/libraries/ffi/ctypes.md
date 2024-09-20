---
outline: [2,3]
---

# Ctypes

[Ctypes] &mdash; библиотека для написания биндингов к C библиотекам, используя pure OCaml. 
Избавляет разработчика от сложностей, связанных с рантаймом OCaml. 

Имеет разные стратегии работы:
- Динамическое подключение к shared библиотек посредством libffi;
- Генерировать stubs из определений (наиболее гибкий и эффективный подход);

> [!NOTE] Полезные ссылки
> 
> - [Building C libraries in OCaml with the dune ctypes stanza](https://michael.bacarella.com/2022/02/19/dune-ctypes/)
> - [Chapter 19: Foreign Function Interface][rwo-ffi] из [Real World OCaml][rwo]

> [!NOTE] Смотрите также
> 
> - [Tdl.ml](../graphics/tdl.md) пример использования


## Дурацкие ошибки

### `Ctypes_static.IncompleteType`

Для решения этой проблемы определите поля стриктуры и сделайте `seal`.

:::details Пример
```ocaml
module Point_color = struct
  let t : point_color structure typ = structure "tdl_point_color"
  and color = uint
  let bg = field t "bg" color
  let fg = field t "fg" color
  let () = seal t
end
``` 
:::


[Ctypes]: https://github.com/yallop/ocaml-ctypes
[rwo-ffi]: https://dev.realworldocaml.org/foreign-function-interface.html
[rwo]: http://realworldocaml.org/