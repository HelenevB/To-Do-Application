const appTitle = document.getElementById('app-name')
const projectSection = document.getElementById('project-section')
const projectsContainer = document.querySelector('[data-projects]');
const projectForm = document.querySelector('[data-new-project-form]');
const projectName = document.querySelector('[data-new-project-name]');
const projectColor = document.getElementById("color-selector")
const taskName = document.querySelector('[data-new-task-name]');
const addTaskForm = document.querySelector('[data-new-task]');
const addTask = document.getElementById("add-Task");
const displayProject = document.getElementById("project-details");
const displayHeading = document.getElementById("display-heading");
const taskList = document.querySelectorAll('.task-list');
const toDo = document.getElementById('todo-list');
const doing = document.getElementById("doing-list")
const done = document.getElementById("done-list")
const onHold = document.getElementById("onhold-list")
const statusColumn = document.querySelectorAll('.status-columns');
const closeDisplay= document.getElementById('close-project')
const newProjectSection =document.getElementById('addNewProject')
const newProjectFormSection = document.getElementById('newProjectForm')
const projectFormSubmit = document.getElementById('projectformsubmit')



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
    const projectHeading = document.createElement('h2');
    const projectCreated = document.createElement('p');
  
    [projectElement, projectHeading, projectCreated].forEach((el) => {
      el.setAttribute('data-project-identifier', project.id);
    });
  
    projectHeading.innerText = project.name;
    projectCreated.innerText = ` Created: ${project.createdDate}`;
  
    projectElement.appendChild(projectHeading);
    projectElement.appendChild(projectCreated);
  
    projectElement.classList.add('project-element');
    projectElement.style.backgroundColor = project.backgroundColor
  
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
    projectElement.querySelector('h2').addEventListener('click', displayDetails);
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

function displayCreateProject(){
  if(newProjectFormSection.style.display === 'block'){
    newProjectFormSection.style.display = 'none'
  } else{
    newProjectFormSection.style.display = 'block'

  }
}

  

function addProject(event){

        event.preventDefault()
        event.stopPropagation()
        const newProjectName = projectName.value
        const newProjectColor = projectColor.value

        // console.log(newProject)
       if(!newProjectName) return
       const projectList = createProject(newProjectName, newProjectColor)
       projectName.value = null 
       projectColor.value = "#CC5500"
       projects.push(projectList)
       localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects))
       projectDisplay()
    
  
}


function createProject(name, color){
    const date = new Date()
    const options = { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: '2-digit' };
    const formatDate= date.toLocaleString('en-UK', options).replace(',', '/');
    return {id: Date.now().toString(), name: name , createdDate: formatDate ,tasks:[] , backgroundColor: color}

}


function submitTask(event){

  event.preventDefault()
  event.stopPropagation();
  const currentProjectId = displayProject.getAttribute('data-project-identifier')
  const currentProject = projects.findIndex((project)=> project.id === currentProjectId)
  
  console.log(currentProject)
  const newTaskName = taskName.value
  if(!newTaskName) return;
  if (projects[currentProject].tasks.some((task)=> task.name.toLowerCase() === newTaskName.toLowerCase()))  return 
  const newTask = { name: newTaskName , id: Date.now().toString(), status:'todo'}
  projects[currentProject].tasks.push(newTask)
  taskName.value = null
  const newTaskDisplay= document.createElement('p')
  const taskDelete = createTaskDeleteButton(newTask)
  newTaskDisplay.setAttribute('data-task-id', newTask.id)
  newTaskDisplay.classList.add('task')
  newTaskDisplay.setAttribute('draggable' ,true)
  newTaskDisplay.innerText = newTask.name
  newTaskDisplay.appendChild(taskDelete)


  newTaskDisplay.addEventListener('dragstart', () => {
      newTaskDisplay.classList.add("dragging");
    });
    
  newTaskDisplay.addEventListener("dragend", ()=>{
      newTaskDisplay.classList.remove("dragging");
    });
 
  toDo.appendChild(newTaskDisplay)
  taskDelete.addEventListener("click", projectTaskDelete)
  localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects))
  dragAndDropTask(projects[currentProject])
   console.log(projects[currentProject].tasks)
   taskDelete.addEventListener("click", projectTaskDelete)

 }

 function createTaskDeleteButton(task) {
  const taskDelete = document.createElement('button');

  taskDelete.setAttribute('id', task.id);
  taskDelete.classList.add('taskdelete-button');
  taskDelete.innerText = 'X'

  return taskDelete;
}

function projectTaskDelete(e){
  const taskId =e.target.getAttribute('id')
  const currentProjectId = displayProject.getAttribute('data-project-identifier');
  console.log(currentProjectId)
  console.log(taskId)
  const currentProject = projects.find(project =>project.id === currentProjectId)
  console.log(currentProject)
  const taskIndex = currentProject.tasks.findIndex(task => task.id === taskId)
  currentProject.tasks.splice(taskIndex, 1)
  console.log("task has been deleted ")
  localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects))
  const projectElement = document.querySelector(`[data-project-identifier="${currentProjectId}"]`);
  const clickEvent = new Event('click');
  projectElement.dispatchEvent(clickEvent);
    

}



function clearProject(element){
    while (element.firstChild)
    element.removeChild(element.firstChild)
}


function displayDetails(event){
    projectSection.style.display="none"
    displayProject.style.display='block'
    const projectId =event.currentTarget.getAttribute('data-project-identifier');
    const project = projects.find((project) => project.id === projectId);
   console.log(project.name)
     displayHeading.innerText= project.name
     displayProject.setAttribute('data-project-identifier', project.id)

          clearProject(toDo)
          clearProject(doing)
          clearProject(done)
          clearProject(onHold)
  
          project.tasks.forEach((task) => {
         
                const allTaskDisplay = document.createElement('p')
                const taskDelete = createTaskDeleteButton(task)
                allTaskDisplay.classList.add('task')
                allTaskDisplay.setAttribute('data-task-id', task.id)
                allTaskDisplay.setAttribute('draggable' ,true)
                allTaskDisplay.innerText = task.name
                allTaskDisplay.appendChild(taskDelete)
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
    
    
                allTaskDisplay.addEventListener('dragstart', () => {
                    allTaskDisplay.classList.add("dragging");
                  });
        
                allTaskDisplay.addEventListener("dragend", ()=>{
                    allTaskDisplay.classList.remove("dragging");
                  });
             
    
                  taskDelete.addEventListener("click", projectTaskDelete)

                })

                 dragAndDropTask(project)  
          }
       
           
         

  
 
  

  function dragAndDropTask(project){
    console.log(project)
    statusColumn.forEach((column)=>{


      column.addEventListener("dragover", (e)=>{
        e.preventDefault();
        e.stopPropagation()
      
     
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
                column.appendChild(draggedItem)
                localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects))
                console.log(project.tasks)
              
      
              } 
            });
          
         

  
        });

     }



 newProjectSection.addEventListener('click', displayCreateProject)
 projectFormSubmit.addEventListener('click', displayCreateProject)
 closeDisplay.addEventListener('click', closeProject)
 addTaskForm.addEventListener('submit', submitTask)
 projectForm.addEventListener('submit', addProject)
 appTitle.addEventListener('click', closeProject)
 
projectDisplay()