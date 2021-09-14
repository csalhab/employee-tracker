//DEPENDENCIES ========================================
//Include packages needed for this application
const logo = require("asciiart-logo");
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",
  password: "mySQL_1125",
  database: "employee_trackerDB",
});

//DATA =====================================================
let employeesArray = [];
const departmentsArray = [];
let rolesArray = [];

//Inquirer Prompt Questions
//Create an array of choices for 1st question "What would you like to do?"
const questionSelectWhatToDo = [
  {
    type: "list",
    name: "whatToDo",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Employees By Department",
      "View All Employees By Manager",
      "Add Employee",
      "Add A Role",
      "Add A Department",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "EXIT",
    ],
  },
];

//Create an array of question for user input on View All Employees By Department
const questionEmployeesByDepartment = [
  {
    type: "input",
    name: "byDepartment",
    message: "Which department would you like to see employees for?",
  },
];

//Create an array of questions for user input on Add Employee
const questionEmployeeInfo = [
  {
    type: "input",
    name: "employeeFirstName",
    message: "What is the employee's first name?",
  },
  {
    type: "input",
    name: "employeeLastName",
    message: "What is the employee's last name?",
  },
  {
    type: "list",
    name: "employeeRole",
    message: "What is the employee's role?",
    choices: rolesArray,
  },
  {
    type: "list",
    name: "employeeManager",
    message: "Who is the employee's manager?",
    choices: employeesArray,
  },
];

//Create an array of questions for user input on Add A Role
const questionRoleInfo = [
  {
    type: "input",
    name: "newRoleTitle",
    message: "What is the title of the role to be added?",
  },
  {
    type: "input",
    name: "newRoleSalary",
    message: "What is the salary of the role being added?",
  },
  {
    type: "list",
    name: "newRoleDept",
    message: "What is the deparatment of this role being added?",
    choices: departmentsArray,
  },
];

//Create an array of question for user input on Add A Department
const questionDeptInfo = [
  {
    type: "input",
    name: "newDeptTitle",
    message: "What is the title of the department to be added?",
  },
];

//Create an array of question for user input on Update Employee's Role
const questionUpdateEmployeeRole = [
  {
    type: "list",
    name: "employeeFirstNameUpdateRole",
    message: "Which employee's role do you want to update?",
    // choices: [
    //   "John Doe",
    //   "Mike Chan",
    //   "Ashley Rodriguez",
    //   "Kunal Singh",
    //   "Malia Brown",
    //   "Tom Allen",
    //   "Duane Reade",
    // ],
    choices: employeesArray,
  },
  {
    type: "list",
    name: "employeeRoleUpdateRole",
    message: "Which role do you want to assign the selected employee?",
    // choices: [
    //   "Sales Lead",
    //   "Salesperson",
    //   "Lead Engineer",
    //   "Software Engineer",
    //   "Account Manager",
    //   "Accountant",
    //   "Legal Team Lead",
    // ],
    choices: rolesArray,
  },
  //success, answer: Updated employee's role
  //success, View All Employees shows newly updated employee results
];

//Create an array of question for user input on Delete Employee
const questionDeleteEmployee = [
  {
    type: "list",
    name: "employeeNameDelete",
    message: "Which employee do you want to delete?",
    choices: employeesArray,
  },
];

//Create an array of question for user input on Update Employee's Manager
const questionUpdateEmployeeManager = [
  {
    type: "list",
    name: "employeeNameUpdateManager",
    message: "Which employee's manager do you want to update?",
    // choices: [
    //   "John Doe",
    //   "Mike Chan",
    //   "Ashley Rodriguez",
    //   "Kunal Singh",
    //   "Malia Brown",
    //   "Tom Allen",
    //   "Duane Reade",
    // ],
    choices: employeesArray,
  },
  {
    type: "list",
    name: "employeeUpdateManager",
    message: "Which manager do you want to assign the selected employee?",
    // choices: [
    //   "Sales Lead",
    //   "Salesperson",
    //   "Lead Engineer",
    //   "Software Engineer",
    //   "Account Manager",
    //   "Accountant",
    //   "Legal Team Lead",
    // ],
    choices: employeesArray,
  },
  //success, answer: Updated employee's manager
  //success, View All Employees shows newly updated employee results
];

//FUNCTIONS ================================================
//Connect to the DB
function connectDB() {
  connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
  });
}

function viewAllEmployees() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(emp.first_name, ' ' ,emp.last_name) AS manager FROM employee LEFT JOIN employee emp ON employee.manager_id = emp.id INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON role.department_id = department.id;",
    (err, res) => {
      if (err) throw err;
      doConsoleTable(res);
      kickOffPromptQuestionWhatToDo();
    }
  );
}

