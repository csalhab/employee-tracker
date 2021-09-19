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
      "View All Roles",
      "View All Departments",
      "Add Employee",
      "Add A Role",
      "Add A Department",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "Update Role Department",
      "View Department Total Utilized Budget",
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

//Create an array of questions for user input on New Manager for Employee
const questionNewManager = [
  {
    type: "list",
    name: "employeeChangeManager",
    message: "Which employee do you want to change their manager?",
    choices: employeesArray,
  },
  {
    type: "list",
    name: "managerName",
    message: "Who is the new manager?",
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
    message: "Which employee do you want to update their role?",
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
    choices: employeesArray,
  },
  {
    type: "list",
    name: "employeeUpdateManager",
    message: "Which manager do you want to assign the selected employee?",
    choices: employeesArray,
  },
  //success, answer: Updated employee's manager
  //success, View All Employees shows newly updated employee results
];

//Create an array of question for user input on Update Role Department
const questionUpdateRoleDept = [
  {
    type: "list",
    name: "updateRole",
    message: "Which role do you want to update its department?",
    choices: rolesArray,
  },
  {
    type: "list",
    name: "updateDept",
    message: "Which deparment do you want to assign the selected role?",
    choices: departmentsArray,
  },
];

//Create an array of question for user input on View Dept Budget
const questionViewDeptBudget = [
  {
    type: "list",
    name: "viewDeptBudget",
    message: "Which deparment do you want to see its total utilized budget?",
    choices: departmentsArray,
  },
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

function viewAllRoles() {
  connection.query(
    "SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON department.id = role.department_id;",
    (err, res) => {
      if (err) throw err;
      doConsoleTable(res);
      kickOffPromptQuestionWhatToDo();
    }
  );
}

function viewAllDepartments() {
  connection.query(
    "SELECT department.id, department.name FROM department;",
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
      if (res.length > 0) {
        console.table("res: " + res);
        doConsoleTable(res);
      } else {
        console.log(
          "\nThere are no employees in that department, that department doesn't exist.\n"
        );
      }
      kickOffPromptQuestionWhatToDo();
    }
  );
};

const viewAllEmployeesByManager = async () => {
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
        (err, res) => {
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

const addEmployee = async () => {
  console.log("inside addEmployee..");
  //this function builds employeesArray which questionEmployeeInfo employeeManager choices has as its value
  await getEmployees();
  //this function builds rolesArray which questionEmployeeInfo employeeRole choices has as it values
  await getRoles();
  //inquirer.prompt(questionEmployeeInfo).then(function (empInfo) {
  const { employeeFirstName, employeeLastName, employeeRole, employeeManager } =
    await inquirer.prompt(questionEmployeeInfo);
  const empRole = employeeRole.split(" ");
  let empManager;
  let shouldContinue = true;
  if (employeeFirstName === "" || employeeLastName === "") {
    shouldContinue = false;
  }
  if (!shouldContinue) {
    console.log(
      "In order to add a new employee, please provide first name and last name.\n"
    );
    kickOffPromptQuestionWhatToDo();
  } else {
    //if no manager, manager_id is null
    if (employeeManager === "None") {
      console.log("Employee has no Manager");
      connection.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
          VALUES ("${employeeFirstName}", "${employeeLastName}", ${
          empRole[0]
        }, ${null})`,
        (err, res) => {
          if (err) throw err;
          console.log(
            "\nAdded " +
              employeeFirstName +
              employeeLastName +
              " to the database\n"
          );
          kickOffPromptQuestionWhatToDo();
        }
      );
    } else {
      //has a manager, manager_id has an employee value
      empManager = employeeManager.split(" ");
      console.log("Employee Manager is: " + empManager[1]);
      connection.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
          VALUES ("${employeeFirstName}", "${employeeLastName}", ${empRole[0]}, ${empManager[0]})`,
        (err, res) => {
          if (err) throw err;
          console.log(
            "\nAdded " +
              employeeFirstName +
              employeeLastName +
              " to the database\n"
          );
          kickOffPromptQuestionWhatToDo();
        }
      );
    }
  }
};

const addDepartment = async () => {
  const { newDeptTitle } = await inquirer.prompt([
    {
      type: "input",
      name: "newDeptTitle",
      message: "What is the title of the department to be added?",
    },
  ]);
  await getDepartments();
  let tempDeptArray;
  let deptAlreadyExists = false;
  for (let i = 0; i < departmentsArray.length; i++) {
    tempDeptArray = departmentsArray[i].split(" ");
    if (newDeptTitle === tempDeptArray[1]) {
      deptAlreadyExists = true;
    }
  }
  if (newDeptTitle === "") {
    console.log(
      "No department added, requires a name value for department to be provided."
    );
  } else if (deptAlreadyExists) {
    console.log("Department already exists.", newDeptTitle);
  } else {
    connection.query(
      `INSERT INTO department (name)
      VALUES ("${newDeptTitle}")`,
      (err, res) => {
        if (err) throw err;
      }
    );
    console.log("\nAdded " + newDeptTitle + " to the database.\n");
  }
  kickOffPromptQuestionWhatToDo();
};

const addRole = async () => {
  //this retrieves all departments from the db
  await getDepartments();
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

const removeEmployee = async () => {
  //this function builds employeesArray which questionEmployeeInfo employeeManager choices has as its value
  await getEmployees();
  //console.log(employeesArray);
  const { employeeNameDelete } = await inquirer.prompt(questionDeleteEmployee);
  //console.log("employee name to be deleted:");
  //console.log(employeeNameDelete);
  let empName;
  if (employeeNameDelete !== "None") {
    empName = employeeNameDelete.split(" ");
    //console.log(empName[0]);
    //console.log(empName[1]);

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
        console.log(
          "\nDeleted " + employeeNameDelete + " from the database.\n"
        );
        kickOffPromptQuestionWhatToDo();
      }
    );
  } else {
    kickOffPromptQuestionWhatToDo();
  }
};

