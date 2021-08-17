
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

SELECT * FROM employee;

