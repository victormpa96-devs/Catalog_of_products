const DOM = {
  selectCategory: document.getElementById("categories"),
  categoriesSwitch: document.getElementById("categoriesSwitch"),
  categoriesDelete: document.getElementById("categoriesDelete"),
  changeCategory: document.getElementById("changeCategory"),
  modifyCategoryName: document.getElementById("modifyCategoryName"),
  deleteCategory: document.getElementById("deleteCategory"),
  modifyCategoryNameInput: document.getElementById("modifyCategoryNameInput"),
  modifyCategoryNameBtn: document.getElementById("modifyCategoryNameBtn"),
  saveBtn: document.getElementById("save"),
  imagesContainer: document.getElementById("imagesContainer"),
  addModifySection: document.getElementById("addModifySection"),
  deleteBtn: document.getElementById("delete"),
  addBtn: document.getElementById("add"),
  addCategoryBtn: document.getElementById("addCategoryBtn"),
  addCategoryInput: document.getElementById("addCategory"),
  modifyBtn: document.getElementById("modify"),
  inputLink: document.getElementById("inputLink"),
  inputTitle: document.getElementById("inputTitle"),
};

var categories = [];
var catalog = [];

let localCatagories = [
  { name: "Jamones" },
  { name: "Quesos" },
  { name: "Salchichas" },
  { name: "Mortadelas" },
  { name: "Chorizos" },
];

let localCatalog = [
  {
    id: 1,
    src: "./img/jamon.jpg",
    onerror: "this.onerror=null; this.src='./img/no-image.jpg';",
    title: "Gran Reserva Premium Casa Lucas",
    category: "Jamones",
  },
  {
    id: 2,
    src: "./img/queso.jpg",
    onerror: "this.onerror=null; this.src='./img/no-image.jpg';",
    title: "Queso de Oveja Curado ADIANO",
    category: "Quesos",
  },
  {
    id: 3,
    src: "./img/salchichas.jpg",
    onerror: "this.onerror=null; this.src='./img/no-image.jpg';",
    title: "Salchichas de pavo Ahumada BERNINA",
    category: "Salchichas",
  },
  {
    id: 4,
    src: "./img/mortadela.jpg",
    onerror: "this.onerror=null; this.src='./img/no-image.jpg';",
    title: "Mortadella di Bologna I.G.P",
    category: "Mortadelas",
  },
  {
    id: 5,
    src: "./img/chorizo.jpg",
    onerror: "this.onerror=null; this.src='./img/no-image.jpg';",
    title: "Chorizo ibérico 'El Catedrático'",
    category: "Chorizos",
  },
];

// IIFE FUNCTION WHICH LOAD CATEGORIES/CATALOG AND EXECUTES NECESSARY FUNCTIONS AND LISTENERS
(function main() {
  categories = JSON.parse(localStorage.getItem("categories"));
  if (!categories) {
    categories = localCatagories;
  }
  catalog = JSON.parse(localStorage.getItem("catalog"));
  if (!catalog) {
    catalog = localCatalog;
  }

  selectCategory();
  setActive();
  displayOrRemoveOptions();
  changeCategory();
  printCatalog();
  DOM.saveBtn.addEventListener("click", save);
  DOM.addBtn.addEventListener("click", addProduct);
  DOM.addCategoryBtn.addEventListener("click", addCategory);
  DOM.modifyBtn.addEventListener("click", modifyProduct);
  DOM.changeCategory.addEventListener("click", changeCategory);
  DOM.modifyCategoryNameBtn.addEventListener("click", modifyCategoryName);
  DOM.deleteCategory.addEventListener("click", deleteCategory);
  DOM.deleteBtn.addEventListener("click", deleteProduct);
  document.body.removeEventListener("click", removeActive);
  document.body.addEventListener("click", removeActive);
})();

// FILL ALL SELECTS WITH THE LOADED CATEGORIES
function selectCategory() {
  DOM.selectCategory.innerHTML = "";
  DOM.modifyCategoryName.innerHTML = "";
  DOM.categoriesSwitch.innerHTML = "";
  DOM.categoriesDelete.innerHTML = "";

  categories.forEach((element) => {
    let optionSelectCategory = document.createElement("option");
    optionSelectCategory.setAttribute("value", element.name);
    optionSelectCategory.textContent = element.name;

    let optionCategoriesSwitch = document.createElement("option");
    optionCategoriesSwitch.setAttribute("value", element.name);
    optionCategoriesSwitch.textContent = element.name;

    let optionCategoriesDelete = document.createElement("option");
    optionCategoriesDelete.setAttribute("value", element.name);
    optionCategoriesDelete.textContent = element.name;

    let optionModifyCategoryName = document.createElement("option");
    optionModifyCategoryName.setAttribute("value", element.name);
    optionModifyCategoryName.textContent = element.name;

    DOM.selectCategory.appendChild(optionSelectCategory);
    DOM.categoriesSwitch.appendChild(optionCategoriesSwitch);
    DOM.categoriesDelete.appendChild(optionCategoriesDelete);
    DOM.modifyCategoryName.appendChild(optionModifyCategoryName);
  });
}

