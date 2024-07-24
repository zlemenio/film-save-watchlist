


const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZGIzYzAyNDVmNzJmZmFhNDVkOGI4MWM2ZDA1MTI3NyIsIm5iZiI6MTcyMTI2NTk2MS4yNTE3NTIsInN1YiI6IjY2OTdlMDc5NWRiYTAyNDhmODdlNDBlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9xiVfsCnaO-XCaA0YH4nKqyMb9u2qxj1-F0WljPQNug'
        }
};

      
// Math.round(number * 10) / 10

      
const filmContent = document.getElementById("film")

      
const loadDetailsFilm = async function(id){
        const data = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
        if (!data.ok) {
                throw Error("Might be link error")
        }
        const response = await data.json()
        
        // original_title
        const originTitle = response.original_title
        // vote_average - BUT IN ROUND DECIMAL
        const voteAverage =  Math.round(response.vote_average * 10) / 10
        // runtime
        const runtime = response.runtime
        // genre
        let genereResults = []
        for(let i = 0; i < response.genres.length; i++){
                genereResults.push(response.genres[i].name)
        }
        genereResults = genereResults.join(", ")
        // poster_path
        const posterPath = `https://image.tmdb.org/t/p/original/${response.poster_path}`
        // Overview
        const overview = response.overview
        
        const filmItem = document.createElement("div")
        filmItem.classList.add("film-item")
        filmItem.id = `film-item-${id}`
                
        if (overview.length > 150)
        // In case the content is too much 
        // We'll add show more btn
        {
              filmItem.innerHTML = `
                      <img class="featured-img" src="${posterPath}" onerror="this.src='/static/img/undefined.png';">
                      <div class="film-content">
                          
                          <!-- Title - film rate -->
                          <div class="film-title">
                              <h3 id="title">${originTitle}</h3>
                              <h3 id="rate">${voteAverage}</h3>
                              <img class="star-icon" src="/static/img/icons8-star-64.png">
                          </div>
                          
                          
                          <!-- Min - genra - watchlist -->
                          <div class="film-details">
                              <h3 id="run-time">${runtime} min</h3>
                              <h3 id="genre">${genereResults}</h3>
      
                              <div class="adding-watch-list" id="remove-${id}-to-watchlist">
                                  <img class="add-btn" data-remove=${id} src="/static/img/icons8-remove-button-78.png">
                                  <h3 class="sub-watch-later">Watch list</h3>
                              </div>
                          </div>
                          <p id="film-desc" class="film-desc">${overview.slice(0, 120)}<span id="${id}-showmoreBtn" class="show" data-showMore="${id}">...read more</span><span id="${id}-showlessContent" style="display:none;">${overview.slice(120, overview.length)}</span><span id="${id}-closeBtn" class="show" style="display:none;">...close</span></p>
          `
          } else
          // Just to make sure no unnesssary read more btn
          {
                filmItem.innerHTML = `
                        <img class="featured-img" src="${posterPath}" onerror="this.src='/static/img/undefined.png';">
                        <div class="film-content">
                                
                                <!-- Title - film rate -->
                                <div class="film-title">
                                        <h3 id="title">${originTitle}</h3>
                                        <h3 id="rate">${voteAverage}</h3>
                                        <img class="star-icon" src="/static/img/icons8-star-64.png">
                                </div>
                                
                                <!-- Min - genra - watchlist -->
                                <div class="film-details">
                                        <h3 id="run-time">${runtime} min</h3>
                                        <h3 id="genre">${genereResults}</h3>
                                <div class="adding-watch-list" id="remove-${id}-to-watchlist">
                                        <img class="add-btn" data-remove=${id} src="/static/img/icons8-remove-button-78.png">
                                        <h3 class="sub-watch-later">Watch list</h3>
                                </div>
                        </div>
                        <p id="film-desc" class="film-desc">${overview}</p>
                `
          }
          
        filmContent.appendChild(filmItem)
}



// Only load the content if it's available
if (localStorage.getItem("fav")){
        filmContent.innerHTML = ``
        let filmDataArr = (localStorage.getItem("fav"))
        
        filmDataArr = (JSON.parse(filmDataArr))
        filmDataArr.forEach(function(currentID) {
                loadDetailsFilm(currentID)
        })
}

// This is watch list so remove only*
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
                const showMoreBtn = document.getElementById(`${id}-showmoreBtn`)
                const showMoreContent = document.getElementById(`${id}-showlessContent`)
                const showLessBtn =  document.getElementById(`${id}-closeBtn`)

                showMoreBtn.style.display = "none"
                showMoreContent.style.display = "inline-block"
                showLessBtn.style.display = "inline-block"

                showLessBtn.addEventListener("click", function(){
                        showLessBtn.style.display = "none"
                        showMoreContent.style.display = "none"
                        showMoreBtn.style.display = "inline-block"
                })

        }

        if(e.target.dataset.remove){
                const id = e.target.dataset.remove
                remove2Local(id)
                document.getElementById(`film-item-${id}`).remove()
                if (document.getElementsByClassName(`featured-img`).length === 0){
                        filmContent.innerHTML = `
                        <div id="film-default">
                                <div id="default-watchList">
                                        <a href="index.html">
                                        <img id="default-add-btn" src="/static/img/icons8-add-button-60.png">
                                        </a>
                                        <h3 id="default-add-title"><a href="index.html">Adding something because it's empty!</a></h3>
                                </div>
                        </div>
                        `
                }
        }
})
