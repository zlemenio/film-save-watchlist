

export const loadDetailsFilm = async function(id, filmContent, options){
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
        
        if (overview.length > 150){
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
    
                            <div class="adding-watch-list" id="add-${id}-to-watchlist">
                                <img class="add-btn show" data-add=${id} src="/static/img/icons8-add-button-60.png">
                                <h3 class="sub-watch-later show" data-add=${id}>Watch list</h3>
                            </div>
    
    
                        </div>
                        <p id="film-desc" class="film-desc">${overview.slice(0, 120)}<span id="${id}-showmoreBtn" class="show" data-showMore="${id}">...read more</span><span id="${id}-showlessContent" style="display:none;">${overview.slice(120, overview.length)}</span><span id="${id}-closeBtn" class="show" style="display:none;">...close</span></p>
        `
        } else {
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
                            <div class="adding-watch-list" id="add-${id}-to-watchlist">
                                <img class="add-btn show" data-add=${id} src="/static/img/icons8-add-button-60.png">
                                <h3 class="sub-watch-later show" data-add=${id}>Watch list</h3>
                            </div>
                        </div>
                        <p id="film-desc" class="film-desc">${overview}</p>
        `
        }
        
        filmContent.appendChild(filmItem)
    }
    
    