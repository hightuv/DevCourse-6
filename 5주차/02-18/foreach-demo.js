const arr = [1, 2, 3, 4, 5];

/* arr.forEach((a, b, c) => {
  console.log(`a : ${a}, b: ${b}, c: ${c}`);
}); */

const map = new Map();

map.set(7, 'seven');
map.set(9, 'nine');
map.set(8, 'eight');

/* map.forEach((a, b, c) => {
  console.log(`a : ${a}, b: ${b}, c: ${c}`);
}); */

const forEachArr = arr.forEach((a) => {
  return a * 2;
});

const forEachMap = arr.map((a) => {
  return a * 2;
});

// map()은 각 요소를 변환하여 새로운 배열을 반환함
console.log(`forEach의 return 값 : ${forEachArr}, map의 return 값 : ${forEachMap}`);