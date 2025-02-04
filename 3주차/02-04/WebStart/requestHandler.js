function main() {
  console.log('main');
}

function login() {
  console.log('login');
}

let handle = { // key : value
  '/' : main,
  '/login' : login
};

exports.handle = handle;
