const obj1 = {};
const obj2 = { message : '안 빔' };
const num = 1;
const str1 = 'one';
const str2 = ''; // 문자열도 객체임

console.log(Object.keys(obj1));
console.log(Object.keys(obj2));

console.log(Object.keys(obj1).length);
console.log(Object.keys(obj2).length);

console.log(Object.keys(num).length);
console.log(Object.keys(str1).length);
console.log(Object.keys(str2).length);

console.log(isEmpty(str1)); // false
console.log(isEmpty(str2)); // true

function isEmpty(obj) {
  // if (obj.constructor === Object) 객체인지 확인
  if (Object.keys(obj).length === 0) {
    return true;
  } else {
    return false;
  }
}