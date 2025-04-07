// 일반적인 직원 정보
var Employee = /** @class */ (function () {
    function Employee(_empName, _age, _empJob) {
        var _this = this;
        this._empName = _empName;
        this._age = _age;
        this._empJob = _empJob;
        this.printEmp = function () {
            console.log("".concat(_this._empName, "\uC758 \uB098\uC774\uB294 ").concat(_this._age, "\uC774\uACE0, \uC9C1\uC5C5\uC740 ").concat(_this._empJob, "\uC785\uB2C8\uB2E4."));
        };
    }
    Object.defineProperty(Employee.prototype, "empName", {
        // getter & setter
        get: function () {
            return this._empName;
        },
        set: function (empName) {
            this._empName = empName;
        },
        enumerable: false,
        configurable: true
    });
    return Employee;
}());
var employee1 = new Employee('kim', 20, 'developer');
// 원래 setter가 없을 때는 불가능했던 로직
// setter를 set 키워드로 만들어주면, 아래처럼 코드를 짜도 empName을 변경할 수 있음
employee1.empName = 'lee';
employee1.printEmp();
