const appTitle = document.getElementById("app-name");
const projectSection = document.getElementById("project-section");
const projectsContainer = document.querySelector("[data-projects]");
const myProjectsGrid = document.getElementById("myprojects");
const projectForm = document.querySelector("[data-new-project-form]");
const projectName = document.querySelector("[data-new-project-name]");
const projectColor = document.getElementById("color-selector");
const taskName = document.querySelector("[data-new-task-name]");
const addTaskForm = document.querySelector("[data-new-task]");
const addTask = document.getElementById("add-Task");
const displayProject = document.getElementById("project-details");
const displayHeading = document.getElementById("display-heading");
const taskList = document.querySelectorAll(".task-list");
const toDo = document.getElementById("todo-list");
const doing = document.getElementById("doing-list");
const done = document.getElementById("done-list");
const onHold = document.getElementById("onhold-list");
const statusColumn = document.querySelectorAll(".status-columns");
const closeDisplay = document.getElementById("close-project");
const newProjectFormSection = document.getElementById("newProjectForm");
const projectFormSubmit = document.getElementById("projectformsubmit");
const formClose = document.getElementById("form-close");
const darkModeBtn = document.getElementById("dark-mode");
const body = document.querySelector("body");
const filterForm = document.getElementById('filter-form')
const sortOptions = document.getElementById('sort-options')
const filterOptions = document.getElementById('filter-options')


const LOCAL_STORAGE_PROJECT_LIST = "projects.list";

let projects =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_LIST)) || [];
console.log(projects);

let darkMode = localStorage.getItem("dark-mode");

function isdarkMode() {
  if (darkMode === "activated") {
    activateDarkMode();
  }
  if (darkMode === "activated") {
    darkModeBtn.innerHTML = '  <i  class="far fa-lightbulb"></i>';
  } else {
    darkModeBtn.innerHTML = ' <i class="fa-solid fa-lightbulb"></i>';
  }
}

// Creating the Element that displays the project form when clicked

function createAddProject() {
  const projectElement = document.createElement("div");
  const projectHeading = document.createElement("h2");
  const projectP = document.createElement("p");

  if (projects.length === 0) {
    projectHeading.innerText = `Create your first project`;
  } else {
    projectHeading.innerText = `Add a new project`;
  }
  projectP.innerHTML = `<i class="fa-solid fa-folder-plus"></i> `;
  projectElement.appendChild(projectHeading);
  projectHeading.appendChild(projectP);
  projectsContainer.appendChild(projectElement);
  projectHeading.addEventListener("click", displayCreateProject);
  projectElement.setAttribute("id", "noprojectdisplay");

  return projectElement;
}
// function to display all the projects

function projectDisplay(projects) {

  if(projects.length === 0 ){
    filterForm.style.display ='none'
  }
  clearProject(projectsContainer);
  newProjectFormSection.style.display = "none";
  myProjectsGrid.classList.remove("blurgrid");

  const addProjectContainer = createAddProject();
  projectsContainer.appendChild(addProjectContainer);
 
  if(filterOptions.value !== 'isCompletedTrue'){
    addProjectContainer.style.display = 'block'

  } else {
    addProjectContainer.style.display = 'none'
  }


  

  

  projects.forEach((project) => {
    const projectElement = createProjectDisplay(project);
    const projectDelete = createDeleteButton(project);
    if(project.isComplete){
      const reOpenBtn = createReOpenButton(project)
      projectElement.appendChild(reOpenBtn)
      reOpenBtn.addEventListener("click", activateOpenButton);
    }
    projectElement.appendChild(projectDelete);
    addProjectEventListeners(projectElement);
    projectDelete.addEventListener("click", deleteProject);
    projectsContainer.appendChild(projectElement);
    addProjectContainer.after(projectElement);

  });

}

