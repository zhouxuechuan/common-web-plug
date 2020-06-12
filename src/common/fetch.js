'use strict';
import es6Promise from 'es6-promise';
import _ from 'lodash';
import moment from 'moment';
import { getSuffix } from './mime-types';
import iFetch from 'isomorphic-fetch';
import MT from 'MT';

const BASE_API_URL = '/shanxi';
es6Promise.polyfill(); // 浏览器兼容Promise
const option = {
  method: 'POST',
  body: {},
  mode: 'cors',
  cache: 'default',
  credentials: 'include', // 开启cookie支持
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
};
function _formatUrl(url) {
  return [BASE_API_URL, url].join('');
}
/**
 * 处理返回请求
 * @param options
 * @param response
 * @returns {*}
 * @private
 */
async function _handleResponse(options, response) {
  // console.log('请求返回状态：response.status: ', response.status);
  if (response instanceof Error) {
    // 网络超时
    response.status = 504;
  }
  let error = new Error();
  // 处理http request error
  switch (response.status) {
    case 201:
      return { status: response.status, blob: response.blob() };
    case 200:
      if (options.isDownload === 'download') {
        return { status: response.status, blob: response.blob() };
      }
      return response.json();
    case 400: // 参数错误
      return response.json();
    case 504:
      // 网络超时
      // 没有权限
      MT.showMessage('登录超时，请重新登录...', 'error', 2000, () => {
      });
      location.hash = '/login';
      break;
    default:
      error.status = 500;
      error.msg = '一般错误';
      break;
  }
  return error;
}
const _fetch = async function (url, options, data, overlay) {
  let loading = null;
  if (overlay) {
    loading = MT.showLoading(overlay);
  }
  let op = _.assign({}, JSON.parse(JSON.stringify(option)), options);
  let body = !_.isUndefined(data) ? data : {};
  switch (op.method) {
    case 'GET':
      delete op.body; // 不能有主体 body
      if (_.isObject(data) && !_.isArray(data)) {
        url = MT.formatGetRequestUri(url, data);
      }
      break;
    case 'POST':
      if (body instanceof window.FormData) { // 上传附件
        op.body = body;
        delete op.headers['Content-Type']; // 上传文件，不需要 Content-Type，设置了反而出错（找不到边界点）
      } else {
        op.body = JSON.stringify(body);
      }
      break;
  }
  let uri = encodeURI(_formatUrl(url));
  let response = null;
  try {
    response = await iFetch(uri, op);
  } catch (error) {
    response = error;
  } finally {
    loading && MT.closeLoading(loading);
  }
  let result = await _handleResponse(options, response);
  if (result.code === '104') {
    MT.showMessage('登录超时，请重新登录...', 'error', 2000, () => {
      // location.reload();
    });
    location.hash = '/login';
  } else {
    return result;
  }
};
/**
 * GET 请求
 * @param url 请求地址
 * @param data 请求参数
 * @param overlay 是否显示加载遮罩（可修改）
 * @returns {Promise}
 */
export function get(url, data, overlay) {
  let options = { method: 'GET' };
  return _fetch(url, options, data, overlay);
}
/**
 * POST 请求
 * @param url 请求地址
 * @param data 请求参数
 * @param overlay 是否显示加载遮罩（可修改）
 * @returns {Promise}
 */
export function post(url, data, overlay) {
  let options = { method: 'POST' };
  return _fetch(url, options, data, overlay);
}
/**
 * 下载文件
 * @param url 下载地址
 * @param data 请求数据
 * @param overlay 是否显示加载遮罩（可修改）
 * @param rename 下载文件重命名
 * @returns {Promise<*>}
 */
export async function download(url, data, overlay, rename) {
  let options = { method: 'POST', isDownload: 'download' };
  let result = await _fetch(url, options, data, overlay);
  if (result instanceof Error) {
    return result;
  }
  let blob = await result.blob;
  if (!rename) {
    rename = '文件下载';
  }
  if (blob.type === 'application/json') {
    MT.showMessage('登录超时，请重新登录...', 'error', 3000, () => {
    });
    location.hash = '/login';
    return false;
  }
  let suffix = getSuffix(blob.type);
  // console.log('下载文件后缀：', suffix);
  let fileName = `${rename + moment().format('YYYYMMDDHHmmss') + suffix}`;
  if ('msSaveOrOpenBlob' in navigator) { // Microsoft Edge and Microsoft Internet Explorer 10-11
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else { // Google Chrome, Mozilla Firefox
    let ela = document.createElement('a');
    let blobUrl = window.URL.createObjectURL(blob);
    ela.href = blobUrl;
    ela.download = fileName;
    document.body.appendChild(ela); // 火狐不兼容处理
    ela.click();
    window.setTimeout(() => {
      document.body.removeChild(ela);
    }, 100);
    // // var filename = response.headers.get('Content-Disposition'); // 这个取API返回的文件名不得行，后端API没有配置
    window.URL.revokeObjectURL(blobUrl);
  }
  return { status: result.status, blob };
}
export default {
  get,
  post,
  download
};
