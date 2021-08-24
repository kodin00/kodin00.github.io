const main = function () {
  const businessListElement = document.querySelector("#businessList");

  businessListElement.innerHTML = "";
  businesses.forEach(function (business) {
    const { title, desc } = business;
    const businessElement = document.createElement("div");
    businessElement.setAttribute("class", "col-md");

    businessElement.innerHTML = `<div class="card hoverFocus">
          <img src="assets/images/shop.png" alt="shop" class="card-img-top img-fluid p-5 d-none d-sm-block">
          <div class="card-body">
            <h5 class="card-title fw-bold">${title}</h5>
            <p class="card-text">${desc}</p>
          </div>
        </div>`;

    businessListElement.appendChild(businessElement);
  });
};
