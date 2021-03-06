# Unit 12 MySQL Homework: Employee Tracker

## Description

-This homework/app is a terminal interface, for now, that allows an employer to manage their employees list, including adding new employees, assigning their roles and departments and controlling if an employee has a manager. New roles and departments may also be added. Additionally, the interface provides a way to view all relevant information on the employee, such as what role and department they have as well as the total utilized budget for a department. Updates can also be made to employees, should they change a role or department or manager. Finally, the app also supports updating information as well as removing items such as an employee from the list.

## Technologies Used

-It has a fun introduction via the ASCIIART-Logo module where a splash screen (that is, a rectangular panel with the logo inside panel) is rendered on the terminal. It has a nice yellow border and the logo is in cyan. Both of which makes this fun introduction pop a little.

-It leverages Inquirer module for prompt questions input/choices.

-Behind the interface though is MYSQL module that is hooked into a local database. The local database was created using SCHEMA and SEED sql files, both of which are included in this repo (named: employee_trackerDB_Schema.sql & employee_trackerDB_Seed.sql, respectively). Data was pre-populated into this database.

-The database is named employee_trackerDB. It has 3 tables. 2 tables make use of FK/Foreign Keys. For better understanding of these 3 tables, please refer to the design mockup and details that are in the Instructions section below.

-Console.table module was used to help in and better display the data.

-JOIN queries were required to help in returning data properly.

-Async/await was used, reducing needing extra .then's.

-Finally, destructering was applied in making accessing variables a lot easier, more straightforward and less coding.

## Deployed App

[>>>>> You may click here for Emplooyee Tracker's video walk-thru <<<<<](https://drive.google.com/file/d/1n4RIGtObKeOJWIx7P6FCaGosDJn-qzhn/view)

## Table of Contents

- [Description](#description)
- [Technologies Used](#technologies-used)
- [Deployed App](#deployed-app)
- [Task](#task)
- [Instructions](#instructions)
- [Minimum Requirements](#minimum-requirements)
- [Bonus](#bonus)
- [Commit Early and Often](#commit-early-and-often)
- [Submission on BCS](#submission-on-bcs)

## Task

Developers are often tasked with creating interfaces that make it easy for non-developers to view and interact with information stored in databases. Often these interfaces are known as **C**ontent **M**anagement **S**ystems. In this homework assignment, your challenge is to architect and build a solution for managing a company's employees using node, inquirer, and MySQL.

## Instructions

Design the following database schema containing three tables:

![Database Schema](assets/schema.png)

- **department**:

  - **id** - INT PRIMARY KEY
  - **name** - VARCHAR(30) to hold department name

- **role**:

  - **id** - INT PRIMARY KEY
  - **title** - VARCHAR(30) to hold role title
  - **salary** - DECIMAL to hold role salary
  - **department_id** - INT to hold reference to department role belongs to

- **employee**:

  - **id** - INT PRIMARY KEY
  - **first_name** - VARCHAR(30) to hold employee first name
  - **last_name** - VARCHAR(30) to hold employee last name
  - **role_id** - INT to hold reference to role employee has
  - **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager

Build a command-line application that at a minimum allows the user to:

- Add departments, roles, employees

- View departments, roles, employees

- Update employee roles

Bonus points if you're able to:

- Update employee managers

- View employees by manager

- Delete departments, roles, and employees

- View the total utilized budget of a department -- ie the combined salaries of all employees in that department

We can frame this challenge as follows:

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

How do you deliver this? Here are some guidelines:

- Use the [MySQL](https://www.npmjs.com/package/mysql) NPM package to connect to your MySQL database and perform queries.

- Use [InquirerJs](https://www.npmjs.com/package/inquirer/v/0.2.3) NPM package to interact with the user via the command-line.

- Use [console.table](https://www.npmjs.com/package/console.table) to print MySQL rows to the console. There is a built-in version of `console.table`, but the NPM package formats the data a little better for our purposes.

- You may wish to have a separate file containing functions for performing specific SQL queries you'll need to use. Could a constructor function or a class be helpful for organizing these?

- You will need to perform a variety of SQL JOINS to complete this assignment, and it's recommended you review the week's activities if you need a refresher on this.

![Employee Tracker](assets/employee-tracker.gif)

### Hints

- You may wish to include a `seed.sql` file to pre-populate your database. This will make development of individual features much easier.

- Focus on getting the basic functionality completed before working on more advanced features.

- Review the week's activities for a refresher on MySQL.

- Check out [SQL Bolt](https://sqlbolt.com/) for some extra MySQL help.

## Minimum Requirements

- Functional application.

- GitHub repository with a unique name and a README describing the project.

- The command-line application should allow users to:

  - Add departments, roles, employees

  - View departments, roles, employees

  - Update employee roles

## Bonus

- The command-line application should allow users to:

  - Update employee managers

  - View employees by manager

  - Delete departments, roles, and employees

  - View the total utilized budget of a department -- ie the combined salaries of all employees in that department

## Commit Early and Often

One of the most important skills to master as a web developer is version control. Building the habit of committing via Git is important for two reasons:

- Your commit history is a signal to employers that you are actively working on projects and learning new skills.

- Your commit history allows you to revert your codebase in the event that you need to return to a previous state.

Follow these guidelines for committing:

- Make single-purpose commits for related changes to ensure a clean, manageable history. If you are fixing two issues, make two commits.

- Write descriptive, meaningful commit messages so that you and anyone else looking at your repository can easily understand its history.

- Don't commit half-done work, for the sake of your collaborators (and your future self!).

- Test your application before you commit to ensure functionality at every step in the development process.

We would like you to have well over 200 commits by graduation, so commit early and often!

**Important**: You will be committing a file that contains your database credentials. Make sure your MySQL password is not used for any other personal accounts, because it will be visible on GitHub. In upcoming lessons, you will learn how to better secure this password, or you can start researching npm packages now that could help you.

## Submission on BCS

You are required to submit the following:

- The URL of the GitHub repository

- A video demonstrating the entirety of the app's functionality

---

?? 2021 Trilogy Education Services, LLC, a 2U, Inc. brand. Confidential and Proprietary. All Rights Reserved.
