# Взаимодействие с кодом на C

В этом рецепте раскрываются детали взаимодействия с кодом на языке программирования C из OCaml.

> [!INFO] Полезные ссылки
>
> - Глава [Interfacing C with OCaml](https://ocaml.org/manual/intfc.html) из мануала
> - [How to call C functions from OCaml](http://decapode314.free.fr/ocaml/ocaml-c-interface.html) &mdash; наглядное руководству по написанию C stub
> - [Easy mistakes when writing OCaml C bindings](https://www.brendanlong.com/easy-mistakes-when-writing-ocaml-c-bindings.html)

## Конфигурирование флагов сборки 

> [!INFO] Полезные ссылки
> - <https://dune.readthedocs.io/en/latest/dune-libs.html>

Пример ниже взят из библиотеки [`crypt`](https://github.com/vbmithr/ocaml-crypt). 

```
lib/config/
├── discover.ml
└── dune
```

`lib/config/dune`
```
(executable
 (name discover)
 (libraries dune-configurator))
```

`lib/config/discover.ml`
```ocaml
module C = Configurator.V1

let () =
  C.main ~name:"crypt" begin fun c ->
      if C.ocaml_config_var_exn c "system" = "macosx" then
        C.Flags.write_sexp "c_library_flags.sexp" []
      else 
        C.Flags.write_sexp "c_library_flags.sexp" [ "-lcrypt" ]
    end
```

`lib/dune`
```
(library
 ...
 (foreign_stubs ...)
 (c_library_flags
  (:include c_library_flags.sexp)))


(rule
 (targets c_library_flags.sexp)
 (action
  (run ./config/discover.exe)))
```