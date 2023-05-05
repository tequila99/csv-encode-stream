# csv-encode-stream

Поток для трансформации массива строк (или объектов) в CSV строку

## Установка

```npm i csv-encode-stream```

или 

```yarn add csv-encode-stream```

## Использование

```javascript
const CSVStream = require('csv-encode-stream')
const writer = CSVStream([options])
```

`writer` является Transform stream

### Параметры по умолчанию

```javascript
{
  separator: ',',
  newline: '\n',
  headers: undefined,
  sendHeaders: true,
  highWaterMark: 8
}
```
Для параметра `headers` используется следующая логика:
- `headers` - массив строк. Строки будут использованы как заголовки столбцов в том же порядке, как они указаны в массиве. 
- `headers` - массив объектов с ключами `key` и `label`. В этом случае заголовками столбца являются значения из поля `label`. Поле `key` используется для адресации полей объекта данных. Порядок столбцов определяется порядком объектов в массиве `headers`. Столбцы, отсутствующие в полях `key` - не выводятся. Эта логика - для случая когда на вход потока передается объект. Если на вход потока передается массив - поле `key` - не задействуется
- если параметр не задан а на вход потока передается объект, то используются наименования ключей этого объектах. Это вариант валиден только для случая, когда в качестве данных на вход потока передается объект. 
- в случае если параметр не задан, на вход потока передается массив и параметр `sendHeaders` установлен в `true` (значение по умолчанию) - выбрасывается ошибка.

Если параметр `sendHeaders` установлен в false, строка заголовков не выводится

Пример автоматических заголовков:

```javascript
const CSVStream = require('csv-encode-stream')
const writer = CSVStream()
writer.pipe(fs.createWriteStream('out.csv'))
writer.write({ hello: 'world', foo: 'bar', baz: 'taco' })
writer.end()

// вывод в файл:
//
//  hello,foo,baz
//  world,bar,taco
```

Пример с заданным заголовком:

```javascript
const CSVStream = require('csv-encode-stream')
const writer = CSVStream({ headers: ['hello', 'foo'] })
writer.pipe(fs.createWriteStream('out.csv'))
writer.write([['world', 'bar']])
writer.end()

// вывод в файл:
//
//  hello,foo
//  world,bar
```

Пример без вывода строки заголовка:

```javascript
const CSVStream = require('csv-encode-stream')
const writer = CSVStream({ sendHeaders: false })
writer.pipe(fs.createWriteStream('out.csv'))
writer.write({hello: "world", foo: "bar", baz: "taco"})
writer.end()

// вывод в файл:
//
//   world,bar,taco
```

Тесты и инструмент для командной строки - планируются