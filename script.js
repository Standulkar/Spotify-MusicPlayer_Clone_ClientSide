console.log("Let's write javascript");

//function to get the current time in seconds and convert it to minutes and seconds
// function to convert seconds to minutes and seconds
function secondtominutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "invalid input"
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}


let currentsong = new Audio();
// function to written songs for songs directory 
async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

// function to play the song
const playmusic = (track, pause = false) => {

    // let audio = new Audio("/songs/" + track)
    currentsong.src = "/songs/" + track
    if (!pause) {
        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

// as the above function is async need to write this main function and call the above
async function main() {


    // get list of all songs
    let songs = await getsongs()
    playmusic(songs[0], true)

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {

        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert" src="img/music.svg" alt="musicc">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").replaceAll("- 320Kbps-(Mr-Jat.in).mp3", " ").replaceAll("- PagalHits.mp3", " ").replaceAll("- Rockstar 128 Kbps.mp3", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="playyy">
                            </div>
        
        </li>`;
    }


    // // play the first song
    // var audio = new Audio(songs[0])
    // audio.play();


    // Add event listener to each song in the list
    // to play the song when clicked
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    // attach event listener to play , next and previous button
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        } else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    // listner for time update event
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondtominutes(currentsong.currentTime)} / ${secondtominutes(currentsong.duration)}`
        document.querySelector(".circle").style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        console.log(e.offsetX, e.target.clientWidth)
        let percentage = e.offsetX / e.target.clientWidth
        currentsong.currentTime = percentage * currentsong.duration
        document.querySelector(".circle").style.left = `${percentage * 100}%`
        document.querySelector(".songtime").innerHTML = `${secondtominutes(currentsong.currentTime)} / ${secondtominutes(currentsong.duration)}`
    })

    // add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0px"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add an event listner for previous button
    previous.addEventListener("click", () => {
        console.log("previous Clicked")
        console.log(currentsong)
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    // add an event listner for next button
    next.addEventListener("click", () => {
        console.log("Next Clicked");
    
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);
        } else {
            console.log("No more songs to play.");
        }
    });


}

main()

