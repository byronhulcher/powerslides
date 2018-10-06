const ratingEl = document.getElementById('rating')
const mediaListEl = document.getElementById('media-list')

async function fetchMedia () {
  const rating = ratingEl.value

  let mediaResponse = await window.fetch(`/media/?rating=${rating}`)

  return mediaResponse.json()
}

async function resetAdminView () {
  let media = await fetchMedia()
  console.log(media)
  let innerHTML = ''
  mediaListEl.innerHTML = ""
  
  for (let mediaItem of media) {
    innerHTML +=
      `
      <div class="media-item" id="${mediaItem.tweetMediaId}-item">
        <!- ${JSON.stringify(mediaItem)} -->
        <a href="${mediaItem.s3Url}" target="_blank"><img src="${mediaItem.s3Url}"></img></a>
        <form>
          <fieldset>
            <legend>RATING</legend>
            <div>
                <input type="radio" id="${mediaItem.tweetMediaId}-unrated" 
                      onchange="updateMedia(this)"
                      name="rating" value="unrated" ${typeof mediaItem.rating === "undefined" ? "checked" : "disabled"} />
                <label for="${mediaItem.tweetMediaId}-unrated">Unrated</label>
            </div>
            <div>
                <input type="radio" id="${mediaItem.tweetMediaId}-nsfw" 
                      onchange="updateMedia(this)"
                      name="rating" value="nsfw" ${mediaItem.rating === "nsfw" ? "checked" : ""} />
                <label for="${mediaItem.tweetMediaId}-nsfw">NSFW</label>
            </div>
            <div>
                <input type="radio" id="${mediaItem.tweetMediaId}-sfw"  
                      onchange="updateMedia(this)"
                      name="rating" value="sfw" ${mediaItem.rating === "sfw" ? "checked" : ""} />
                <label for="${mediaItem.tweetMediaId}-sfw">SFW</label>
            </div>
          </fieldset>
        </form>
        
      </div>
      `
  }
  mediaListEl.innerHTML = innerHTML
}

async function updateMedia(el) {
  let [tweetMediaId, rating] = el.id.split('-');
  
  document.getElementById(`${tweetMediaId}-unrated`).disabled = true;
  let updatedMedia = await fetch(`/media/?media=${tweetMediaId}&rating=${rating}`, {method: 'PUT'});
  console.log(tweetMediaId, rating);
  console.log(updateMedia);
}


async function main () {
  await resetAdminView()
  ratingEl.addEventListener('change', resetAdminView)
}

main()
