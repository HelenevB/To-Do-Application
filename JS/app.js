const projectsContainer = document.querySelector('[data-projects]')

let projects = ['projectOne', 'projectTwo', 'projectThree', 'project4', 'project5', 'project6']

function projectList(){

    projects.forEach(project =>{
        const projectElement = document.createElement('div')
        const projectHeading = document.createElement('h3')
        projectHeading.innerText = project
        projectElement.appendChild(projectHeading)
        projectElement.classList.add("project-element")
        projectsContainer.appendChild(projectElement)

    

    })
   
}


projectList()