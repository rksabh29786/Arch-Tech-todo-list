document.addEventListener("DOMContentLoaded", () => {
   // =========================
    // Constants Decleration 
    // =========================
    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate");

    const taskPriority = document.getElementById("taskPriority");

    const searchInput = document.getElementById("searchInput");

    const addTaskBtn = document.getElementById("addTaskBtn");

    const taskList = document.getElementById("taskList");

    const totalTasks = document.getElementById("totalTasks");

    const completedTasks = document.getElementById("completedTasks");

    const progressFill = document.getElementById("progressFill");

    const progressPercentage = document.getElementById("progressPercentage");
    const progressText = document.getElementById("progressText"); 

    const filterButtons = document.querySelectorAll(".filter-btn");

    const emptyState = document.getElementById("emptyState");

    const toast = document.getElementById("toast");

    const themeToggle = document.getElementById("themeToggle");

    const sortTasks = document.getElementById("sortTasks");


    const deleteModal = document.getElementById("deleteModal");

const confirmDelete = document.getElementById("confirmDelete");

const cancelDelete = document.getElementById("cancelDelete");

const deleteCompletedBtn =
document.getElementById("deleteCompletedBtn");





    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let currentFilter = "all";

    let searchText = "";

   let currentSort = "newest";


   let deleteTaskId = null;

   let deleteMode = "";





    // =========================
    // Add Task Button
    // =========================

    addTaskBtn.addEventListener("click", addTask);

    searchInput.addEventListener("input",()=>{


    searchText = searchInput.value.toLowerCase();


    displayTasks();


});

// =========================
// Sort Tasks
// =========================

sortTasks.addEventListener("change", () => {

    currentSort = sortTasks.value;

    displayTasks();

});

    // Enter Key Support

    taskInput.addEventListener("keypress", (event)=>{

        if(event.key === "Enter"){

            addTask();

        }

    });






    // =========================
    // Add New Task
    // =========================


function addTask() {

    const taskText = taskInput.value.trim();

    // Step 8.5 - Replace alert with toast
    if (taskText === "") {
        showToast(
            "Please enter a task",
            "warning"
        );
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        date: taskDate.value,
        priority: taskPriority.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    displayTasks();

    // Step 8.6 - Show success message
    showToast(
        "Task added successfully"
    );

    // Clear input fields
    taskInput.value = "";
    taskDate.value = "";
    taskPriority.value = "Medium";

    taskInput.focus();
}




    // =========================
    // Display Tasks
    // =========================


    function displayTasks(){


        taskList.innerHTML="";



        let filteredTasks = tasks.filter(task=>{


    let matchesFilter = true;


    if(currentFilter==="completed"){


        matchesFilter = task.completed;


    }

    else if(currentFilter==="pending"){


        matchesFilter = !task.completed;


    }



    let matchesSearch = 
    task.text.toLowerCase()
    .includes(searchText);



    return matchesFilter && matchesSearch;


});



// =====================
// Sorting
// =====================

filteredTasks.sort((a, b) => {

    switch(currentSort){

        case "oldest":

            return a.id - b.id;

        case "priority":

            const priority = {

                High: 3,

                Medium: 2,

                Low: 1

            };

            return priority[b.priority] - priority[a.priority];

        case "date":

            if(!a.date) return 1;

            if(!b.date) return -1;

            return new Date(a.date) - new Date(b.date);

        case "az":

            return a.text.localeCompare(b.text);

        default:

            return b.id - a.id;

    }

});


        if(filteredTasks.length === 0){


            emptyState.style.display="block";


        }

        else{


            emptyState.style.display="none";


        }

        filteredTasks.forEach(task=>{


            const li = document.createElement("li");


            li.className="task-item";



            if(task.completed){

                li.classList.add("completed");

            }





            li.innerHTML = `


            <div class="task-content">


                <input 
                type="checkbox"
                ${task.completed ? "checked":""}
                onclick="toggleTask(${task.id})"
                >



                <div class="task-info">


                    <span>${task.text}</span>



                    ${
                        task.date
                        ?
                        `<small class="task-date">
                        📅 ${task.date}
                        </small>`
                        :
                        ""
                    }



                    <span class="priority priority-${task.priority.toLowerCase()}">

                        ${task.priority}

                    </span>



                </div>



            </div>




            <div class="task-actions">


                <button onclick="editTask(${task.id})">

                    Edit

                </button>



                <button onclick="deleteTask(${task.id})">

                    Delete

                </button>



            </div>


            `;



            taskList.appendChild(li);



        });



        updateCounters();


    }










    // =========================
    // Delete Task
    // =========================


    window.deleteTask = function(id){

    deleteMode = "single";

deleteTaskId = id;

deleteModal.classList.add("show");

}









    // =========================
    // Edit Task
    // =========================


    window.editTask = function(id){



        const task = tasks.find(task=>task.id===id);



        const updatedText = prompt(

            "Edit your task:",

            task.text

        );




        if(updatedText !== null && updatedText.trim() !== ""){


            task.text = updatedText.trim();



            saveTasks();



            displayTasks();


        }


    }



    // =========================
    // Complete Task
    // =========================


    window.toggleTask = function(id){


        const task = tasks.find(task=>task.id===id);



        if(task){


            task.completed = !task.completed;


            if(task.completed){

    showToast(
        "Task completed 🎉"
     );
}

            saveTasks();


            displayTasks();


        }


    }









    // =========================
    // Update Counters
    // =========================


    function updateCounters() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    totalTasks.innerText = total;

    completedTasks.innerText = completed;

    let percentage = 0;

    if (total > 0) {

        percentage = Math.round(
            (completed / total) * 100
        );

    }

    progressFill.style.width =
        percentage + "%";

    progressPercentage.innerText =
        percentage + "%";

    progressText.innerText =
        `${completed} of ${total} tasks completed`;

}








    // =========================
    // Save Tasks
    // =========================


    function saveTasks(){


        localStorage.setItem(

            "tasks",

            JSON.stringify(tasks)

        );


    }









    // =========================
    // Filters
    // =========================


    filterButtons.forEach(button=>{


        button.addEventListener("click",()=>{



            const activeButton = document.querySelector(".filter-btn.active");



            if(activeButton){

                activeButton.classList.remove("active");

            }



            button.classList.add("active");



            currentFilter = button.dataset.filter;



            displayTasks();



        });


    });


deleteCompletedBtn.addEventListener("click", () => {

    const completed = tasks.filter(task => task.completed);

    if(completed.length === 0){

        showToast(
            "No completed tasks found",
            "warning"
        );

        return;

    }

    deleteMode = "completed";

    deleteModal.classList.add("show");

});








    // =========================
    // Dark Mode
    // =========================


    const savedTheme = localStorage.getItem("theme");



    if(savedTheme === "dark"){


        document.body.classList.add("dark");


        themeToggle.innerHTML="☀️";


    }






    themeToggle.addEventListener("click",()=>{


        document.body.classList.toggle("dark");




        if(document.body.classList.contains("dark")){


            localStorage.setItem("theme","dark");


            themeToggle.innerHTML="☀️";


        }


        else{


            localStorage.setItem("theme","light");


            themeToggle.innerHTML="🌙";


        }



    });


// =========================
// Toast Notification
// =========================


function showToast(message,type="success"){


    toast.innerText = message;


    toast.className = "toast show";


    if(type==="error"){

        toast.classList.add("error");

    }


    else if(type==="warning"){

        toast.classList.add("warning");

    }




    setTimeout(()=>{


        toast.className="toast";


    },3000);



}

/// =========================
// Confirm Delete
// =========================

confirmDelete.addEventListener("click", () => {

    if(deleteMode === "single"){

        tasks = tasks.filter(task => task.id !== deleteTaskId);

        showToast(
            "Task deleted successfully",
            "error"
        );

    }

    else if(deleteMode === "completed"){

        tasks = tasks.filter(task => !task.completed);

        showToast(
            "Completed tasks deleted",
            "error"
        );

    }


    saveTasks();

    displayTasks();


    deleteModal.classList.remove("show");


    deleteTaskId = null;

    deleteMode = "";

});



// =========================
// Cancel Delete
// =========================

cancelDelete.addEventListener("click", () => {

    deleteModal.classList.remove("show");


    deleteTaskId = null;

    deleteMode = "";

});

    // =========================
    // Load Tasks
    // =========================


    displayTasks();



});

