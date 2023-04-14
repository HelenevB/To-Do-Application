const projectSection = document.getElementById('project-section')
const projectsContainer = document.querySelector('[data-projects]');
const projectForm = document.querySelector('[data-new-project-form]');
const projectName = document.querySelector('[data-new-project-name]');
const taskName = document.querySelector('[data-new-task-name]');
const addTaskForm = document.querySelector('[data-new-task]');
const addTask = document.getElementById("add-Task");
const displayProject = document.getElementById("project-details");
const projectTitle = document.getElementById("project-title");
const taskList = document.querySelectorAll('.task-list');
const toDo = document.getElementById('todo-list');
const doing = document.getElementById("doing-list")
const done = document.getElementById("done-list")
const onHold = document.getElementById("onhold-list")
const tasks = document.querySelectorAll('.task');
const statusColumn = document.querySelectorAll('.status-columns');
const closeDisplay= document.getElementById('close-project')



const LOCAL_STORAGE_PROJECT_LIST = 'projects.list'

let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_LIST)) || []
console.log(projects)

// function to display all the projects 

function projectDisplay() {
    clearProject(projectsContainer);
  
    projects.forEach((project) => {
      const projectElement = createProjectDisplay(project);
      const projectDelete = createDeleteButton(project);
  
      projectElement.appendChild(projectDelete);
      addProjectEventListeners(projectElement);
      projectDelete.addEventListener('click', deleteProject);
      projectsContainer.appendChild(projectElement);
    });
  }


//   funtion built to create the project section 
function createProjectDisplay(project){

    const projectElement = document.createElement('div');
    const projectHeading = document.createElement('h3');
    const projectCreated = document.createElement('p');
  
    [projectElement, projectHeading, projectCreated].forEach((el) => {
      el.setAttribute('data-project-identifier', project.id);
    });
  
    projectHeading.innerText = project.name;
    projectCreated.innerText = ` Created: ${project.createdDate}`;
  
    projectElement.appendChild(projectHeading);
    projectElement.appendChild(projectCreated);
  
    projectElement.classList.add('project-element');
  
    return projectElement;
}


// function to create the delete button 
function createDeleteButton(project) {
    const projectDelete = document.createElement('button');
  
    projectDelete.setAttribute('id', project.id);
    projectDelete.classList.add('delete-button');
    projectDelete.innerText = 'X'
  
    return projectDelete;
  }

//   add event listeners to the project 
  function addProjectEventListeners(projectElement) {
    projectElement.addEventListener('click', displayDetails);
    projectElement.querySelector('h3').addEventListener('click', displayDetails);
    projectElement.querySelector('p').addEventListener('click', displayDetails);
  }

//   function to delete the project 

function deleteProject(event){
    event.stopPropagation()
    const id =  projects.findIndex(project => project.id === event.target.id)
    console.log(id)
    projects.splice(id,1)
    localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects))
    console.log(projects)
    projectDisplay()
}

function closeProject(){
location.reload()
}

  
// function to add a new projet 

function addProject(event){

        event.preventDefault()
        const newProject = projectName.value
        // console.log(newProject)
        if(newProject === null |newProject === "") return
       const projectList = createProject(newProject)
       projectName.value = null 
       projects.push(projectList)
       localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects))
       projectDisplay()
    
  
}


function createProject(name){
    const date = new Date()
    const options = { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: '2-digit' };
    const formatDate= date.toLocaleString('en-UK', options).replace(',', '/');
    return {id: Date.now().toString(), name: name , createdDate: formatDate ,tasks:[]}

}


