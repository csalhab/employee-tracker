
INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

SELECT * FROM department;

-- ========================================

--("Sales"), ("Engineering"), ("Finance"), ("Legal");
-- department_id 1/Sales, 2/Engineering, 3/Finance, 4/Legal

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Salesperson", 120000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 160000, 2), ("Account Manager", 160000, 3),  ("Accountant", 125000, 3),  ("Legal Team Lead", 190000, 4);

SELECT * FROM role;

-- TODO: even though department_id column shows INT value in role's table, maybe for results return department's table's name column instead (for later)

-- ========================================

-- for employee manager_id, it is FK to same table/employee table id column/value
-- TODO: even though role_id column shows INT value in employee's table, maybe for results return role's table's title column instead (for later)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL), ("Mike", "Chan", 2, 1), ("Ashley", "Rodriguez", 2, NULL), ("Kunal", "Singh", 3, NULL), ("Malia", "Brown", 3, 4), ("Tom", "Allen", 4, NULL), ("Duane", "Reade", 1, NULL);

-- VIEW ALL EMPLOYEES 
-- self join applied on LEFT JOIN employee emp ..
-- alias AS applied on department.name to appear as department on column header
-- alias AS applied for showing manager column header instead of manager_id, this needed concatenating 2 columns for result too
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(emp.first_name, ' ' ,emp.last_name) AS manager
FROM employee
LEFT JOIN employee emp ON employee.manager_id = emp.id
INNER JOIN role ON role.id = employee.role_id
INNER JOIN department ON role.department_id = department.id;

-- VIEW ALL EMPLOYEES BY DEPARTMENT
-- value "Engineering" needs to be dynamically provided by prompt
SELECT employee.id, employee.first_name, employee.last_name, role.title 
FROM employee
INNER JOIN role ON role.id = employee.role_id
INNER JOIN department ON role.department_id = department.id WHERE department.name = "Engineering";

-- VIEW BY EMPLOYEES ID FIRST NAME LAST NAME .. used for choices input!
SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employees
FROM employee
LEFT JOIN employee emp ON employee.manager_id = emp.id
INNER JOIN role ON role.id = employee.role_id
INNER JOIN department ON role.department_id = department.id;

-- VIEW BY MANAGER
SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title
FROM employee
LEFT JOIN employee emp ON employee.manager_id = emp.id
INNER JOIN role ON role.id = employee.role_id
INNER JOIN department ON role.department_id = department.id
WHERE employee.manager_id = 4;