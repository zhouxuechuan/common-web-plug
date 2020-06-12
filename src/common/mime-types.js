import _ from 'lodash'

const MIME_TYPES = {
  'application/json': 'error',
  'application/octet-stream': '.txt',
  'application/x-jpg': '.jpg',
  'image/jpeg': '.jpeg',
  'application/x-xls': '.xls',
  'application/x-octet-stream': '.zip',
  'application/vnd.ms-excel': '.xlsx'
}

let getSuffix = function (mimeType = '') {
  for (let key in MIME_TYPES) {
    if (mimeType.indexOf(key) !== -1) {
      return MIME_TYPES[key]
    }
  }
  return ''
}

export { MIME_TYPES, getSuffix }
