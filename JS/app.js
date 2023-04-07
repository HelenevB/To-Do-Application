const projectsContainer = document.querySelector('[data-projects]')
const projectForm = document.querySelector('[data-new-project-form]')
const projectName = document.querySelector('[data-new-project-name]')
const taskName = document.querySelector('[data-new-task-name]')
const addTaskForm =document.querySelector('[data-new-task]')
const addTask = document.getElementById("add-Task")
const displayProject = document.getElementById("project-details")
const projectTitle =document.getElementById("project-title")



const LOCAL_STORAGE_PROJECT_LIST = 'projects.list'

let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_LIST)) || []
console.log(projects)

window
function projectDisplay(){
 clearProject(projectsContainer);
 projects.forEach((project) => {
   const projectElement = document.createElement('div');
   const projectHeading = document.createElement('h3');
   const projectDelete = document.createElement('button');
   const projectCreated = document.createElement('p');
   projectDelete.classList.add('delete-button');
   [projectElement, projectHeading, projectCreated].forEach((el) => {
     el.setAttribute('data-project-identifier', project.id);
   });
   projectDelete.setAttribute('id', project.id)
   projectHeading.innerText = project.name;
   projectElement.appendChild(projectHeading);
   projectElement.appendChild(projectDelete);
   projectHeading.appendChild(projectCreated);
   projectCreated.innerText = ` Created: ${project.createdDate}`;
   projectDelete.innerText = 'X';
   projectElement.classList.add('project-element');
   projectsContainer.appendChild(projectElement);
   console.log(project);
   
   projectDelete.addEventListener('click', deleteProject);

   projectElement.addEventListener('click', displayDetails)
   projectHeading.addEventListener('click', displayDetails);
   projectCreated.addEventListener('click', displayDetails);
 });
}


function deleteProject(event){
    const id =  projects.findIndex(project => project.id === event.target.id)
    console.log(id)
    projects.splice(id,1)
    localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects))
    projectDisplay()
}

  

projectForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const newProject = projectName.value
    // console.log(newProject)
    if(newProject === null |newProject === "") return
   const projectList = createProject(newProject)
   projectName.value = null 
   projects.push(projectList)
   localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects))
   projectDisplay()

})



function createProject(name){
    const date = new Date()
    const options = { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: '2-digit' };
    const formatDate= date.toLocaleString('en-UK', options).replace(',', '/');
    return {id: Date.now().toString(), name: name , createdDate: formatDate ,task:[]}

}



addTaskForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const currentProjectId = displayProject.getAttribute('data-project-identifier')
    const currentProject = projects.findIndex((project)=> project.id === currentProjectId)
    console.log(currentProject)
    const newTask = taskName.value
    if(!taskName) return;
    projects[currentProject].task.push(newTask)
    taskName.value = null
    localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(projects))
    console.log(projects[currentProject].task)

})


function clearProject(element){
    while (element.firstChild)
    element.removeChild(element.firstChild)
}


function displayDetails(event){
   projects.forEach((project)=>{
    if(project.id ===event.target.getAttribute('data-project-identifier')){
        console.log(project.name)
        projectTitle.innerText = project.name
        displayProject.setAttribute('data-project-identifier', project.id)

    }
   })


}

projectDisplay()