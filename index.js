const searchBtn = document.querySelector("#searchBtn");
const searchBar = document.querySelector("#searchBar");

searchBtn.addEventListener("click", () => {
  const city = searchBar.value.trim();

  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  localStorage.setItem("city", city);

  window.location.href = "./weather.html";
});

searchBar.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});
