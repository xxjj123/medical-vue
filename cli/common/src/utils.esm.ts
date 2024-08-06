/**
 * 这个文件是用来替代@yh/ta-utils/index.esm.js的导出
 * 因为@yh/ta-utils/index.esm.js导出了一个TaUtils，他会包含所有的方法
 * 这会导致tree-shaking失败
 */
// 对象相关的方法
import assign from '@yh/ta-utils/assign';
import objectEach from '@yh/ta-utils/objectEach';
import lastObjectEach from '@yh/ta-utils/lastObjectEach';
import objectMap from '@yh/ta-utils/objectMap';
import merge from '@yh/ta-utils/merge';
// 数组相关的方法
import map from '@yh/ta-utils/map';
import some from '@yh/ta-utils/some';
import every from '@yh/ta-utils/every';
import includeArrays from '@yh/ta-utils/includeArrays';
import arrayEach from '@yh/ta-utils/arrayEach';
import lastArrayEach from '@yh/ta-utils/lastArrayEach';
import uniq from '@yh/ta-utils/uniq';
import uniqBy from '@yh/ta-utils/uniqBy';
import union from '@yh/ta-utils/union';
import toArray from '@yh/ta-utils/toArray';
import sortBy from '@yh/ta-utils/sortBy';
import orderBy from '@yh/ta-utils/orderBy';
import shuffle from '@yh/ta-utils/shuffle';
import sample from '@yh/ta-utils/sample';
import slice from '@yh/ta-utils/slice';
import filter from '@yh/ta-utils/filter';
import findKey from '@yh/ta-utils/findKey';
import includes from '@yh/ta-utils/includes';
import find from '@yh/ta-utils/find';
import findIndex from '@yh/ta-utils/findIndex';
import findLast from '@yh/ta-utils/findLast';
import reduce from '@yh/ta-utils/reduce';
import copyWithin from '@yh/ta-utils/copyWithin';
import chunk from '@yh/ta-utils/chunk';
import zip from '@yh/ta-utils/zip';
import unzip from '@yh/ta-utils/unzip';
import zipObject from '@yh/ta-utils/zipObject';
import flatten from '@yh/ta-utils/flatten';
import pluck from '@yh/ta-utils/pluck';
import invoke from '@yh/ta-utils/invoke';
import toArrayTree from '@yh/ta-utils/toArrayTree';
import toTreeArray from '@yh/ta-utils/toTreeArray';
import findTree from '@yh/ta-utils/findTree';
import eachTree from '@yh/ta-utils/eachTree';
import mapTree from '@yh/ta-utils/mapTree';
import filterTree from '@yh/ta-utils/filterTree';
import searchTree from '@yh/ta-utils/searchTree';
import arrayIndexOf from '@yh/ta-utils/arrayIndexOf';
import arrayLastIndexOf from '@yh/ta-utils/arrayLastIndexOf';
import difference from '@yh/ta-utils/difference';
// 基础方法
import hasOwnProp from '@yh/ta-utils/hasOwnProp';
import isArray from '@yh/ta-utils/isArray';
import isNull from '@yh/ta-utils/isNull';
import isBlob from '@yh/ta-utils/isBlob';
import isNumberNaN from '@yh/ta-utils/isNaN';
import isUndefined from '@yh/ta-utils/isUndefined';
import isFunction from '@yh/ta-utils/isFunction';
import isObject from '@yh/ta-utils/isObject';
import isString from '@yh/ta-utils/isString';
import isPlainObject from '@yh/ta-utils/isPlainObject';
import isLeapYear from '@yh/ta-utils/isLeapYear';
import isDate from '@yh/ta-utils/isDate';
import eqNull from '@yh/ta-utils/eqNull';
import each from '@yh/ta-utils/each';
import indexOf from '@yh/ta-utils/indexOf';
import lastIndexOf from '@yh/ta-utils/lastIndexOf';
import keys from '@yh/ta-utils/keys';
import values from '@yh/ta-utils/values';
import clone from '@yh/ta-utils/clone';
import cloneDeep from '@yh/ta-utils/cloneDeep';
import getSize from '@yh/ta-utils/getSize';
import lastEach from '@yh/ta-utils/lastEach';
import remove from '@yh/ta-utils/remove';
import clear from '@yh/ta-utils/clear';
import isNumberFinite from '@yh/ta-utils/isFinite';
import isFloat from '@yh/ta-utils/isFloat';
import isInteger from '@yh/ta-utils/isInteger';
import isBoolean from '@yh/ta-utils/isBoolean';
import isNumber from '@yh/ta-utils/isNumber';
import isRegExp from '@yh/ta-utils/isRegExp';
import isError from '@yh/ta-utils/isError';
import isTypeError from '@yh/ta-utils/isTypeError';
import isEmpty from '@yh/ta-utils/isEmpty';
import { isEmptyValue } from '@yh/ta-utils/isEmptyValue';
import isSymbol from '@yh/ta-utils/isSymbol';
import isArguments from '@yh/ta-utils/isArguments';
import isElement from '@yh/ta-utils/isElement';
import isDocument from '@yh/ta-utils/isDocument';
import isWindow from '@yh/ta-utils/isWindow';
import isFormData from '@yh/ta-utils/isFormData';
import isMap from '@yh/ta-utils/isMap';
import isWeakMap from '@yh/ta-utils/isWeakMap';
import isSet from '@yh/ta-utils/isSet';
import isWeakSet from '@yh/ta-utils/isWeakSet';
import isMatch from '@yh/ta-utils/isMatch';
import isEqual from '@yh/ta-utils/isEqual';
import isEqualWith from '@yh/ta-utils/isEqualWith';
import getType from '@yh/ta-utils/getType';
import uniqueId from '@yh/ta-utils/uniqueId';
import findIndexOf from '@yh/ta-utils/findIndexOf';
import findLastIndexOf from '@yh/ta-utils/findLastIndexOf';
import toStringJSON from '@yh/ta-utils/toStringJSON';
import toJSONString from '@yh/ta-utils/toJSONString';
import entries from '@yh/ta-utils/entries';
import pick from '@yh/ta-utils/pick';
import omit from '@yh/ta-utils/omit';
import first from '@yh/ta-utils/first';
import last from '@yh/ta-utils/last';
import has from '@yh/ta-utils/has';
import get from '@yh/ta-utils/get';
import set from '@yh/ta-utils/set';
import groupBy from '@yh/ta-utils/groupBy';
import countBy from '@yh/ta-utils/countBy';
import range from '@yh/ta-utils/range';
import destructuring from '@yh/ta-utils/destructuring';
// 数值相关方法
import random from '@yh/ta-utils/random';
import max from '@yh/ta-utils/max';
import min from '@yh/ta-utils/min';
import commafy from '@yh/ta-utils/commafy';
import round from '@yh/ta-utils/round';
import ceil from '@yh/ta-utils/ceil';
import floor from '@yh/ta-utils/floor';
import toFixed from '@yh/ta-utils/toFixed';
import toInteger from '@yh/ta-utils/toInteger';
import toNumber from '@yh/ta-utils/toNumber';
import toNumberString from '@yh/ta-utils/toNumberString';
import add from '@yh/ta-utils/add';
import subtract from '@yh/ta-utils/subtract';
import multiply from '@yh/ta-utils/multiply';
import divide from '@yh/ta-utils/divide';
import sum from '@yh/ta-utils/sum';
import mean from '@yh/ta-utils/mean';
// 日期相关的方法
import getWhatYear from '@yh/ta-utils/getWhatYear';
import getWhatMonth from '@yh/ta-utils/getWhatMonth';
import getWhatDay from '@yh/ta-utils/getWhatDay';
import toStringDate from '@yh/ta-utils/toStringDate';
import toDateString from '@yh/ta-utils/toDateString';
import now from '@yh/ta-utils/now';
import timestamp from '@yh/ta-utils/timestamp';
import isValidDate from '@yh/ta-utils/isValidDate';
import isDateSame from '@yh/ta-utils/isDateSame';
import getWhatWeek from '@yh/ta-utils/getWhatWeek';
import getYearDay from '@yh/ta-utils/getYearDay';
import getYearWeek from '@yh/ta-utils/getYearWeek';
import getMonthWeek from '@yh/ta-utils/getMonthWeek';
import getDayOfYear from '@yh/ta-utils/getDayOfYear';
import getDayOfMonth from '@yh/ta-utils/getDayOfMonth';
import getDateDiff from '@yh/ta-utils/getDateDiff';
// 字符串相关的方法
import padEnd from '@yh/ta-utils/padEnd';
import padStart from '@yh/ta-utils/padStart';
import repeat from '@yh/ta-utils/repeat';
import trim from '@yh/ta-utils/trim';
import trimRight from '@yh/ta-utils/trimRight';
import trimLeft from '@yh/ta-utils/trimLeft';
import escape from '@yh/ta-utils/escape';
import unescape from '@yh/ta-utils/unescape';
import camelCase from '@yh/ta-utils/camelCase';
import { pascalCase } from '@yh/ta-utils/pascalCase';
import kebabCase from '@yh/ta-utils/kebabCase';
import startsWith from '@yh/ta-utils/startsWith';
import endsWith from '@yh/ta-utils/endsWith';
import template from '@yh/ta-utils/template';
import toFormatString from '@yh/ta-utils/toFormatString';
import toValueString from '@yh/ta-utils/toValueString';
// @ts-expect-error
import checkPass from '@yh/ta-utils/checkPass';
// 函数相关的方法
import noop from '@yh/ta-utils/noop';
import property from '@yh/ta-utils/property';
import bind from '@yh/ta-utils/bind';
import once from '@yh/ta-utils/once';
import after from '@yh/ta-utils/after';
import before from '@yh/ta-utils/before';
import throttle from '@yh/ta-utils/throttle';
import debounce from '@yh/ta-utils/debounce';
import delay from '@yh/ta-utils/delay';
// 地址相关的方法
import { unserialize } from '@yh/ta-utils/unserialize';
import { getNowPageParam } from '@yh/ta-utils/getNowPageParam';
import { serialize } from '@yh/ta-utils/serialize';
import { objectToUrlParam } from '@yh/ta-utils/objectToUrlParam';
import parseUrl from '@yh/ta-utils/parseUrl';
// 浏览器相关的方法
import getBaseURL from '@yh/ta-utils/getBaseURL';
import locat from '@yh/ta-utils/locat';
import cookie from '@yh/ta-utils/cookie';
import browse from '@yh/ta-utils/browse';
import {
  dateDiff,
  dateToMoment,
  dateToString,
  getCurDate,
  getCurDateFullTime,
  getCurDateMonth,
  getCurDateTime,
  getCurDateYear,
  getCurIssue,
  getCurQuarter,
  getMoment,
  isDateString,
  isDateTime,
  isTime,
  momentArrayToStringArray,
  momentToDate,
  momentToString,
  stringArrayToMomentArray,
  StringToDate,
  stringToMoment,
  isMoment,
} from '@yh/ta-utils/moment';
// webstorage
import { createWebStorage, init } from '@yh/ta-utils/webStorages';
import { getStorage } from '@yh/ta-utils/getStorage';
// sorter
import { sortWithCharacter, sortWithLetter, sortWithNumber } from '@yh/ta-utils/sorter';
import pinyin from '@yh/ta-utils/pinyin';
import { capitalize } from '@yh/ta-utils/capitalize';
// browser
import { copyText } from '@yh/ta-utils/clipboard';

