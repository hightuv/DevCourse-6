if (true) {
  var num1 = 7;
  const num2 = 3; // 블록 {} 스코프, 초기화 이후 값을 못 바꿈
  let num3 = 5; // 블록 {} 스코프, 초기화 이후 값 바꿀 수 있음

  // num2 = 10; // const 재할당 불가
  num3 = 21;

  console.log(num1 + ' X ' + num2 + ' = ' + num3);
  console.log(`${num1} X ${num2} = ${num3}`);
}

console.log(num1);
// console.log(num2);
// console.log(num3);