const updateEmployeeRole = async () => {
  //this function builds employeesArray which questionEmployeeInfo employeeManager choices has as its value
  await getEmployees();
  //this function builds rolesArray which questionEmployeeInfo employeeRole choices has as it values
  await getRoles();
  //console.log(rolesArray);
  const { employeeFirstNameUpdateRole, employeeRoleUpdateRole } =
    await inquirer.prompt(questionUpdateEmployeeRole);
  //console.log("employee name whose role is to be update:");
  //console.log(employeeFirstNameUpdateRole);
  //console.log("role employee is now updated to:");
  //console.log(employeeRoleUpdateRole);

  if (
    employeeFirstNameUpdateRole === "None" ||
    employeeRoleUpdateRole === "None"
  ) {
    kickOffPromptQuestionWhatToDo();
  } else {
    const empName = employeeFirstNameUpdateRole.split(" ");
    const empRole = employeeRoleUpdateRole.split(" ");
    //console.log(empName[0]);
    //console.log(empName[1]);
    //console.log(empRole[0]);
    //console.log(empRole[1]);
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
  }
};

const updateEmployeeManager = async () => {
  console.log("inside updateEmployeeManager!!!");
  //this function builds employeesArray
  await getEmployees();
  //console.log(employeesArray);
  //this function builds rolesArray
  await getRoles();
  //console.log(rolesArray);
  const { employeeChangeManager, managerName } = await inquirer.prompt(
    questionNewManager
  );
  //console.log("employee name whose manager is to be update:");
  //console.log(employeeChangeManager);
  //console.log("employee new manager is:");
  //console.log(managerName);

  if (employeeChangeManager === "None") {
    kickOffPromptQuestionWhatToDo();
  } else if (managerName === "None") {
    const empName = employeeChangeManager.split(" ");
    //let empManager = managerName.split(" ");
    //console.log(empManager[0]); //id
    //console.log(empManager[1]); //name
    //console.log(empName[0]); //id
    //console.log(empName[1]); //name
    connection.query(
      `UPDATE employee SET manager_id = ? WHERE id = ?`,
      [null, empName[0]],
      (err, res) => {
        if (err) throw err;
        console.log("\nUpdated " + empName + " with no manager now.\n");
        kickOffPromptQuestionWhatToDo();
      }
    );
  } else {
    const empName = employeeChangeManager.split(" ");
    const empManager = managerName.split(" ");
    /* 
      ? is a placeholder for values to be escaped & its value is an array
      single use is just value in the array
      multiple ?, array then holds in order the values 

    */
    connection.query(
      `UPDATE employee SET manager_id = ? WHERE id = ?`,
      [empManager[0], empName[0]],
      (err, res) => {
        if (err) throw err;
        console.log(
          "\nUpdated " +
            empName +
            " to have a new manager whose name is: " +
            empManager +
            " in the database.\n"
        );
        kickOffPromptQuestionWhatToDo();
      }
    );
  }
};

const updateRoleDept = async () => {
  console.log("inside updateRoleDept!!!");
  await getRoles();
  await getDepartments();

  const { updateRole, updateDept } = await inquirer.prompt(
    questionUpdateRoleDept
  );

  const roleToUpdate = updateRole.split(" ");
  const deptForRole = updateDept.split(" ");

  connection.query(
    `UPDATE role SET department_id = ? WHERE id = ?`,
    [deptForRole[0], roleToUpdate[0]],
    (err, res) => {
      if (err) throw err;
      console.log(
        "\nUpdated " +
          roleToUpdate +
          " to have be in this department: " +
          updateDept +
          " in the database.\n"
      );
      kickOffPromptQuestionWhatToDo();
    }
  );
};

function getRoles() {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM role;`, (err, res) => {
      if (err) throw err;
      res.forEach(({ id, title }) => {
        rolesArray.push(`${id} ${title}`);
      });
      resolve(rolesArray);
    });
  });
}

function getDepartments() {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM department;`, (err, res) => {
      if (err) throw err;
      res.forEach(({ id, name }) => {
        departmentsArray.push(`${id} ${name}`);
      });
      resolve(departmentsArray);
    });
  });
}

function getEmployees() {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM employee;`, (err, res) => {
      if (err) throw err;
      res.forEach(({ id, first_name, last_name }) => {
        employeesArray.push(`${id} ${first_name} ${last_name}`);
      });
      employeesArray.push("None");
      resolve(employeesArray);
      //console.log("getEmployees() results: ", employeesArray);
    });
  });
}

const viewDeptBudget = async () => {
  await getDepartments();

  const { viewDeptBudget } = await inquirer.prompt(questionViewDeptBudget);
  const dept = viewDeptBudget.split(" ");

  connection.query(
    `SELECT department_id, sum(salary) AS TotalDeptBudget FROM role WHERE department_id =?`,
    [dept[0]],
    (err, res) => {
      if (err) throw err;
      console.log(
        "Department " + dept[1] + " utilized budget total is: ",
        res[0].TotalDeptBudget
      );
    }
  );
  kickOffPromptQuestionWhatToDo();
};

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
    case "View All Roles":
      return viewAllRoles();
    case "View All Departments":
      return viewAllDepartments();
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
    case "Update Role Department":
      updateRoleDept();
      return;
    case "View Department Total Utilized Budget":
      viewDeptBudget();
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
