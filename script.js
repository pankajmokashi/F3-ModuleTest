const key = "sCzoxRMJkwhWqlnvfInkKiqFVqZYLkOmJd3vDxHT"
const form = document.getElementById("search-form")

function displayData(data, date) {
    const imageContainer = document.getElementById("current-image-container")
    const currentDate = new Date().toISOString().split("T")[0];
    let heading = ""
    if (date === currentDate) {
        heading = "NASA Picture of the Day"
    }
    else {
        heading = `Picture on ${date}`
    }
    imageContainer.innerHTML =
        `
            <div class="heading">${heading}</div>
            <div class="image" style="background-image: url(${data.hdurl});"></div>
            <div class="imageHeading">${data.title}</div>
            <div class="imageText">${data.explanation}</div>
        `
}

function addSearchToHistory(){
    let data = JSON.parse(localStorage.getItem("searches"))
    const searchHistory =  document.getElementById("search-history")
    searchHistory.innerHTML = ""
    data.forEach((ele) => {
        let li = document.createElement("li")
        let a = document.createElement("a")
        a.innerHTML = `${ele.date}`
        li.appendChild(a)
        searchHistory.appendChild(li)
        li.addEventListener("click", () => {
            getData(ele.date)
        })
    })
    
}

function saveSearch(searchedDate) {
    let searches = JSON.parse(localStorage.getItem("searches"))
    if (!searches) {
        let data = []
        let obj = {
            date: searchedDate
        }
        data.push(obj)
        localStorage.setItem("searches", JSON.stringify(data))
    }
    else{
        searches = searches.filter((ele) => {
            return ele.date !== searchedDate
        })
        let obj = {
            date: searchedDate
        }
        searches.push(obj)
        localStorage.setItem("searches", JSON.stringify(searches))
    }
    addSearchToHistory()
}

async function getImageOfTheDay(event) {
    event.preventDefault()
    const currentDate = new Date().toISOString().split("T")[0];
    let searchedDate = event.target[0].value
    if (searchedDate && searchedDate <= currentDate) {
        saveSearch(searchedDate)
        getData(searchedDate)
    }
    else{
        alert("Select valid date")
    }
}

form.addEventListener("submit", getImageOfTheDay)

async function getData(date) {
    console.log(typeof(date), date)
    let url = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${date}`
    let response = await fetch(url)
    let data = await response.json()
    displayData(data, date)
}

function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    getData(currentDate)
    let searches = JSON.parse(localStorage.getItem("searches"))
    if(searches)
    addSearchToHistory()
}
getCurrentImageOfTheDay()