# Параметры выполнения

> [!NOTE] Документация
> 
> - [The runtime system](https://ocaml.org/manual/runtime.html)

### Вывод информации о работе сборщика мусора

```sh
$ OCAMLRUNPARAM="v=1024" _build/.../main.exe
```

:::details Демонстрация
```sh
$ OCAMLRUNPARAM="v=1024" ocaml main.ml
Привет, Мир!
allocated_words: 456627
minor_words: 292967
promoted_words: 29688
major_words: 193348
minor_collections: 3
major_collections: 2
forced_major_collections: 0
heap_words: 252171
top_heap_words: 252171
mean_space_overhead: 61.761102
```
:::