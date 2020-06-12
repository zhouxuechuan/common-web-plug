'use strict'
import { get, post, download } from './fetch'
import lodash from 'lodash'
import moment from 'moment'
import { Message, Loading } from 'element-ui'

const NAMESPACE = 'zhouxuechuan'
/**
 * 将key用NAMESPACE包装
 * @param key
 * @private
 */
let _getNamespaceKey = function (key) {
  return [NAMESPACE, key].join('_')
}
/**
 * 获取sessionstorage中存储的对象
 * @param key
 */
let getSessionStorage = function (key) {
  let value = window.sessionStorage.getItem(_getNamespaceKey(key))
  try {
    value = JSON.parse(value)
  } catch (e) {
    // 不是JSON字符串
  }
  return value
}
/**
 * 获取 localStorage 中存储的对象
 * @param key
 */
let getLocalStorage = function (key) {
  let value = window.localStorage.getItem(_getNamespaceKey(key))
  try {
    value = JSON.parse(value)
  } catch (e) {
    // 不是JSON字符串
  }
  return value
}
/**
 * 向 sessionStorage 存储对象
 * @param key
 * @param value
 */
let setSessionStorage = function (key, value) {
  window.sessionStorage.setItem(
    _getNamespaceKey(key),
    lodash.isPlainObject(value) || lodash.isArray(value) ? JSON.stringify(value) : value
  )
}
/**
 * 向localStorage存储对象
 * @param key
 * @param value
 */
let setLocalStorage = function (key, value) {
  window.localStorage.setItem(
    _getNamespaceKey(key),
    lodash.isPlainObject(value) || lodash.isArray(value) ? JSON.stringify(value) : value
  )
}
/**
 * 从sessionstorage移除对象
 * @param key
 */
let removeSessionStorage = function (key) {
  window.sessionStorage.removeItem(_getNamespaceKey(key))
}
/**
 * 从sessionstorage移除所有
 */
let clearSessionStorage = function () {
  window.sessionStorage.clear()
}
/**
 * 从localStorage移除对象
 * @param key
 */
let removeLocalStorage = function (key) {
  window.localStorage.removeItem(_getNamespaceKey(key))
}
/**
 * 格式化 Get 请求uri
 * @params uri 例如：/api/demo
 * @params params 参数 例如：{ userName:'www',url:'xxmi.cn'}
 * @returns {*} 返回值 例如：/api/demo?userName=www&url=xxmi.cn
 */
let formatGetRequestUri = function (uri, params) {
  let arr = []
  for (let p in params) {
    if (params[p] !== '' && params[p] !== null) {
      arr.push([p, '=', params[p]].join(''))
    }
  }
  if (uri.indexOf('?') === -1 && arr.length > 0) {
    uri = uri.concat('?')
  }
  if (arr.length > 0) {
    if (uri.charAt(uri.length - 1) !== '?') {
      uri = uri.concat('&')
    }
    uri = uri.concat(arr.join('&'))
  }
  return uri
}
/**
 * 显示loading加载（可以是多实例）
 * 需要注意的是，以服务的方式调用的全屏 Loading 是单例的：
 * 若在前一个全屏 Loading 关闭前再次调用全屏 Loading，
 * 并不会创建一个新的 Loading 实例，
 * 而是返回现有全屏 Loading 的实例
 * @param option 参考el-loading
 * @return Loading实例
 */
let showLoading = function (option) {
  let defaults = { text: '加载中', spinner: 'el-icon-loading', target: '.layout' }
  if (option && option.spinner === false) {
    option.text = ''
  }
  option = Object.assign({}, defaults, option)
  return Loading.service(option)
}
/**
 * 关闭loading加载
 * @param inst
 */
let closeLoading = function (inst) {
  setTimeout(() => {
    try {
      inst.close()
    } catch (e) {
    }
  }, 0)
}
/**
 * 显示消息提示框
 * @param msg
 * @param type 默认值：'error'
 * @param duration
 * @param onclose 关闭时的回调
 * @return {*}
 */
let showMessage = function (msg, type, duration, onclose) {
  let defaults = { duration: 3000, type: 'error', showClose: true }
  let option
  if (lodash.isPlainObject(msg)) {
    option = msg
  } else {
    option = {
      message: msg,
      type,
      duration,
      onClose: onclose
    }
  }
  if (!option.message) {
    throw Error('[message] is required')
  }
  option = lodash.merge({}, defaults, option)
  return Message(option)
}
/**
 * 关闭消息提示框
 * @param inst
 */
