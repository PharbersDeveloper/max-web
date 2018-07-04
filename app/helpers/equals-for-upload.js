import { helper } from '@ember/component/helper';
/**
 * 本Helper只是用于判断上传文件的类型与设置是否相等
 * @param  {[type]} arg1 [description]
 * @return {[type]}      [description]
 */
export function equalsForUpload([arg1, arg2]) {
  return arg1 === arg2;
}

export default helper(equalsForUpload);
