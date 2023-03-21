//important variables
let fullDate = new Date(Date.now());
let pstDate = fullDate.toLocaleString("en-US", {
  timeZone: "America/Los_Angeles",
});
pstDate = new Date(pstDate);
let year = pstDate.getFullYear();
let month = pstDate.getMonth() + 1;
let day = pstDate.getDate();
let closestThreeDays = getClosestThreeDays();

//start
let tasks = [];

// check if tasks are stored in local storage
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

// render tasks on page load
renderTasks();

//function to reset all the variables
function resetVariables() {
  pstDate = fullDate.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
  pstDate = new Date(pstDate);
  year = pstDate.getFullYear();
  month = pstDate.getMonth() + 1;
  day = pstDate.getDate();
}

//function to get yesterday date
function dayMinusOne() {
  pstDate.setDate(new Date(Date.now()).getDate() - 1);
  year = pstDate.getFullYear();
  month = pstDate.getMonth() + 1;
  day = pstDate.getDate();
}

function getClosestThreeDays() {
  let today = year + "/" + month + "/" + day;
  if (day == 1) {
    dayMinusOne();
  } else {
    day -= 1;
  }
  let oneDayAgo = year + "/" + month + "/" + day;
  if (day == 1) {
    dayMinusOne();
  } else {
    day -= 1;
  }
  let twoDaysAgo = year + "/" + month + "/" + day;
  resetVariables();
  return [today, oneDayAgo, twoDaysAgo];
}

// event listener for add task form submit
document
  .querySelector("#add-task-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let taskInput = document.querySelector("#task-input");
    let colorInput = document.querySelector("#color-input");
	let color = colorInput.value;
    let task = taskInput.value.trim();
    if (task) {
      let newTask = {
        task: task,
        color: color,
        [closestThreeDays[0]]: false,
        [closestThreeDays[1]]: false,
        [closestThreeDays[2]]: false,
      };
      tasks.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    	renderTasks();
      taskInput.value = "";
      resetVariables();
    }
  });

// function to render tasks in the table
function renderTasks() {
  let tableBody = document.querySelector("#tasks-table tbody");
  tableBody.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    let row = tableBody.insertRow();
    let taskCell = row.insertCell();
    let doneCell = row.insertCell();
    let oneCell = row.insertCell();
    let twoCell = row.insertCell();
    let deleteCell = row.insertCell();
	taskCell.setAttribute("class", "taskNames");
    taskCell.innerHTML = tasks[i].task;
	taskCell.style.color = tasks[i].color;
    doneCell.innerHTML =
      "<input type='checkbox' class='task-done-today' data-index='" +
      i +
      "'" +
      (tasks[i][closestThreeDays[0]] ? " checked" : "") +
      ">";
    oneCell.innerHTML =
      "<input type='checkbox' class='task-done-1day' data-index='" +
      i +
      "'" +
      (tasks[i][closestThreeDays[1]] ? " checked" : "") +
      ">";
    twoCell.innerHTML =
      "<input type='checkbox' class='task-done-2day' data-index='" +
      i +
      "'" +
      (tasks[i][closestThreeDays[2]] ? " checked" : "") +
      ">";
    deleteCell.innerHTML =
      "<img src='./images/delete.png' alt='' class='delete-button' data-index='" + i + "'/>";
  }
}

// event listener for task done checkbox click - today
document.addEventListener("change", function (event) {
  if (event.target.matches(".task-done-today")) {
    let index = event.target.dataset.index;
    tasks[index][closestThreeDays[0]] = event.target.checked;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

// event listener for task done checkbox click - 1 day ago
document.addEventListener("change", function (event) {
  if (event.target.matches(".task-done-1day")) {
    let index = event.target.dataset.index;
    tasks[index][closestThreeDays[1]] = event.target.checked;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

// event listener for task done checkbox click - 2 day ago
document.addEventListener("change", function (event) {
  if (event.target.matches(".task-done-2day")) {
    let index = event.target.dataset.index;
    tasks[index][closestThreeDays[2]] = event.target.checked;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

// event listener for delete button click
document.addEventListener("click", function (event) {
  if (event.target.matches(".delete-button")) {
    let index = event.target.dataset.index;
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
});

// convert number into string for week days
function convertDay(num) {
  switch (num) {
    case 0:
    case 7:
      return "Sunday";
    case 1:
    case 8:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Invalid input";
  }
}

//get dates to customize the table header
let weekDay = pstDate.getDay();
if (weekDay <= 1) {
  weekDay += 7;
}
console.log(weekDay-1)
console.log(convertDay(weekDay-1))
console.log(convertDay(1))
document.getElementById("zeroDayAgo").innerHTML =
  convertDay(weekDay) + "</br>" + closestThreeDays[0].slice(5);
document.getElementById("oneDayAgo").innerHTML =
  convertDay(weekDay - 1) + "</br>" + closestThreeDays[1].slice(5);
document.getElementById("twoDayAgo").innerHTML =
  convertDay(weekDay - 2) + "</br>" + closestThreeDays[2].slice(5);

//code below are for changing dates and updating the form accordingly
// Load the existing data array from local storage, or create a new one if none exists
let dayData = JSON.parse(localStorage.getItem("dayData")) || [];
if (dayData != [] && day != dayData[0]) {
  console.log("dayData: " + dayData[0]);
  console.log("rightNow: " + day);
  newDay();
}

// Add today's data to the array
dayData[0] = day;

// Store the updated data array back in local storage
localStorage.setItem("dayData", JSON.stringify(dayData));

// if new day
function newDay() {
  closestThreeDays = getClosestThreeDays();
  // for every event
  for (let i = 0; i < tasks.length; ++i) {
    // for the tasks in every event
    for (let j = 0; j < Object.keys(tasks[i]).length; ++j) {
      tasks[i][closestThreeDays[1]] = tasks[i][closestThreeDays[0]];
    }
    tasks[i][closestThreeDays[0]] = false;
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}