const viewAllEmployeesByDept = async () => {
  const { byDepartment } = await inquirer.prompt(questionEmployeesByDepartment);
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON role.department_id = department.id WHERE department.name = "${byDepartment}"`,
    (err, res) => {
      if (err) throw err;
      doConsoleTable(res);
      kickOffPromptQuestionWhatToDo();
    }
  );
};

const viewAllEmployeesByManager = () => {
  connection.query(
    `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employees
    FROM employee
    LEFT JOIN employee emp ON employee.manager_id = emp.id
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON role.department_id = department.id;`,
    async (err, res) => {
      if (err) throw err;
      const employeesByManager = res.map(
        ({ id, employees }) => id + " " + employees
      );
      const { byManager } = await inquirer.prompt([
        {
          type: "list",
          name: "byManager",
          message: "Which employee do you want to see direct reports for?",
          choices: employeesByManager,
        },
      ]);
      //this holds the employee user selected to search on View All Employees By Manager
      let byManagerSelected = byManager.split(" ");
      connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title, CONCAT(emp.first_name, ' ' ,emp.last_name) AS manager
        FROM employee
        LEFT JOIN employee emp ON employee.manager_id = emp.id
        INNER JOIN role ON role.id = employee.role_id
        INNER JOIN department ON role.department_id = department.id
        WHERE employee.manager_id = ${byManager[0]};`,
        async (err, res) => {
          if (err) throw err;
          if (res.length > 0) {
            doConsoleTable(res);
          } else {
            console.log("\nThe selected employee has no direct reports\n");
          }
          kickOffPromptQuestionWhatToDo();
        }
      );
    }
  );
};

