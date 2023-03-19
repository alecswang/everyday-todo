
        // document.getElementById("today").innerHTML = Date.getDay();
        // document.write("getDay() : " + dt.getDay() ); 

		let tasks = [];

		// check if tasks are stored in local storage
		if (localStorage.getItem("tasks")) {
			tasks = JSON.parse(localStorage.getItem("tasks"));
		}

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
				taskCell.innerHTML = tasks[i].task;
				doneCell.innerHTML = "<input type='checkbox' class='task-done-today' data-index='" + i + "'" + (tasks[i].done ? " checked" : "") + ">";
				oneCell.innerHTML = "<input type='checkbox' class='task-done-1day' data-index='" + i + "'" + (tasks[i].done1 ? " checked" : "") + ">";
				twoCell.innerHTML = "<input type='checkbox' class='task-done-2day' data-index='" + i + "'" + (tasks[i].done2 ? " checked" : "") + ">";
				deleteCell.innerHTML = "<button class='delete-button' data-index='" + i + "'>Delete</button>";
			}
		}

		// render tasks on page load
		renderTasks();

		// event listener for add task form submit
		document.querySelector("#add-task-form").addEventListener("submit", function(event) {
			event.preventDefault();
			let taskInput = document.querySelector("#task-input");
			let task = taskInput.value.trim();
			if (task) {
				let newTask = {
					task: task,
					done: false,
                    done1: false,
                    done2: false,
				};
				tasks.push(newTask);
				localStorage.setItem("tasks", JSON.stringify(tasks));
				renderTasks();
				taskInput.value = "";
			}
		});

		// event listener for task done checkbox click - today
		document.addEventListener("change", function(event) {
			if (event.target.matches(".task-done-today")) {
				let index = event.target.dataset.index;
				tasks[index].done = event.target.checked;
				localStorage.setItem("tasks", JSON.stringify(tasks));
			}
		});

		// event listener for task done checkbox click - 1 day ago
        document.addEventListener("change", function(event) {
			if (event.target.matches(".task-done-1day")) {
				let index = event.target.dataset.index;
				tasks[index].done1 = event.target.checked;
				localStorage.setItem("tasks", JSON.stringify(tasks));
			}
		});

        // event listener for task done checkbox click - 1 day ago
        document.addEventListener("change", function(event) {
			if (event.target.matches(".task-done-2day")) {
				let index = event.target.dataset.index;
				tasks[index].done2 = event.target.checked;
				localStorage.setItem("tasks", JSON.stringify(tasks));
			}
		});

		// event listener for delete button click
		document.addEventListener("click", function(event) {
			if (event.target.matches(".delete-button")) {
				let index = event.target.dataset.index;
				tasks.splice(index, 1);
				localStorage.setItem("tasks", JSON.stringify(tasks));
				renderTasks();
			}
		});

        function convertDay(num) {
            switch(num) {
                case 0:
                return "Sunday";
                case 1:
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
        // const today = new Date().toLocaleDateString();
        let fullDate = new Date(Date.now());
        var pstDate = fullDate.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        })
        pstDate = new Date(pstDate);
        let month = pstDate.getMonth() + 1; //months from 1-12
        let day = pstDate.getDate();
        let today = month + "/" + day;
        let oneDayAgo = month + "/" + (day-1);
        let twoDayAgo = month + "/" + (day-2);
        document.getElementById("today").innerHTML = convertDay(pstDate.getDay()) + "</br>" + today;
        document.getElementById("oneDayAgo").innerHTML = convertDay(pstDate.getDay() - 1) + "</br>" + oneDayAgo;
        document.getElementById("twoDayAgo").innerHTML = convertDay(pstDate.getDay() - 2) + "</br>" + twoDayAgo;

