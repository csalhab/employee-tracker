DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(8,2) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);


INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

SELECT * FROM department;


INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Salesperson", 120000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 160000, 2), ("Account Manager", 160000, 3),  ("Accountant", 125000, 3),  ("Legal Team Lead", 190000, 4);

SELECT * FROM role;


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL), ("Mike", "Chan", 3, 1), ("Ashley", "Rodriguez", 3, NULL), ("Kunal", "Singh", 5, NULL), ("Malia", "Brown", 6, 4), ("Tom", "Allen", 7, NULL), ("Duane", "Reade", 1, NULL);

SELECT * FROM employee;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(emp.first_name, ' ' ,emp.last_name) AS manager
FROM employee
LEFT JOIN employee emp ON employee.manager_id = emp.id
INNER JOIN role ON role.id = employee.role_id
INNER JOIN department ON role.department_id = department.id;

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