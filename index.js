const { Transform } = require('node:stream')

const transformValue = val => {
  if (typeof val === 'string') {
    return '"' + val.replace(/"/g, '""') + '"'
  } else if (typeof val === 'object') {
    return  JSON.stringify(val)
  } else if (['boolean', 'number'].includes(typeof val)) {
    return String(val)
  } 
  return 'null'
}

const CSVStream = (opts = {}) => {
  const sendHeaders = opts.sendHeaders !== false
  const separator = opts.separator || ','
  const newline = opts.newline || '\n'    
  
  let headers

  let firstRow = true

  const arrRow = row => row.reduce((acc, el) => {
      acc += transformValue(el)
      return acc + separator
    }, '')

  const objRow = row => typeof headers[0] === 'object'
    ?  headers.reduce((acc, el) => {
        acc += transformValue(row[el.key])
        return acc + separator
      }, '')
    : Object.keys(row).reduce((acc, el) => {
      acc += transformValue(row[el])
      return acc + separator
      }, '')

  const transformRow = row => {    
    const rawRow = Array.isArray(row) ? arrRow(row) : objRow(row)    
    return rawRow.slice(0, -1) + newline
  }

  return new Transform({
    objectMode: true,
    highWaterMark: opts.highWaterMark || 8,
    transform (row, encoding, done) {
      try {
        const isArray = Array.isArray(row)
        if (firstRow) {
          firstRow = false
          if (opts?.headers) {
            headers = opts.headers
          } else {
            headers = !isArray
              ? Object.keys(row).map(key => ({ key, label: key }))
              : null
          }
          if (isArray && sendHeaders && !headers) throw new Error('No headers specified')
          if (sendHeaders) this.push(transformRow(headers.map(el => el?.label || el)))
        }
        
        this.push(transformRow(row))

        done()
      } catch (error) {
        done(error)
      }
    }
  })
}

module.exports = CSVStream
CSVStream.CSVStream = CSVStream