function submitTask(event){

  event.preventDefault()
  const currentProjectId = displayProject.getAttribute('data-project-identifier')
  const currentProject = projects.findIndex((project)=> project.id === currentProjectId)
  console.log(currentProject)
  const newTaskName = taskName.value
  if(!newTaskName) return;
  if (projects[currentProject].tasks.some((task)=> task.name === newTaskName))  return; 
  const newTask = { name: newTaskName , id: Date.now().toString(), status:'todo'}
  projects[currentProject].tasks.push(newTask)
  taskName.value = null
  const newTaskDisplay= document.createElement('p')
  newTaskDisplay.setAttribute('data-task-id', newTask.id)
  newTaskDisplay.classList.add('task')
  newTaskDisplay.setAttribute('draggable' ,true)
  newTaskDisplay.innerText = newTask.name

  newTaskDisplay.addEventListener('dragstart', () => {
      newTaskDisplay.classList.add("dragging");
    });
    
  newTaskDisplay.addEventListener("dragend", ()=>{
      newTaskDisplay.classList.remove("dragging");
    });

  statusColumn.forEach((column)=>{
    column.addEventListener("dragover", (e)=>{
      e.preventDefault();
      e.stopPropagation();
   
    });

    column.addEventListener("drop", (e)=>{
      e.preventDefault();
      e.stopPropagation();
      const draggedItem = document.querySelector(".dragging");
      const taskId = draggedItem.getAttribute('data-task-id')
      const project = projects[currentProject]
      const currentTask = project.tasks.findIndex((task)=> task.id === taskId)
      const status = column.getAttribute('id').split('-')[0]
      project.tasks[currentTask].status = status
      console.log(project.tasks)
      console.log(status)
      console.log(currentTask)
      console.log(draggedItem)
      console.log(taskId)              
      console.log(currentProjectId)    
      column.appendChild(draggedItem);
      localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects))
   
    });

    });
    
  toDo.appendChild(newTaskDisplay)
  localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects))
  console.log(projects[currentProject].tasks)

}


function clearProject(element){
    while (element.firstChild)
    element.removeChild(element.firstChild)
}


function displayDetails(event){
    projectSection.style.display="none"
    displayProject.style.display='block'
     projects.forEach((project)=>{
      if(project.id ===event.target.getAttribute('data-project-identifier')){
          console.log(project.name)
          projectTitle.innerText = project.name
          displayProject.setAttribute('data-project-identifier', project.id)
          clearProject(toDo)
          clearProject(doing)
          clearProject(done)
          clearProject(onHold)
  
          project.tasks.forEach((task) => {
            const taskExists = toDo.querySelector(`[data-task-id="${task.id}"]`)
            if(!taskExists){
                const allTaskDisplay = document.createElement('p')
                allTaskDisplay.classList.add('task')
                allTaskDisplay.setAttribute('data-task-id', task.id)
                allTaskDisplay.setAttribute('draggable' ,true)
                allTaskDisplay.innerText = task.name
                if(task.status === 'todo'){
                toDo.appendChild(allTaskDisplay) 
                } else if(task.status === "doing"){
                  doing.appendChild(allTaskDisplay)
                } else if(task.status === "done"){
                  done.appendChild(allTaskDisplay)
                } else if(task.status === "onhold"){
                  onHold.appendChild(allTaskDisplay)
                } else{
    
                }
    
    
                allTaskDisplay.addEventListener('dragstart', (event) => {
                    allTaskDisplay.classList.add("dragging");
                  });
        
                allTaskDisplay.addEventListener("dragend", ()=>{
                    allTaskDisplay.classList.remove("dragging");
                  });
            }
          
       
        
          })
         
  
  
         statusColumn.forEach((column)=>{
          
            column.addEventListener("dragover", (e)=>{
              e.preventDefault();
              e.stopPropagation();
           
            });
    
            column.addEventListener("drop", (e)=>{
              e.preventDefault();
              e.stopPropagation();
              const draggedItem = document.querySelector(".dragging");
              const taskId = draggedItem.getAttribute('data-task-id');
              const currentProjectId = project.id;
              const status = column.getAttribute('id').split('-')[0];
              const currentTask = project.tasks.findIndex((task)=> task.id === taskId);
              project.tasks[currentTask].status = status;
              const displayProjectId = displayProject.getAttribute('data-project-identifier')
              console.log(currentProjectId)
              console.log(displayProjectId)
              if(currentProjectId ===  displayProjectId){
                column.appendChild(draggedItem);
                localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects));
              } 
           
            });
    
          
          
  
          
  
        });
          
      }
     })
  
   
  }
  



 closeDisplay.addEventListener('click', closeProject)
 addTaskForm.addEventListener('submit', submitTask)
 projectForm.addEventListener('submit', addProject)
 
projectDisplay()