//   funtion built to create the project section
function createProjectDisplay(project) {
  const projectElement = document.createElement("div");
  const taskSummary = document.createElement('div')
  const projectHeading = document.createElement("h2");
  const projectCreated = document.createElement("p");

  [projectElement, projectHeading, projectCreated].forEach((el) => {
    el.setAttribute("data-project-identifier", project.id);
  });

  projectCreated.setAttribute("id", "project-created");
  taskSummary.classList.add("task-summary")

  projectHeading.innerText = project.name;
  projectCreated.innerText = ` Created: ${project.createdDate}`;

  projectElement.appendChild(projectHeading);
  projectElement.appendChild(projectCreated);
  projectElement.appendChild(taskSummary)
  projectElement.classList.add("project-element");
  if (project.isComplete) {
    projectElement.classList.add("completed");
    projectElement.style.backgroundColor = project.backgroundColor;
    projectElement.style.opacity = "0.6";
  } else {
    projectElement.style.backgroundColor = project.backgroundColor;
  }

  taskSummaryDisplay(project, taskSummary);
  displayStatus(project, projectElement);

  return projectElement;
}

// function to create the delete button
function createDeleteButton(project) {
  const projectDelete = document.createElement("button");
  projectDelete.setAttribute("id", project.id);
  projectDelete.classList.add("delete-button");
  projectDelete.innerText = "X";

  return projectDelete;
}

//   add event listeners to the project
function addProjectEventListeners(projectElement) {
  projectElement.addEventListener("click", displayDetails);
  projectElement.querySelector("h2").addEventListener("click", displayDetails);
  projectElement.querySelector("p").addEventListener("click", displayDetails);
  projectElement.addEventListener("click", dragAndDropTask);
}

// remove event listeners from each project when element click 
function removeProjectEventListeners(projectElement) {
  projectElement.removeEventListener("click", displayDetails);
  projectElement.querySelector("h2").removeEventListener("click", displayDetails);
  projectElement.querySelector("p").removeEventListener("click", displayDetails);
  projectElement.removeEventListener("click", dragAndDropTask);
}

//   function to delete the project

function deleteProject(event) {
  event.stopPropagation();
  const id = projects.findIndex((project) => project.id === event.target.id);
  console.log(id);
  projects.splice(id, 1);
  localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects));
  console.log(projects);
  projectDisplay(projects);
}

function closeProject() {
location.reload()
}

// changing the display when project form showing

function displayCreateProject() {
  const projectElements = document.querySelectorAll(".project-element");
  projectElements.forEach((projectElement) => {
    removeProjectEventListeners(projectElement);
  });

  newProjectFormSection.style.display = "block";
  myProjectsGrid.classList.add("blurgrid");
}

// obtaining details from new project form 

function addProject(event) {
  event.preventDefault();
  event.stopPropagation();
  const newProjectName = projectName.value;
  const newProjectColor = projectColor.value;

  // console.log(newProject)
  if (!newProjectName) return;
  const projectList = createProject(newProjectName, newProjectColor);
  projectName.value = null;
  projectColor.value = "#CC5500";
  projects.push(projectList);
  localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects));
  handleOptionsChange()
}

// taking the details and creating project object

function createProject(name, color) {
  const date = new Date();
  const options = {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  };
  const formatDate = date.toLocaleString("en-UK", options).replace(",", "/");
  return {
    id: Date.now().toString(),
    name: name,
    createdDate: formatDate,
    tasks: [],
    backgroundColor: color,
    projectStatus: "",
    completeDate: "",
    isComplete: false,
  };
}


// creating display for reOpen button 
function createReOpenButton (project){
  const reOpen = document.createElement("button");
  reOpen.setAttribute("id", project.id);
 reOpen.classList.add("reopen-button");
  reOpen.innerText = "Re-Activate Project";

  return reOpen;

}

// activating the clicked project 

function activateOpenButton(e){
  e.stopPropagation();
 const currentProjectId =  e.target.getAttribute("id")
 console.log(currentProjectId)
 const currentProject = projects.find(
  (project) => project.id === currentProjectId
);
 if(!currentProject) return
  currentProject.isComplete = false
  currentProject.projectStatus = ""
  localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects));
 handleOptionsChange()

}

