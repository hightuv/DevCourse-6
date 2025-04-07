// 일반적인 직원 정보
class Employee {
  constructor(
    private _empName: string,
    private _age: number,
    private _empJob: string
  ) {}

  // getter & setter
  get empName() {
    return this._empName;
  }

  set empName(empName: string) {
    this._empName = empName;
  }

  printEmp = (): void => {
    console.log(`${this._empName}의 나이는 ${this._age}이고, 직업은 ${this._empJob}입니다.`);
  }
}

let employee1 = new Employee('kim', 20, 'developer');

 // 원래 setter가 없을 때는 불가능했던 로직
 // setter를 set 키워드로 만들어주면, 아래처럼 코드를 짜도 empName을 변경할 수 있음
employee1.empName = 'lee';

employee1.printEmp();