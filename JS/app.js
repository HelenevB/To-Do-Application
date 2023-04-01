const projectsContainer = document.querySelector('[data-projects]')
const projectForm = document.querySelector('[data-new-project-form]')
const projectName = document.querySelector('[data-new-project-name]')


const LOCAL_STORAGE_PROJECT_LIST = 'projects.list'

let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_LIST)) || []

function projectDisplay(){
     clearProject(projectsContainer)
    projects.forEach(project =>{
        const projectElement = document.createElement('div')
        const projectHeading = document.createElement('h3')
        projectHeading.innerText = project.name
        projectElement.appendChild(projectHeading)
        projectElement.classList.add("project-element")
        projectsContainer.appendChild(projectElement)
        console.log(project)

    })
   
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
    return {id: Date.now().toString(), name: name , task:[]}

}

function clearProject(element){
    while (element.firstChild)
    element.removeChild(element.firstChild)
}

projectDisplay()