// saving new task submitted 
function submitTask(event) {
  event.preventDefault();
  event.stopPropagation();
  const currentProjectId = displayProject.getAttribute(
    "data-project-identifier"
  );
  const currentProject = projects.findIndex(
    (project) => project.id === currentProjectId
  );

  console.log(currentProject);
  const newTaskName = taskName.value;
  if (!newTaskName) return;
  if (
    projects[currentProject].tasks.some(
      (task) => task.name.toLowerCase() === newTaskName.toLowerCase()
    )
  )
    return;
  const newTask = {
    name: newTaskName,
    id: Date.now().toString(),
    status: "todo",
  };
  projects[currentProject].tasks.push(newTask);
  taskName.value = null;

  localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects));
  console.log(projects[currentProject].tasks);

  displayDetails({ currentTarget: { getAttribute: () => currentProjectId } });
}

// creating task delete button for each task 
function createTaskDeleteButton(task) {
  const taskDelete = document.createElement("button");

  taskDelete.setAttribute("id", task.id);
  taskDelete.classList.add("taskdelete-button");
  taskDelete.innerText = "X";

  return taskDelete;
}

// removing the task from the projects.tasks array 

function projectTaskDelete(e) {
  const currentTaskElement = e.target.closest(".task");
  const taskId = e.target.getAttribute("id");
  const currentProjectId = displayProject.getAttribute(
    "data-project-identifier"
  );
  console.log(currentProjectId);
  console.log(taskId);
  const currentProject = projects.find(
    (project) => project.id === currentProjectId
  );
  console.log(currentProject);
  const taskIndex = currentProject.tasks.findIndex(
    (task) => task.id === taskId
  );
  currentProject.tasks.splice(taskIndex, 1);
  console.log("task has been deleted ");
  localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects));
  currentTaskElement.remove();
  console.log(currentProject.tasks);
}


// displaying the task counts for each project
function taskSummaryDisplay(project, taskSummary) {
  const counts = taskCounts(project);
  const taskTotal = document.createElement("p");
  const toDo = document.createElement("p");
  const doing = document.createElement("p");
  const done = document.createElement("p");
  const onHold = document.createElement("p");

  toDo.classList.add("task-summary");
  doing.classList.add("task-summary");
  done.classList.add("task-summary");
  onHold.classList.add("task-summary");

  taskTotal.setAttribute("id", "task-total");

  taskSummary.insertBefore(taskTotal, taskSummary.children[0]);
  taskSummary.insertBefore(toDo, taskSummary.children[1]);
  taskSummary.insertBefore(doing, taskSummary.children[2]);
  taskSummary.insertBefore(done, taskSummary.children[3]);
  taskSummary.insertBefore(onHold, taskSummary.children[4]);

  taskTotal.innerText = ` Total Tasks: ${counts.totalTask}`;
  toDo.innerText = `To-do : ${counts.toDoTask}`;
  doing.innerText = `In Progress: ${counts.doingTask}`;
  done.innerText = ` Complete: ${counts.doneTask}`;
  onHold.innerText = `On-Hold ${counts.onHoldTask}`;
}

// obtaining the task counts for each project 

function taskCounts(project) {
  const projectTask = project.tasks;
  let totalTask = 0;
  let toDoTask = 0;
  let doingTask = 0;
  let doneTask = 0;
  let onHoldTask = 0;

  for (let i = 0; i < projectTask.length; i++) {
    totalTask++;
    if (projectTask[i].status === "todo") {
      toDoTask++;
    } else if (projectTask[i].status === "doing") {
      doingTask++;
    } else if (projectTask[i].status === "done") {
      doneTask++;
    } else if (projectTask[i].status === "onhold") {
      onHoldTask++;
    } else {
    }
  }

  return { totalTask, toDoTask, doingTask, doneTask, onHoldTask };
}

// updating the status of each project based on taskCounts

