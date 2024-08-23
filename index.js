const fs = require("fs");
const prompts = require("prompts");
const { size, filter, find, forEach } = require("lodash");
const path = require("path");

const fsAsync = fs.promises;

const filePath = path.join(__dirname, "tasks.json");

async function readTasks() {
  if (!fs.existsSync(filePath)) {
    await fsAsync.writeFile(filePath, JSON.stringify([]));
  }
  return JSON.parse(await fsAsync.readFile(filePath, { encoding: "utf-8" }));
}

async function writeTask(task) {
  await fsAsync.writeFile(filePath, JSON.stringify(task, null, 2));
}

async function addTask(description) {
  const tasks = await readTasks();
  const newTask = {
    id: size(tasks) ? tasks[size(tasks) - 1].id + 1 : 1,
    description,
    status: "todo",
  };

  tasks.push(newTask);
  writeTask(tasks);
  console.log(`Success add task with id: ${newTask.id}`);
}

async function deleteTask(id) {
  let tasks = await readTasks();
  tasks = filter(tasks, (item) => item.id !== parseInt(id));
  await writeTask(tasks);
  console.log(`Task has id:${id} is deleted successfully`);
}

async function updateTask(id, description) {
  const tasks = await readTasks();
  const task = find(tasks, (item) => item.id === parseInt(id));

  if (task) {
    task.description = description;
    await writeTask(tasks);
    console.log(`Task has id:${id} is changed description successfully`);
  } else {
    console.log("Task not found");
  }
}

async function markTask(id, status) {
  const tasks = await readTasks();
  const task = find(tasks, (item) => item.id === parseInt(id));

  if (task) {
    task.status = status;
    await writeTask(tasks);
    console.log(`Task has id:${id} is changed mark successfully`);
  } else {
    console.log("Task not found");
  }
}

async function listTasks(status) {
  const tasks = await readTasks();
  let filteredTasks = tasks;
  if (status) {
    filteredTasks = filter(tasks, (item) => item.status === status);
  }
  forEach(filteredTasks, (item) =>
    console.log(
      `ID: ${item.id}, Description: ${item.description}, Status: ${item.status}`
    )
  );
}

async function main() {
  const response = await prompts({
    type: "text",
    name: "command",
    message: "Enter command",
  });

  const [command, ...args] = response.command.split(" ");

  switch (command) {
    case "add":
      await addTask(args.join(" "));
      break;
    case "delete":
      if (args.length !== 1) {
        console.log("Usage: delete <id>");
        break;
      }
      await deleteTask(args[0]);
      break;
    case "update":
      if (args.length < 2) {
        console.log("Usage: update <id> <description>");
        break;
      }
      await updateTask(args[0], args.slice(1).join(" "));
      break;
    case "mark-in-progress":
      if (args.length !== 1) {
        console.log("Usage: mark-in-progreess <id>");
        break;
      }
      await markTask(args[0], "in-progreess");
      break;
    case "mark-done":
      if (args.length !== 1) {
        console.log("Usage: mark-done <id>");
        break;
      }
      await markTask(args[0], "done");
      break;

    case "list":
      // if (args.length  2) {
      //   console.log("Usage: list <status>");
      //   break;
      // }
      await listTasks(args[0]);
      break;
    case "exit":
      process.exit(1);
    default:
      console.log("Unknown command");
  }

  main();
}
