# Работа с байтами

> [!TIP] Видео-иллюстрация из серии OCaml Tips
> <iframe src="https://vkvideo.ru/video_ext.php?oid=-232966291&id=456239023&hash=d6d99676ee5a4ebb&hd=3" width="100%" height="300" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>
> Смотреть на [YouTube](https://youtu.be/Wk58dQ1IMZI).


Стандартные средства (стандартная библиотека OCaml'а) предлагает достаточно богатые возможности по 
работе с бинарными данными благодаря соответствующим функциям из модулей `Bytes` и `String`. 

## Строки и байты

На данный момент в OCaml представлено два типа для представления последовательности байт фиксированной длины:
тип `bytes` и тип `string`. Исторически изначально строки были изменяемыми и тип байтов отсутствовал, так как 
строки не обязательно должны содержать текстовую информации, но с LTS четвертой версии они стали неизменяемыми.
Поэтому потребовался некий другой интерфейс для мутаций строк –– так инструментом и стал тип `bytes` и одноименный
модуль, почти полностью повторявший модуль строк. 

Тут стоит ясно понимать, что строки и байты в OCaml это одна и та же сущность и все это в рантайми исторически 
называется строками. Это можно легко доказать следующим кодом.

```ocaml
let string_value = "Hello!" in
let bytes_value = Bytes.of_string string_value in

assert (Obj.(tag (repr string_value) = string_tag));
assert (Obj.(tag (repr bytes_value) = string_tag))
```

Также необходимо понимать, что имея одно представление с двумя интерфейсами, непременно между ними будут преобразования,
а при преобразовании между двумя интерфейсами их абстракции должны быть гарантированны.

На практике это сводится к тому, что преобразования между bytes и string всегда сопровождаются копированием!

```ocaml
(* bytes.ml *)

let to_string b = unsafe_to_string (copy b)
let of_string s = copy (unsafe_of_string s)
```

Если вы хотите избавиться от лишних аллокаций, то вам придется взять на себя ответственность за выполнение гарантий
абстракций. Подробнее читайте в секции [zero-cost преобразования](./unsafe.md#zero-cost-преобразование).

### Функции кодирования и декодирования

См. <https://ocaml.org/manual/api/Bytes.html#1_Binaryencodingdecodingofintegers>

Пример использования данных функций:
```ocaml
let load_address addr =
  let command = Bytes.create 4 in
  Bytes.set_uint8 command 0 Message.cmnd_stk_load_address;
  Bytes.set_uint16_le command 1 addr;
  Bytes.set_uint8 command 3 Message.sync_crc_eop;
  command
```

## Сторонние решения

- [Cstruct](https://github.com/mirage/ocaml-cstruct) –– Map OCaml arrays onto C-like structs
- [Angstrom](https://github.com/inhabitedtype/angstrom) & [Faraday](https://github.com/inhabitedtype/faraday)