function projectStatus(project) {
  const counts = taskCounts(project);
  const completeCount = counts.doneTask + counts.onHoldTask;
  if (
    counts.doingTask > 0 ||
    (counts.doneTask > 0 &&
      counts.doneTask < counts.totalTask &&
      counts.onHoldTask === 0)
  ) {
    project.projectStatus = "In-Progress";
    project.isComplete = false;
    // console.log(project.projectStatus)
  } else if (counts.doneTask === counts.totalTask && counts.totalTask > 0) {
    if(!project.isComplete){
      let confirmCompletion = confirm(
        "All tasks logged are marked as complete would you like to finalize this project?"
      );
      if(confirmCompletion){
        project.projectStatus = "Complete";
        project.isComplete = true;
        const date = new Date();
        const options = {
          timeZone: "UTC",
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        };
        const formatDate = date.toLocaleString("en-UK", options).replace(",", "/");
        project.completeDate = formatDate;
      }
    }

    // console.log(project.projectStatus)
  } else if (counts.totalTask > 0 && counts.onHoldTask === counts.totalTask) {
    project.projectStatus = "On-Hold";
    project.isComplete = false;
  } else if (completeCount === counts.totalTask && counts.totalTask > 0) {
    if (!project.isComplete) {
      let confirmCompletion = confirm(
        "Would you like to complete this project with Task on hold?"
      );
      if (confirmCompletion) {
        project.projectStatus = "Complete";
        project.isComplete = true;
        const date = new Date();
        const options = {
          timeZone: "UTC",
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        };
        const formatDate = date
          .toLocaleString("en-UK", options)
          .replace(",", "/");
        project.completeDate = formatDate;
        console.log(project.projectStatus);
      }
    }
  } else if (counts.totalTask === counts.toDoTask) {
    project.projectStatus = " ";
  } else {
  }
  localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects));
  console.log(projects);
}

// showing the status in the project element 

function displayStatus(project, projectElement) {
  const projectStatus = document.createElement("p");
  projectElement.insertBefore(projectStatus, projectElement.children[2]);

  if (project.isComplete) {
    projectStatus.innerText = `Completed: ${project.completeDate}`;
  } else {
    projectStatus.innerText = `${project.projectStatus}`;
  }
}

function clearProject(element) {
  while (element.firstChild) element.removeChild(element.firstChild);
}

// displaying the list of task for each project 

function displayDetails(event) {
  projectSection.style.display = "none";
  displayProject.style.display = "block";
  const projectId = event.currentTarget.getAttribute("data-project-identifier");
  const project = projects.find((project) => project.id === projectId);
  console.log(project.name);
  displayHeading.innerText = project.name;
  displayProject.setAttribute("data-project-identifier", project.id);

  if (project.isComplete) {
    addTaskForm.style.display = "none";
  }

  clearProject(toDo);
  clearProject(doing);
  clearProject(done);
  clearProject(onHold);

  project.tasks.forEach((task) => {
    const allTaskDisplay = document.createElement("p");
    const taskDelete = createTaskDeleteButton(task);
    if (!project.isComplete) {
      allTaskDisplay.classList.add("task");
      allTaskDisplay.setAttribute("data-task-id", task.id);
      allTaskDisplay.setAttribute("draggable", true);
      allTaskDisplay.innerText = task.name;
      allTaskDisplay.appendChild(taskDelete);
    } else {
      allTaskDisplay.classList.add("task");
      allTaskDisplay.setAttribute("data-task-id", task.id);
      allTaskDisplay.innerText = task.name;
    }

    if (task.status === "todo") {
      toDo.appendChild(allTaskDisplay);
    } else if (task.status === "doing") {
      doing.appendChild(allTaskDisplay);
    } else if (task.status === "done") {
      done.appendChild(allTaskDisplay);
    } else if (task.status === "onhold") {
      onHold.appendChild(allTaskDisplay);
    } else {
    }

    allTaskDisplay.addEventListener("dragstart", (e) => {
      e.target.classList.add("dragging");
    });

    allTaskDisplay.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");
    });

    taskDelete.addEventListener("click", projectTaskDelete);
    taskDelete.setAttribute("data-task-identifier", task.id);
  });

}

// drag and dropping tasks between columns

