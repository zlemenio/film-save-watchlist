import { loadDetailsFilm } from "./fetchFilmDetails.js";



const filmContent = document.getElementById("film")


const searchValue = document.getElementById("searchMovie")
const searchBtn = document.getElementById("searchBtn")

// part for changing API KEY if only neccessary 
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZGIzYzAyNDVmNzJmZmFhNDVkOGI4MWM2ZDA1MTI3NyIsIm5iZiI6MTcyMTI2NTk2MS4yNTE3NTIsInN1YiI6IjY2OTdlMDc5NWRiYTAyNDhmODdlNDBlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9xiVfsCnaO-XCaA0YH4nKqyMb9u2qxj1-F0WljPQNug'
    }
};


searchBtn.addEventListener("click", function(){
    if (searchValue.value) {
        // Get the id for further fetching
        filmContent.innerHTML = ``
        fetch(`https://api.themoviedb.org/3/search/movie?query=${searchValue.value.replace(" ", "%20")}&include_adult=false&language=en-US&page=1`, options)
        .then(response => response.json())
        .then(response => {
            if (response.results.length >= 1) {
                for(let i = 0; i < response.results.length; i++){
                    // Now we fetch over the detail
                    loadDetailsFilm(response.results[i].id, filmContent, options)
                    console.log(`eachFilm id: ${response.results[i].id}`)
                    //   filmContent.innerHTML = feedHTML
                    console.log(`number counting ${i}`)
                }
            }else {
                // No response for the result 
                filmContent.innerHTML = `
                <div id="default-search-interface">
                    <div id="default-searchList">
                        <h3 class="default-searchWait-title">Unable to find what you’re looking for. Please try another search.</h3>
                    </div>
                </div>`
            } 

            })
        .catch(err => console.error(err));
        
    } else {
        searchBtn.textContent = "Haven't typed anything!"
        setTimeout(function(){
            searchBtn.textContent = "Search"
        },2000)
    }
    
})

function append2Local(favouriteFilmID){
    var previousData = localStorage.getItem("fav")
    if (previousData === null) {
        var data2Add = []
        data2Add.push(favouriteFilmID)
        localStorage.setItem("fav", JSON.stringify(data2Add))
    } else {
        previousData = JSON.parse(previousData)
        previousData.push(favouriteFilmID)
        localStorage.setItem("fav", JSON.stringify(previousData))
    }
}

function remove2Local(favouriteFilmID) {
    var previousData = localStorage.getItem("fav")
    if (previousData) {
        localStorage.removeItem("fav", favouriteFilmID)
    } else {
        return "404"
    }
}


document.addEventListener("click", function(e){
    if (e.target.dataset.showmore) {
        const id = e.target.dataset.showmore
        console.log(`id: ${id}`)
        const showMoreBtn = document.getElementById(`${id}-showmoreBtn`)
        const showMoreContent = document.getElementById(`${id}-showlessContent`)
        const showLessBtn =  document.getElementById(`${id}-closeBtn`)
        
        console.log(`
            showMore: ${showMoreBtn}
            showLessBtn: ${showLessBtn}
            content: ${showMoreContent}    
            
        `)
        
        showMoreBtn.style.display = "none"

        showMoreContent.style.display = "inline-block"
        
        showLessBtn.style.display = "inline-block"
        showLessBtn.style.cursor = "pointer"
        
        showLessBtn.addEventListener("click", function(){
            showLessBtn.style.display = "none"
            showMoreContent.style.display = "none"
            showMoreBtn.style.display = "inline-block"
        })
        
        
    }





    // adding to local storage
    if(e.target.dataset.add){
        const id = e.target.dataset.add
        const addDiv = document.getElementById(`add-${id}-to-watchlist`)
        addDiv.innerHTML = `
            <img class="add-btn show" data-remove=${id} src="/static/img/icons8-remove-button-78.png">
            <h3 class="sub-watch-later show">Watch list</h3>
        `
        addDiv.id = `remove-${id}-to-watchlist`
        append2Local(id)
        
    }

    // remove from Local storage
    if(e.target.dataset.remove){
        const id = e.target.dataset.remove
        const removeDiv = document.getElementById(`remove-${id}-to-watchlist`)
        console.log(removeDiv)
        removeDiv.innerHTML = `
            <img class="add-btn show" data-add=${id} src="/static/img/icons8-add-button-60.png">
            <h3 class="sub-watch-later show">Watch list</h3>
        `
        removeDiv.id = `add-${id}-to-watchlist`
        remove2Local(id)
    }
})