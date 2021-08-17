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

//Create an array of question for user input on View All Employees By Manager
//if no direct reports, answer: "The selected employee has no direct reports"
const questionEmployeesByManager = [
  {
    type: "input",
    name: "byManager",
    message: "Which employee do you want to see direct reports for?",
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
    choices: [
      "Sales Lead",
      "Salesperson",
      "Lead Engineer",
      "Software Engineer",
      "Account Manager",
      "Accountant",
      "Legal Team Lead",
    ],
  },
  {
    type: "list",
    name: "employeeManager",
    message: "Who is the employee's manager?",
    //None could be an option!
    choices: [
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kunal Singh",
      "Malia Brown",
      "Tom Allen",
      "Duane Reade",
    ],
  },
  //success, answer: Added employeeFirstName employeeLastName to the database
  //success, View All Employees shows newly added employee results
];

//Create an array of question for user input on Update Employee's Role
const questionUpdateEmployeeRole = [
  {
    type: "list",
    name: "employeeFirstNameUpdateRole",
    message: "Which employee's role do you want to update?",
    choices: [
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kunal Singh",
      "Malia Brown",
      "Tom Allen",
      "Duane Reade",
    ],
  },
  {
    type: "list",
    name: "employeeRoleUpdateRole",
    message: "Which role do you want to assign the selected employee?",
    choices: [
      "Sales Lead",
      "Salesperson",
      "Lead Engineer",
      "Software Engineer",
      "Account Manager",
      "Accountant",
      "Legal Team Lead",
    ],
  },
  //success, answer: Updated employee's role
  //success, View All Employees shows newly updated employee results
];

//Create an array of question for user input on Update Employee's Manager
const questionUpdateEmployeeManager = [
  {
    type: "list",
    name: "employeeNameUpdateManager",
    message: "Which employee's manager do you want to update?",
    choices: [
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kunal Singh",
      "Malia Brown",
      "Tom Allen",
      "Duane Reade",
    ],
  },
  {
    type: "list",
    name: "employeeUpdateManager",
    message: "Which manager do you want to assign the selected employee?",
    choices: [
      "Sales Lead",
      "Salesperson",
      "Lead Engineer",
      "Software Engineer",
      "Account Manager",
      "Accountant",
      "Legal Team Lead",
    ],
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

// TODO: Create a function to View All Employees
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

// TODO: Create a function to ...
const viewAllEmployeesByDept = async () => {
  const { byDepartment } = await inquirer.prompt(questionEmployeesByDepartment);
  console.log("byDepartment: " + byDepartment);
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON role.department_id = department.id WHERE department.name=" +
      "'" +
      byDepartment +
      "'",
    (err, res) => {
      if (err) throw err;
      doConsoleTable(res);
      kickOffPromptQuestionWhatToDo();
    }
  );
};

// TODO: Create a function to ...
function viewAllEmployeesByManager() {}

// TODO: Create a function to ...
function addEmployee() {}

// TODO: Create a function to ...
function removeEmployee() {}

// TODO: Create a function to ...
function updateEmployeeRole() {}

// TODO: Create a function to ...
function updateEmployeeManager() {}

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

// TODO: Create a function to kick off the prompt questions with What Woud You Like To Do?
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
// TODO: Create a function to initialize app, display ascii art & trigger all the question prompts
function init() {
  doAsciiArt();
  doConsoleTable();
  connectDB();
  kickOffPromptQuestionWhatToDo();
}

//INITIALIZATION ===========================================
// Function call to initialize app
init();
