# Rpmfile

[Rpmfile] &mdash; библиотека для чтения метаинформации из [RPM]-пакетов.
Реализует в себе как непосредственно парсер на базе [Angstrom](./angstrom.md), 
так и интерфейс для удобного получения значений.

## Использование

Из-коробки предоставляется дефолтный `Reader`, чтобы читать из строки или файла. 
Для его создания в него необходимо передать *селектор*, модуль позволяющий определить
какие теги мы хотим разобрать, а какие пропустить.

```ocaml
module Rpm_reader = Rpmfile.Reader (Rpmfile.Selector.All)

let metadata = Rpm_reader.of_file_exn "hello-2.12.1-1.7.x86_64.rpm"

Rpmfile.summary metadata
(* - : string = "A Friendly Greeting Program" *)
```

Получения данных *в ручную* без вспомогательных функций осуществляется через `get`. 
Вот, как пример, получение размеров файлов. 

```ocaml
Rpmfile.get Rpmfile.D.(array int) 1028 metadata
(* int list = [35000; 0; 93787; ...]*)
```

Если тег не будет найден, то вернётся исключение `Rpmfile.Not_found`.

### Пользовательский селектор

```ocaml
module SelectNameOnly = struct
  include Rpmfile.Selector.All

  let select_header_tag = function 
  | 1000 (* name *) -> true
  | _ -> false
end

module _ = Rpmfile.Reader (SelectNameOnly)
```

### Как утилита командной строки

Rpmfile можно использовать CLI-приложение, выводящее базовую информацию о пакете, 
аналогично команде `rpm -qi`.

```sh
$ rpmfile hello-2.12.1-1.7.x86_64.rpm
```


[Rpmfile]: https://github.com/dx3mod/rpmfile
[RPM]: https://ru.wikipedia.org/wiki/RPM
