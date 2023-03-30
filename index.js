// Import the functions needed from firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

// Web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGI0WLp5aa01QQrzNaFllcwQxGdxz5Kng",
  authDomain: "dailyhabittracker-75423.firebaseapp.com",
  projectId: "dailyhabittracker-75423",
  storageBucket: "dailyhabittracker-75423.appspot.com",
  messagingSenderId: "376126065544",
  appId: "1:376126065544:web:e69812eb1783f6b085083d",
  measurementId: "G-6WWJ81LKK8",
  databaseURL: "https://dailyhabittracker-75423-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let uID = null;
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("log in");
    console.log(user.uid);
    uID = user.uid;
    hi();
  } else {
    console.log("no user");
  }
});

// event listener for add task form submit
document
  .querySelector("#sign-out-button")
  .addEventListener("click", function (event) {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("signed out");
      })
      .catch((error) => {
        // An error happened.
      });
  });

//writeData
// writeUserData(0, "Lanan", []);
// function writeUserData(userId, name, tasks) {
// set(ref(database, 'tasks/'), {
//   username: name,
//   userTasks : tasks
// });
// }

// hi();
function hi() {
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
  let closestThreeDaysNoSlices = getClosestThreeDaysNoSlices();
  //tasks dataBase
  let tasks = [];

  // check if tasks are stored in local storage
  // if (localStorage.getItem("tasks")) {
  //   tasks = JSON.parse(localStorage.getItem("tasks"));
  // }
  // check if tasks are stored in firebase
  const currentTasks = ref(database, [uID] + "/tasks");
  if (currentTasks) {
    onValue(currentTasks, (snapshot) => {
      tasks = snapshot.val();
      console.log(tasks);
      //whyyyyy?
      renderTasks();
    });
  }
  // render tasks on page load

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

  function getClosestThreeDaysNoSlices() {
    let today = "" + year + month + day;
    if (day == 1) {
      dayMinusOne();
    } else {
      day -= 1;
    }
    let oneDayAgo = "" + year + month + day;
    if (day == 1) {
      dayMinusOne();
    } else {
      day -= 1;
    }
    let twoDaysAgo = "" + year + month + day;
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
          color: color.slice(1),
          [closestThreeDaysNoSlices[0]]: false,
          [closestThreeDaysNoSlices[1]]: false,
          [closestThreeDaysNoSlices[2]]: false,
        };
        // tasks.push(newTask);
        //write into firebase
        // set(ref(database, "tasks/" + [task]), {
        //   color: color.slice(1),
        //   [closestThreeDaysNoSlices[0]]: false,
        //   [closestThreeDaysNoSlices[1]]: false,
        //   [closestThreeDaysNoSlices[2]]: false,
        // });
        //update firebase
        const updates = {};
        updates[[uID] + "/tasks/" + task] = newTask;
        // updates["tasks/" + task] = color.slice(1);
        // updates["tasks/" + task[closestThreeDaysNoSlices[0]]] = false;
        // updates["tasks/" + task[closestThreeDaysNoSlices[1]]] = false;
        // updates["tasks/" + task[closestThreeDaysNoSlices[2]]] = false;
        update(ref(database), updates);
        //local Storage
        // localStorage.setItem("tasks", JSON.stringify(tasks));
        //fine
        renderTasks();
        taskInput.value = "";
        resetVariables();
      }
    });

  // function to render tasks in the table
  function renderTasks() {
    if (tasks != null) {
      let tableBody = document.querySelector("#tasks-table tbody");
      tableBody.innerHTML = "";
      console.log("renderTasks:" + tasks);
      console.log(Object.keys(tasks).length);
      // Object.keys(tasks).forEach((key, index) => {
      //   console.log(`${key}: ${tasks[key]}`);
      // });
      for (let i = 0; i < Object.keys(tasks).length; i++) {
        console.log("building");
        let row = tableBody.insertRow();
        row.setAttribute("draggable", true);
        // row.setAttribute("ondragstart", dragstart());
        // row.setAttribute("ondragover", dragover());
        row.addEventListener('dragstart', (ev) => dragstart(ev));
        row.addEventListener('dragover', (ev) => dragover(ev));
        let taskCell = row.insertCell();
        let doneCell = row.insertCell();
        let oneCell = row.insertCell();
        let twoCell = row.insertCell();
        let deleteCell = row.insertCell();
        taskCell.setAttribute("class", "taskNames");
        taskCell.innerHTML = Object.keys(tasks)[i];
        taskCell.style.color = "#" + tasks[Object.keys(tasks)[i]].color;
        doneCell.innerHTML =
          "<input type='checkbox' class='task-done-today' data-index='" +
          i +
          "'" +
          (tasks[Object.keys(tasks)[i]][closestThreeDaysNoSlices[0]]
            ? " checked"
            : "") +
          ">";
        oneCell.innerHTML =
          "<input type='checkbox' class='task-done-1day' data-index='" +
          i +
          "'" +
          (tasks[Object.keys(tasks)[i]][closestThreeDaysNoSlices[1]]
            ? " checked"
            : "") +
          ">";
        twoCell.innerHTML =
          "<input type='checkbox' class='task-done-2day' data-index='" +
          i +
          "'" +
          (tasks[Object.keys(tasks)[i]][closestThreeDaysNoSlices[2]]
            ? " checked"
            : "") +
          ">";
        deleteCell.innerHTML =
          "<img src='./images/delete.png' alt='' class='delete-button' data-index='" +
          i +
          "'/>";
      }
    }
  }

  // event listener for task done checkbox click - today
  document.addEventListener("change", function (event) {
    if (event.target.matches(".task-done-today")) {
      let index = event.target.dataset.index;
      //local Storage
      // tasks[index][closestThreeDays[0]] = event.target.checked;
      // localStorage.setItem("tasks", JSON.stringify(tasks));
      //update firebase
      const updates = {};
      updates[
        [uID] +
          "/tasks/" +
          Object.keys(tasks)[index] +
          "/" +
          [closestThreeDaysNoSlices[0]]
      ] = !tasks[Object.keys(tasks)[index]][closestThreeDaysNoSlices[0]];
      return update(ref(database), updates);
    }
  });

  // event listener for task done checkbox click - 1 day ago
  document.addEventListener("change", function (event) {
    if (event.target.matches(".task-done-1day")) {
      let index = event.target.dataset.index;
      //local Storage
      // tasks[index][closestThreeDays[1]] = event.target.checked;
      // localStorage.setItem("tasks", JSON.stringify(tasks));
      //update firebase
      const updates = {};
      updates[
        [uID] +
          "/tasks/" +
          Object.keys(tasks)[index] +
          "/" +
          [closestThreeDaysNoSlices[1]]
      ] = !tasks[Object.keys(tasks)[index]][closestThreeDaysNoSlices[1]];
      return update(ref(database), updates);
    }
  });

  // event listener for task done checkbox click - 2 day ago
  document.addEventListener("change", function (event) {
    if (event.target.matches(".task-done-2day")) {
      let index = event.target.dataset.index;
      //local Storage
      // tasks[index][closestThreeDays[2]] = event.target.checked;
      // localStorage.setItem("tasks", JSON.stringify(tasks));
      //update firebase
      const updates = {};
      updates[
        [uID] +
          "/tasks/" +
          Object.keys(tasks)[index] +
          "/" +
          [closestThreeDaysNoSlices[2]]
      ] = !tasks[Object.keys(tasks)[index]][closestThreeDaysNoSlices[2]];
      return update(ref(database), updates);
    }
  });

  // event listener for delete button click
  document.addEventListener("click", function (event) {
    if (event.target.matches(".delete-button")) {
      let index = event.target.dataset.index;
      //local Storage
      // tasks.splice(index, 1);
      // localStorage.setItem("tasks", JSON.stringify(tasks));
      //update firebase
      const updates = {};
      updates["tasks/" + Object.keys(tasks)[index]] = null;
      return update(ref(database), updates);
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
  document.getElementById("zeroDayAgo").innerHTML =
    convertDay(weekDay) + "</br>" + closestThreeDays[0].slice(5);
  document.getElementById("oneDayAgo").innerHTML =
    convertDay(weekDay - 1) + "</br>" + closestThreeDays[1].slice(5);
  document.getElementById("twoDayAgo").innerHTML =
    convertDay(weekDay - 2) + "</br>" + closestThreeDays[2].slice(5);

  //code below are for changing dates and updating the form accordingly
  let databaseDay = ref(database, [uID] + "/dayData");
  onValue(databaseDay, (snapshot) => {
    databaseDay = snapshot.val();
  });
  if (databaseDay != null && day != databaseDay) {
    console.log("firebaseDayChange");
    newDay();
  }

  // Load the existing data array from local storage, or create a new one if none exists
  // let dayData = JSON.parse(localStorage.getItem("dayData")) || [];
  // if (dayData != [] && day != dayData[0]) {
  //   console.log("dayData: " + dayData[0]);
  //   console.log("rightNow: " + day);
  //   newDay();
  // }

  // Add today's data to the array
  // dayData[0] = day;

  // Store the updated data array back in local storage
  // localStorage.setItem("dayData", JSON.stringify(dayData));
  //firebase set dayData
  const updates = {};
  updates[[uID] + "/dayData"] = day;
  update(ref(database), updates);

  // if new day
  function newDay() {
    // closestThreeDays = getClosestThreeDays();
    // // for every event
    // for (let i = 0; i < tasks.length; ++i) {
    //   // for the tasks in every event
    //   for (let j = 0; j < Object.keys(tasks[i]).length; ++j) {
    //     tasks[i][closestThreeDays[1]] = tasks[i][closestThreeDays[0]];
    //     console.log(tasks[i][closestThreeDays[1]]);
    //   }
    //   tasks[i][closestThreeDays[0]] = false;
    // }

    // localStorage.setItem("tasks", JSON.stringify(tasks));

    //firebase
    closestThreeDaysNoSlices = getClosestThreeDaysNoSlices();
    const updates = {};
    // for every event
    for (let i = 0; i < tasks.length; ++i) {
      // for the tasks in every event
      // for (let j = 0; j < Object.keys(tasks[i]).length; ++j) {
      //   tasks[i][closestThreeDays[1]] = tasks[i][closestThreeDays[0]];
      //   // console.log(tasks[i].task[closestThreeDaysNoSlices[1]]);
      //   console.log([closestThreeDaysNoSlices[0]]);
      //   updates[
      //     "tasks/" + [tasks[i].task] + "/" + [closestThreeDaysNoSlices[1]]
      //   ] = [tasks[i].task][closestThreeDaysNoSlices[0]];
      // }
      // tasks[i][closestThreeDays[0]] = false;
      updates[
        [uID] +
          "tasks/" +
          Object.keys(tasks)[index] +
          "/" +
          [closestThreeDaysNoSlices[0]]
      ] = false;
    }
    update(ref(database), updates);
    renderTasks();
  }
}

var row;

function dragstart(event){  
  row = event.target; 
}
function dragover(event){
  var e = event;
  e.preventDefault(); 
  
  let children= Array.from(e.target.parentNode.parentNode.children);
  
  if(children.indexOf(e.target.parentNode)>children.indexOf(row))
    e.target.parentNode.after(row);
  else
    e.target.parentNode.before(row);
}