// DISPLAY PRODUCTS OF SELECTED CATEGORY
function printCatalog() {
  var currentCategory = DOM.selectCategory.value;
  let getCatalog = catalog.filter(
    (product) => product.category == currentCategory
  );
  DOM.imagesContainer
    .querySelectorAll("div")
    .forEach((product) => product.remove());

  getCatalog.forEach(function printImages(product) {
    let div = document.createElement("div");

    let img = document.createElement("img");
    let span = document.createElement("span");

    div.classList.add("image");
    div.setAttribute("id", product.id);    

    img.setAttribute("src", product.src);
    img.setAttribute("onerror", product.onerror);
    span.textContent = product.title;

    div.appendChild(img);
    div.appendChild(span);

    DOM.imagesContainer.insertAdjacentElement("beforeend", div);
  });

  setActive();
}

// REFRESH EVENT LISTENERS OF PRODUCTS CONTAINER TO HANDLE "ACTIVE" PRODUCTS
function setActive() {
  DOM.imagesContainer.querySelectorAll("div").forEach((e) => {
    e.removeEventListener("click", handleImageClick);
  });

  DOM.imagesContainer.querySelectorAll("div").forEach((e) => {
    e.addEventListener("click", handleImageClick);
  });
}

// ADD TO MULTIPLES PRODUCTS THE CLASS "ACTIVE" (CTRL+CLICK) OR ADD IT TO ONLY ONE PRODUCT (CLICK WITHOUT CTRL)
function handleImageClick(event) {
  event.stopPropagation();
  let e = event.currentTarget;

  if (event.ctrlKey) {
    e.classList.toggle("active");
  } else {
    DOM.imagesContainer
      .querySelectorAll("div")
      .forEach((product) => product.classList.remove("active"));
    e.classList.add("active");
  }

  // UPDATE WHAT OPTIONS ARE AVAILABLE
  displayOrRemoveOptions();
}

// CLICKING OUT OF PRODUCTS REMOVE "ACTIVE CLASS" TO ALL PRODUCTS
function removeActive(click) {
  let classElementClicked = click.target.parentElement?.getAttribute("class");
  let addModifyClicked =
    click.target.parentElement?.parentElement?.getAttribute("id");
  let clickOnAddModifyInputs =
    click.target.getAttribute("id") == "inputTitle" ||
    click.target.getAttribute("id") == "inputLink";
  let clickOnCSwitchORSwitchBtn =
    click.target.getAttribute("id") == "categoriesSwitch" ||
    click.target.getAttribute("id") == "changeCategory";

  if (
    classElementClicked != "image active" &&
    addModifyClicked != "displayOrRemoveOptions" &&
    !clickOnAddModifyInputs &&
    !clickOnCSwitchORSwitchBtn
  ) {
    DOM.imagesContainer
      .querySelectorAll("div")
      .forEach((product) => product.classList.remove("active"));
  }

  // UPDATE WHAT OPTIONS ARE AVAILABLE
  displayOrRemoveOptions();
}

// LET ADD OR MODIFY A PRODUCT
function displayOrRemoveOptions() {
  var arrayActives = DOM.imagesContainer.getElementsByClassName("image active");

  if (arrayActives.length <= 1) {
    DOM.addModifySection.classList.remove("d-none");

    if (arrayActives.length == 0) {
      DOM.modifyBtn.classList.add("d-none");
      DOM.addBtn.classList.remove("d-none");
    }

    if (arrayActives.length == 1) {
      DOM.modifyBtn.classList.remove("d-none");
      DOM.addBtn.classList.remove("d-none");
    }
  }

  if (arrayActives.length > 1) {
    DOM.addModifySection.classList.add("d-none");
    DOM.addBtn.classList.add("d-none");
  }
}

// ADD NEW CATEGORY
function addCategory() {
  let inputText = DOM.addCategoryInput.value.trim();
  let currentCategories = categories.map((category) =>
    category.name.toLowerCase()
  );

  if (
    inputText.length != 0 &&
    !currentCategories.includes(inputText.toLowerCase())
  ) {
    let newCategory = { name: inputText };
    categories.push(newCategory);
    DOM.addCategoryInput.value = "";
    selectCategory();
  }
}

// MODIFY A CATEGORY NAME
function modifyCategoryName() {
  let categoryToModify = DOM.modifyCategoryName.value;
  let newNameCategory = DOM.modifyCategoryNameInput.value.trim();

  if (newNameCategory.length >= 1) {
    newNameCategory =
      newNameCategory[0].toUpperCase() + newNameCategory.slice(1);

    categories.filter((category) => category.name == categoryToModify)[0].name =
      newNameCategory;
    catalog
      .filter((product) => product.category == categoryToModify)
      .forEach((product) => (product.category = newNameCategory));

    selectCategory();
    printCatalog();
  }
}

