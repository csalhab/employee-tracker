//DEPENDENCIES ========================================
//Include packages needed for this application
const logo = require("asciiart-logo");
const inquirer = require("inquirer");
const mysql = require("mysql");

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

// TODO: Create a function to ...
function viewAllEmployees() {
  connectDB();
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
}

// TODO: Create a function to ...
function viewAllEmployeesByDept() {
  connectDB();
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
}

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
function kickOffPromptQuestionWhatToDo() {
  inquirer
    .prompt(questionSelectWhatToDo)
    .then(function (whatToDoAnswer) {
      const whatToDoAnsw = whatToDoAnswer.whatToDo;
      switch (whatToDoAnsw) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View All Employees By Department":
          viewAllEmployeesByDept();
          break;
        case "View All Employees By Manager":
          viewAllEmployeesByManager();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Manager":
          updateEmployeeManager();
          break;
        default:
          console.log("You must select an option, else ctl-c to quit app");
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.log("error if: " + error.isTtyError);
      } else {
        // Something else went wrong
        console.log("error else: " + error);
      }
    });
}

//USER INTERACTIONS ========================================
// TODO: Create a function to initialize app, display ascii art & trigger all the question prompts
function init() {
  doAsciiArt();
  kickOffPromptQuestionWhatToDo();
}

//INITIALIZATION ===========================================
// Function call to initialize app
init();
