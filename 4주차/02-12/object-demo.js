let book = {
	title : 'Node.js를 공부해보자',
	price : 20000,
	description : 'Node.js 기본서'
};

function print(obj) {
  console.log(obj.title);
  console.log(obj.price);
  console.log(obj.description);
}

print(book);