// 加密
// @ts-expect-error
import crypto from '@yh/ta-utils/crypto';

// Compressor
import compressor from '@yh/ta-utils/compressor';

// import encryption from '@yh/ta-utils/encryption'
import {
  clientBrowser,
  clientScreenSize,
  clientSystem,
  isChrome,
  isFireFox,
  isIE,
  isIE10,
  isIE11,
  isIE9,
  isSafari,
  isSilversea,
  notSupported,
} from '@yh/ta-utils/browser';
import { getCookie, getToken, setCookie } from '@yh/ta-utils/cookies';
import { cnMoneyFormat, dataSensitive, floatAdd, moneyFormat } from '@yh/ta-utils/data';
import { getHeight, getStyle, getWidth } from '@yh/ta-utils/element';
import { macauIdCard } from '@yh/ta-utils/macauIdCard';
import { hkIdVerify } from '@yh/ta-utils/hkIdVerify';
import { validate2ndIdCard } from '@yh/ta-utils/validate2ndIdCard';
import { getLodop } from '@yh/ta-utils/getLodop';
import forOf from '@yh/ta-utils/forOf';
import partition from '@yh/ta-utils/partition';
import lastForOf from '@yh/ta-utils/lastForOf';

// uuid
import uuid from '@yh/ta-utils/uuid';
import { uuidV4 } from '@yh/ta-utils/uuidV4';