function dragAndDropTask(event) {
  const currentProjectId = event.currentTarget.getAttribute(
    "data-project-identifier"
  );
  const project = projects.find((project) => project.id === currentProjectId);
  statusColumn.forEach((column) => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    column.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const draggedItem = document.querySelector(".dragging");
      console.log(draggedItem);
      if (draggedItem) {
        const taskId = draggedItem.getAttribute("data-task-id");
        console.log(taskId);

        const status = column.getAttribute("id").split("-")[0];
        const currentTask = project.tasks.findIndex(
          (task) => task.id === taskId
        );
        project.tasks[currentTask].status = status;
        const displayProjectId = displayProject.getAttribute(
          "data-project-identifier"
        );
        console.log(currentProjectId);
        console.log(displayProjectId);
        if (currentProjectId === displayProjectId) {
          projectStatus(project);
          displayDetails({
            currentTarget: { getAttribute: () => currentProjectId },
          });
          localStorage.setItem(
            LOCAL_STORAGE_PROJECT_LIST,
            JSON.stringify(projects)
          );
          console.log(project.isComplete);
          console.log(project.tasks);
        }
      }
    });
  });
}

// dark mode

function activateDarkMode() {
  body.classList.add("dark-theme");
  newProjectFormSection.classList.add("dark-theme");
  projectsContainer.classList.add("dark-theme");
  darkModeBtn.classList.add("dark-theme");
  localStorage.setItem("dark-mode", "activated");
  darkModeBtn.innerHTML = '<i class="far fa-lightbulb"></i>';
}

function deactivateDarkMode() {
  body.classList.remove("dark-theme");
  newProjectFormSection.classList.remove("dark-theme");
  projectsContainer.classList.remove("dark-theme");
  darkModeBtn.classList.remove("dark-theme");
  localStorage.setItem("dark-mode", "deactivated");
  darkModeBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i>';
}

function changeMode() {
  darkMode = localStorage.getItem("dark-mode"); // update darkMode when clicked
  if (darkMode === "deactivated") {
    activateDarkMode();
  } else {
    deactivateDarkMode();
  }
}

// sorting projercts by datae

function sortProjects (projects, sortOptionSelected){
  if(sortOptionSelected ==='createDateOldest'){
  return projects.sort((a,b) => 
    { 
      if (a.createdDate === b.createdDate) {
        const aId = parseInt(a.id);
        console.log(aId)
        const bId = parseInt(b.id);
        return bId - aId;
      } else {
        const aDate = new Date(a.createdDate);
        const bDate = new Date(b.createdDate);
        return bDate - aDate;
      }
  
 })
  }
  else if(sortOptionSelected ==='createDateNewest'){
    return projects.sort((a,b) => {
      if (a.createdDate === b.createdDate) {
        const aId = parseInt(a.id);
        console.log(aId)
        const bId = parseInt(b.id);
        return aId - bId;
      } else {
        const aDate = new Date(a.createdDate);
        const bDate = new Date(b.createdDate);
        return aDate -bDate;
      }
    })
  }
  else {
    return projects
  }
}

// filtering projects by completion

function filterProjects(projects, filterOption){
 if(filterOption === 'isCompletedFalse'){

    return projects.filter(project => project.isComplete === false)

  } else if(filterOption === 'isCompletedTrue'){

    return projects.filter(project => project.isComplete === true)

  }
  else {
     return projects
  }
}



// handling the project display based on sort/filter values are selects

function handleOptionsChange(){
  const sortOptionSelected = sortOptions.value
  const filterOptionsSelected = filterOptions.value
  console.log(filterOptionsSelected)
  console.log(sortOptionSelected)

  const sortedProjects = sortProjects(projects, sortOptionSelected)
  const filteredProjects =filterProjects(sortedProjects, filterOptionsSelected)


   projectDisplay(filteredProjects)

}


darkModeBtn.addEventListener("click", changeMode);
document.addEventListener("DOMContentLoaded", isdarkMode);
document.addEventListener("DOMContentLoaded", handleOptionsChange)
sortOptions.addEventListener("change", handleOptionsChange)
filterOptions.addEventListener('change', handleOptionsChange)
formClose.addEventListener('click', handleOptionsChange)
closeDisplay.addEventListener("click",closeProject);
addTaskForm.addEventListener("submit", submitTask);
projectForm.addEventListener("submit", addProject);
appTitle.addEventListener("click", closeProject);