function addEmployee() {
  //this function builds employeesArray which questionEmployeeInfo employeeManager choices has as its value
  getEmployees();
  //this function builds rolesArray which questionEmployeeInfo employeeRole choices has as it values
  getRoles();
  inquirer.prompt(questionEmployeeInfo).then(function (empInfo) {
    console.log(empInfo);
    const empRole = empInfo.employeeRole.split(" ");
    if (empInfo.employeeManager === "None") {
      empInfo.employeeManager = null;
    }
    if (empInfo.employeeManager != null) {
      const empManager = empInfo.employeeManager.split(" ");
      connection.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${empInfo.employeeFirstName}", "${empInfo.employeeLastName}", ${empRole[0]}, ${empManager[0]})`,
        (err, res) => {
          if (err) throw err;
          console.log(
            "\nAdded " +
              empInfo.employeeFirstName +
              empInfo.employeeLastName +
              " to the database\n"
          );
          kickOffPromptQuestionWhatToDo();
        }
      );
    } else {
      connection.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES ("${empInfo.employeeFirstName}", "${empInfo.employeeLastName}", ${empRole[0]}, ${empInfo.employeeManager})`,
        (err, res) => {
          if (err) throw err;
          console.log(
            "\nAdded " +
              empInfo.employeeFirstName +
              empInfo.employeeLastName +
              " to the database\n"
          );
          kickOffPromptQuestionWhatToDo();
        }
      );
    }
  });
}

const addDepartment = async () => {
  const { newDeptTitle } = await inquirer.prompt([
    {
      type: "input",
      name: "newDeptTitle",
      message: "What is the title of the department to be added?",
    },
  ]);
  connection.query(
    `INSERT INTO department (name) 
    VALUES ("${newDeptTitle}")`,
    (err, res) => {
      if (err) throw err;
      console.log("\nAdded " + newDeptTitle + " to the database.\n");
      kickOffPromptQuestionWhatToDo();
    }
  );
};

const addRole = async () => {
  //this retrieves all departments from the db
  getDepartments();
  const { newRoleTitle, newRoleSalary, newRoleDept } = await inquirer.prompt(
    questionRoleInfo
  );
  //only need the id, [0], part of this value
  const roleDept = newRoleDept.split(" ");

  connection.query(
    `INSERT INTO role (title, salary, department_id)
    VALUES ("${newRoleTitle}", ${newRoleSalary}, ${roleDept[0]})`,
    (err, res) => {
      if (err) throw err;
      console.log("\nAdded " + newRoleTitle + " to the database.\n");
      kickOffPromptQuestionWhatToDo();
    }
  );
};

// TODO: Create a function to ...
const removeEmployee = async () => {
  console.log("inside removeEmployee!!!");
  //this function builds employeesArray which questionEmployeeInfo employeeManager choices has as its value
  getEmployees();
  console.log(employeesArray);
  const { employeeNameDelete } = await inquirer.prompt(questionDeleteEmployee);
  console.log("employee name to be deleted:");
  console.log(employeeNameDelete);

  const empName = employeeNameDelete.split(" ");
  console.log(empName[0]);
  console.log(empName[1]);
  /* 
    ? is a placeholder for values to be escaped & its value is an array
    single use is just value in the array
    multiple ?, array then holds in order the values 

  */
  connection.query(
    `DELETE FROM employee WHERE id = ?`,
    [empName[0]],
    (err, res) => {
      if (err) throw err;
      console.log("Deleted " + employeeNameDelete + " from the database.\n");
      kickOffPromptQuestionWhatToDo();
    }
  );
};

const updateEmployeeRole = async () => {
  console.log("inside updateEmpRole!!!");
  //this function builds employeesArray which questionEmployeeInfo employeeManager choices has as its value
  getEmployees();
  console.log(employeesArray);
  //this function builds rolesArray which questionEmployeeInfo employeeRole choices has as it values
  getRoles();
  console.log(rolesArray);
  const { employeeFirstNameUpdateRole, employeeRoleUpdateRole } =
    await inquirer.prompt(questionUpdateEmployeeRole);
  console.log("employee name whose role is to be update:");
  console.log(employeeFirstNameUpdateRole);
  console.log("role employee is now updated to:");
  console.log(employeeRoleUpdateRole);

  const empName = employeeFirstNameUpdateRole.split(" ");
  const empRole = employeeRoleUpdateRole.split(" ");
  console.log(empName[0]);
  console.log(empName[1]);
  console.log(empRole[0]);
  console.log(empRole[1]);
  /* 
    ? is a placeholder for values to be escaped & its value is an array
    single use is just value in the array
    multiple ?, array then holds in order the values 

  */
  connection.query(
    `UPDATE employee SET role_id = ? WHERE id = ?`,
    [empRole[0], empName[0]],
    (err, res) => {
      if (err) throw err;
      console.log(
        "\nUpdated " +
          empName +
          " to new role of " +
          empRole +
          " in the database.\n"
      );
      kickOffPromptQuestionWhatToDo();
    }
  );
};

// TODO: Create a function to ...
function updateEmployeeManager() {}

function getRoles() {
  connection.query(`SELECT * FROM role;`, (err, res) => {
    if (err) throw err;
    res.forEach(({ id, title }) => {
      rolesArray.push(`${id} ${title}`);
    });
  });
}
function getDepartments() {
  connection.query(`SELECT * FROM department;`, (err, res) => {
    if (err) throw err;
    res.forEach(({ id, name }) => {
      departmentsArray.push(`${id} ${name}`);
    });
  });
}

function getEmployees() {
  connection.query(`SELECT * FROM employee;`, (err, res) => {
    if (err) throw err;
    res.forEach(({ id, first_name, last_name }) => {
      employeesArray.push(`${id} ${first_name} ${last_name}`);
    });
    employeesArray.push("None");
  });
  console.log("getEmployees() results: ", employeesArray);
}

function doConsoleTable(response) {
  const table = cTable.getTable(response);
  console.log(table);
}

function doAsciiArt() {
  console.log(
    logo({
      name: "Employee Manager",
      borderColor: "yellow",
      logoColor: "bold-cyan",
      textColor: "gray",
    })
      .emptyLine()
      .right("version 1.0.0")
      .emptyLine()
      .render()
  );
}

//function to kick off the prompt questions with What Woud You Like To Do?
//changed from regular function to async/await and with destructering, less code!
const kickOffPromptQuestionWhatToDo = async () => {
  //{ whatToDO } is destructering!
  const { whatToDo } = await inquirer.prompt(questionSelectWhatToDo);
  switch (whatToDo) {
    case "View All Employees":
      return viewAllEmployees();
    case "View All Employees By Department":
      viewAllEmployeesByDept();
      return;
    case "View All Employees By Manager":
      viewAllEmployeesByManager();
      return;
    case "Add A Department":
      addDepartment();
      return;
    case "Add A Role":
      addRole();
      return;
    case "Add Employee":
      addEmployee();
      return;
    case "Remove Employee":
      removeEmployee();
      return;
    case "Update Employee Role":
      updateEmployeeRole();
      return;
    case "Update Employee Manager":
      updateEmployeeManager();
      return;
    case "EXIT":
      return connection.end();
  }
};

//USER INTERACTIONS ========================================
//initialize app, display ascii art & trigger all the questions prompt
function init() {
  doAsciiArt();
  doConsoleTable();
  connectDB();
  kickOffPromptQuestionWhatToDo();
}

//INITIALIZATION ===========================================
// Function call to initialize app
init();
