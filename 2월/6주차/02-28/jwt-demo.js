const jwt = require('jsonwebtoken'); // jwt 모듈 가져오기
const dotenv = require('dotenv'); // dotenv 모듈 가져오기
dotenv.config(); // env의 설정을 사용하겠다는 의미

// .env에서 암호키 가져오기
const privateKey = process.env.PRIVATE_KEY;

// 서명 = 토큰 발행
const token = jwt.sign({ foo: 'bar' }, privateKey);
// (payload, secret/private key)

console.log(token);

// 검증
// 검증 성공 시, 페이로드 값 확인 가능
const decoded = jwt.verify(token, privateKey);
console.log(decoded); // iat = issued at (발행 시간)
