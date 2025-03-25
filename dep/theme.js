let darkMode = localStorage.getItem("darkMode");
const darkModeToggle = document.querySelector("#themeToggle");

const enableDarkMode = () => {
  //add the class darkmode to the body
  document.body.classList.add("darkMode");
  //update darkmode in local storage
  localStorage.setItem("darkMode", "enabled");
};

const disableDarkMode = () => {
  //add the class darkmode to the body
  document.body.classList.remove("darkMode");
  //update darkmode in local storage
  localStorage.setItem("darkMode", null);
};

if (darkMode === "enabled") {
  enableDarkMode();
}

darkModeToggle.addEventListener("click", () => {
  darkMode = localStorage.getItem("darkMode");
  //will need a few more programs here.
  if (darkMode !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});