import hotKey from '@yh/ta-utils/hotKey';

// @ts-expect-error
import AsyncValidator from '@yh/ta-utils/async-validator';
import validator from '@yh/ta-utils/validator';

import { getTwoCharLength } from '@yh/ta-utils/getTwoCharLength';
import { getRandom } from '@yh/ta-utils/getRandom';
import { getRegexp } from '@yh/ta-utils/getRegexp';
import { evalReplacer } from '@yh/ta-utils/evalReplacer';
import { validURL } from '@yh/ta-utils/validURL';
import { validIP } from '@yh/ta-utils/validIP';
import { validIPv4 } from '@yh/ta-utils/validIPv4';
import { validIPv6 } from '@yh/ta-utils/validIPv6';
const { format, formatWithReq, formatWithIndex } = dataSensitive;

const webStorage = {
  init,
  createWebStorage,
};
const toString = toValueString;
const isFinite = isNumberFinite;
const isNaN = isNumberNaN;
export {
  // object
  assign,
  objectEach,
  lastObjectEach,
  objectMap,
  merge,
  // array
  uniq,
  union,
  sortBy,
  orderBy,
  shuffle,
  sample,
  some,
  every,
  slice,
  filter,
  find,
  findLast,
  findKey,
  includes,
  arrayIndexOf,
  arrayLastIndexOf,
  difference,
  map,
  reduce,
  copyWithin,
  chunk,
  zip,
  unzip,
  zipObject,
  flatten,
  toArray,
  includeArrays,
  pluck,
  invoke,
  arrayEach,
  lastArrayEach,
  toArrayTree,
  toTreeArray,
  findTree,
  eachTree,
  mapTree,
  filterTree,
  searchTree,
  // base
  hasOwnProp,
  eqNull,
  isNumberNaN,
  isNumberFinite,
  isUndefined,
  isArray,
  isFloat,
  isInteger,
  isFunction,
  isBoolean,
  isString,
  isNumber,
  isRegExp,
  isObject,
  isPlainObject,
  isDate,
  isError,
  isTypeError,
  isEmpty,
  isEmptyValue,
  isNull,
  isBlob,
  isSymbol,
  isArguments,
  isElement,
  isDocument,
  isWindow,
  isFormData,
  isMap,
  isWeakMap,
  isSet,
  isWeakSet,
  isLeapYear,
  isMatch,
  isEqual,
  isEqualWith,
  getType,
  uniqueId,
  getSize,
  indexOf,
  lastIndexOf,
  findIndexOf,
  findLastIndexOf,
  toStringJSON,
  toJSONString,
  keys,
  values,
  entries,
  pick,
  omit,
  first,
  last,
  each,
  lastEach,
  has,
  get,
  set,
  groupBy,
  countBy,
  clone,
  cloneDeep,
  clear,
  remove,
  range,
  destructuring,
  // number
  random,
  min,
  max,
  commafy,
  round,
  ceil,
  floor,
  toFixed,
  toNumber,
  toNumberString,
  toInteger,
  add,
  subtract,
  multiply,
  divide,
  sum,
  mean,
  // date
  now,
  timestamp,
  isValidDate,
  isDateSame,
  toStringDate,
  toDateString,
  getWhatYear,
  getWhatMonth,
  getWhatWeek,
  getWhatDay,
  getYearDay,
  getYearWeek,
  getMonthWeek,
  getDayOfYear,
  getDayOfMonth,
  getDateDiff,
  // string
  trim,
  trimLeft,
  trimRight,
  escape,
  unescape,
  camelCase,
  pascalCase,
  kebabCase,
  repeat,
  padStart,
  padEnd,
  startsWith,
  endsWith,
  template,
  toFormatString,
  toValueString,
  checkPass,
  // function
  noop,
  property,
  bind,
  once,
  after,
  before,
  throttle,
  debounce,
  delay,
  // url
  unserialize,
  getNowPageParam,
  objectToUrlParam,
  serialize,
  parseUrl,
  // web
  getBaseURL,
  locat,
  browse,
  cookie,
  // ui-util
  // moment.util
  // moment.util
  stringToMoment,
  isMoment,
  stringArrayToMomentArray,
  momentToString,
  momentArrayToStringArray,
  getMoment,
  dateToMoment,
  dateToString,
  momentToDate,
  isTime,
  isDateString,
  isDateTime,
  getCurDate,
  getCurDateMonth,
  getCurDateFullTime,
  getCurQuarter,
  getCurIssue,
  getCurDateYear,
  StringToDate,
  dateDiff,
  getCurDateTime,
  webStorage,
  createWebStorage,
  getStorage,
  // sorter
  sortWithNumber,
  sortWithLetter,
  sortWithCharacter,
  // pinyin
  pinyin,
  capitalize,
  getLodop,
  validate2ndIdCard,
  hkIdVerify,
  macauIdCard,
  // element
  getWidth,
  getStyle,
  getHeight,
  // data
  format,
  formatWithReq,
  formatWithIndex,
  moneyFormat,
  cnMoneyFormat,
  floatAdd,
  // cookie
  getToken,
  getCookie,
  setCookie,
  // browser
  isIE,
  notSupported,
  isIE9,
  isIE10,
  isIE11,
  isChrome,
  isFireFox,
  isSafari,
  isSilversea,
  clientSystem,
  clientScreenSize,
  clientBrowser,
  // tool-util
  copyText,
  // encryption,
  crypto,
  compressor,
  uniqBy,
  findIndex,
  toString,
  partition,
  isFinite,
  isNaN,
  forOf,
  lastForOf,
  uuid,
  uuidV4,
  hotKey,
  validator,
  AsyncValidator,
  dataSensitive,
  getTwoCharLength,
  getRandom,
  getRegexp,
  evalReplacer,
  validURL,
  validIP,
  validIPv4,
  validIPv6,
};