// MODIFY THE IMAGE AND/OR THE NAME OF A PRODUCT
function modifyProduct() {
  let valueImgURL = DOM.inputLink.value.trim();
  let valueTitle = DOM.inputTitle.value.trim();

  if (valueImgURL.length != 0 || valueTitle.length != 0) {
    changeProduct(valueImgURL, valueTitle);
    printCatalog();

    // CLEAN THE INPUTS ONCE SEND NEW DATA
    DOM.inputLink.value = "";
    DOM.inputTitle.value = "";
  }
}

function changeProduct(valueImgURL, valueTitle) {
  let idProductSelected = DOM.imagesContainer
    .getElementsByClassName("image active")[0]
    .getAttribute("id");
  let findProduct = catalog.find((e) => e.id == idProductSelected);

  if (findProduct) {
    let voidImgUrlInput = valueImgURL.length < 1;
    let voidTitleInput = valueTitle.length < 1;

    // CHANGE DATA IF NEW DATA IS NOT VOID
    findProduct.src = voidImgUrlInput ? findProduct.src : valueImgURL;
    findProduct.title = voidTitleInput ? findProduct.title : valueTitle;
  }
}

// ADD NEW PRODUCT
function addProduct() {
  let valueLink = document.getElementById("inputLink").value.trim();
  let valueTitle = document.getElementById("inputTitle").value.trim();

  let numElementsSelected =
    document.getElementsByClassName("image active").length;

  if (numElementsSelected == 0) {
    if (valueLink.length >= 1 && valueTitle.length >= 1) {
      let object = {
        id: catalog[catalog.length - 1].id + 1,        
        src: valueLink,
        onerror: "this.onerror=null; this.src='./img/no-image.jpg';",
        title: valueTitle,
        category: DOM.selectCategory.value,
      };

      catalog.push(object);

      console.log(catalog);

      printCatalog();
    }
  }

  if (numElementsSelected == 1) {
    if (valueLink.length >= 1 && valueTitle.length >= 1) {
      let idProductSelected = DOM.imagesContainer
        .getElementsByClassName("image active")[0]
        .getAttribute("id");

      let indexProductSelected = catalog.findIndex(
        (product) => product.id == idProductSelected
      );

      let object = {
        id: catalog[catalog.length - 1].id + 1,        
        src: valueLink,
        onerror: "this.onerror=null; this.src='./img/no-image.jpg';",        
        title: valueTitle,
        category: DOM.selectCategory.value,
      };

      catalog.splice(indexProductSelected, 0, object);

      DOM.inputLink.value = "";
      DOM.inputTitle.value = "";

      printCatalog();
    }
  }

  // CLEAN THE INPUTS ONCE SEND NEW DATA
  DOM.inputLink.value = "";
  DOM.inputTitle.value = "";
}

// MOVE THE SELECTED PRODUCTS TO ANOTHER CATEGORY
function changeCategory() {
  if (DOM.imagesContainer.getElementsByClassName("image active").length >= 1) {
    let idsOfSelectedProducts = Array.from(
      DOM.imagesContainer.getElementsByClassName("image active")
    ).map((e) => e.getAttribute("id"));

    let getProducts = [];

    idsOfSelectedProducts.forEach(function (id) {
      let match = catalog.find((product) => product.id == id);
      getProducts.push(match);
    });

    let getSelectedCategory = DOM.categoriesSwitch.value;

    getProducts.forEach((product) => (product.category = getSelectedCategory));

    printCatalog();
  }
}

// DELETE SELECTED PRODUCTS
function deleteProduct() {
  if (DOM.imagesContainer.getElementsByClassName("image active").length >= 1) {
    let idsOfSelectedProducts = Array.from(
      DOM.imagesContainer.getElementsByClassName("image active")
    ).map((e) => e.getAttribute("id"));

    let getProducts = [];

    idsOfSelectedProducts.forEach(function (id) {
      let match = catalog.find((product) => product.id == id);
      getProducts.push(match);
    });

    catalog = catalog.filter((product) => !getProducts.includes(product));

    printCatalog();
  }
}

// DELETE SELECTED CATEGORY
function deleteCategory() {
  let categoryToDelete = DOM.categoriesDelete.value;

  catalog = catalog.filter((product) => product.category != categoryToDelete);
  categories = categories.filter(
    (category) => category.name != categoryToDelete
  );

  selectCategory();
  printCatalog();
}

// SAVE CHANGES IN CATEGORIES AND CATALOG
function save() {
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("catalog", JSON.stringify(catalog));
}