let closeMessage = function (inst) {
  if (!inst) {
    console.warn('[inst] is null or empty!', inst)
    return
  }
  inst.close()
}
/**
 * 获取公用数据类型列表
 * @returns {Promise<any>}
 */
let loadDataType = async function () {
  let result = await post('/getDataType', {}, false)
  if (result && result.code === '0') {
    let list = result.data.list || []
    setSessionStorage('DEFAULT_DATA_TYPE', list)
  }
}
/**
 * 获取公用要素类型列表
 * @returns {Promise<any>}
 */
let loadElementType = async function () {
  let result = await post('/getElementType', {}, false)
  if (result && result.code === '0') {
    let list = result.data.list || []
    setSessionStorage('DEFAULT_ELEMENT_TYPE', list)
  }
}
let loadDefaultData = async function () {
  await loadDataType()
  await loadElementType()
  // await loadElementTypeTime();
}
/**
 * 获取公用要素类型,数据类型时间列表
 * @returns {Promise<any>}
 */
let loadElementTypeTime = async function () {
  let list = getSessionStorage('DEFAULT_ELEMENT_TYPE_TIME')
  if (!list) {
    let result = await post('/latestData/query', {}, false)
    if (result && result.code === '0') {
      list = result.data.obj || []
      setSessionStorage('DEFAULT_ELEMENT_TYPE_TIME', list)
    }
  }
  return list
}
/**
 * 获取当前最新资料对应得要素时间
 * @param dataType
 * @param elementType
 */
let checkElementTypeTime = async function (dataType, elementType) {
  let list = await loadElementTypeTime()
  let time = list[dataType][elementType]
  if (!time) {
    time = list[dataType]['021007']
  }
  if (!time) {
    time = list[dataType]['021008']
  }
  if (!time) {
    time = list[dataType]['021000']
  }
  return moment(time).format('YYYY-MM-DD 00:00:00')
}
/*
 字符串换行
 value:需要换行的字符串
 length:超过此长度换行（中文＊2）
 */
let formatCharts = function (value, length) {
  let res = ''
  let lines = 0
  let objLength = 0
  for (let i = 0, l = value.length; i < l; i++) {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(value[i])) {
      objLength = objLength + 2
      if ((i < (l - 1)) && ((objLength) % length === 0) && i !== 0) {
        res += value[i]
        res = res + '\n'
        lines++
      } else if ((i < (l - 1)) && (parseInt((objLength) / length) > lines) && i !== 0) {
        res = res + '\n' + value[i]
        lines++
      } else {
        res += value[i]
      }
    } else {
      objLength = objLength + 1
      res += value[i]
      if ((i < (l - 1)) && ((objLength) % length === 0) && i !== 0) {
        res = res + '\n'
        lines++
      }
    }
  }
  return res
}
// 计算每月最后一天
let countMonthLastDay = function (date) {
  date = moment(date)
  let year = date.format('YYYY')
  let month = date.format('MM')
  let upDate = new Date(year, month, 0)
  return dateRepairZero(upDate.getDate())
}
// 日期补0 并转字符串
let dateRepairZero = function (num) {
  let str = ''
  if (parseInt(num) < 10) {
    str = '0' + num
  } else {
    str = '' + num
  }
  return str
}
// ehcart无数据提示
let echartsnoDataTip = function (option) {
  let defaults = {
    text: '暂无数据!',
    spinner: 'ss',
    target: '.layout',
    customClass: 'echartsnoData',
    background: 'rgba(255, 255, 255, 0)'
  }
  if (option && option.spinner === false) {
    option.text = ''
  }
  option = Object.assign({}, defaults, option)
  return Loading.service(option)
}
/**
 * 关闭ehcart无数据提示
 * @param inst
 */
let closeEchartsnoData = function (inst) {
  setTimeout(() => {
    try {
      inst.close()
    } catch (e) {
    }
  }, 0)
}
export default {
  get,
  post,
  download,
  removeLocalStorage,
  removeSessionStorage,
  formatGetRequestUri,
  setLocalStorage,
  setSessionStorage,
  getLocalStorage,
  getSessionStorage,
  clearSessionStorage,
  showLoading,
  closeLoading,
  showMessage,
  closeMessage,
  loadDataType,
  loadElementType,
  loadElementTypeTime,
  checkElementTypeTime,
  loadDefaultData,
  formatCharts,
  countMonthLastDay,
  echartsnoDataTip,
  closeEchartsnoData
}
