# csv-encode-stream

Поток для трансформации массивов строк (или объектов) в CSV строки

## Установка

```npm i csv-encode-stream```

или 

```yarn add csv-encode-stream```

## Использование

```javascript
const CSVStream = require('csv-encode-stream')
const writer = CSVStream([options])
```

`writer` является двунаправленным потоком (duplex stream)

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
`headers` может быть массивом строк. Если параметр не задан, используются наименования ключей первой строки в переданном массиве данных. 

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
writer.write([['world', 'bar', 'taco']])
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