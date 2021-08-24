const main = function () {
  const experienceListElement = document.querySelector("#experienceList");

    experienceListElement.innerHTML = "";
      experiences.forEach(function (name) {

          const experienceElement = document.createElement("div");
          experienceElement.setAttribute("class", "col-md");

          experienceElement.innerHTML = `<div class="card hoverFocus">
          <div class="card-body">
          ${name} 
          </div>
          </div>`;
          experienceListElement.appendChild(experienceElement);
      })
};