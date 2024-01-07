
//Creating Cards to list Songs
function createCard(classname, dir, background, title1, subject1) {
    
    //Creating PlayList Container
    let playlistContainer = document.getElementById(classname);
    
    //Creating Card
    let card = document.createElement("div");
    card.classList.add("card");

    //Creating Inner Card
    let innerCard = document.createElement("div");
    innerCard.classList.add("inner-card");
    innerCard.style.backgroundImage = `url("${background}.jpeg")`;

    //Creting CardPlay button to control Audio
    let cardPlay = document.createElement("div");
    cardPlay.classList.add("card-play");
    cardPlay.classList.add("audio");
    let audio = document.createElement("p");

    audio.textContent = background + ".mp3";
    cardPlay.innerHTML = '<img src="/img/play.png" class="play-button"></img>'
    cardPlay.id = "controls";
    cardPlay.appendChild(audio);

    // Hide the <p> element within cardPlay
    audio.style.display = "none"; // Hide the <p> element

    //Setting Card Title 
    let cardTitle = document.createElement("div");
    cardTitle.classList.add("card-title");

    let strong = document.createElement("strong");
    let title = document.createElement("p");
    title.textContent = title1;
    
    //Setting Card Title
    let subject = document.createElement("p");
    subject.textContent = subject1;
    subject.style.fontSize = "13px";
    subject.style.color = "rgb(172, 177, 182)";

    // Append elements to their respective parent elements
    innerCard.appendChild(cardPlay);
    cardTitle.appendChild(strong);
    strong.appendChild(title);
    cardTitle.appendChild(subject);
    card.appendChild(innerCard);
    card.appendChild(cardTitle);

    // Append the card to the playlist container
    playlistContainer.appendChild(card);
    
}

async function fetchSongs() {
    
    //Using async function to fetching data from Json file stored in location.Which Will used to fetching all directory of songs
    try {
        let response = await fetch("/playlists.json"); //waiting for json response
        if (response.ok) {
            let playlist_json = await response.json(); //converting data into json
            for (let key in playlist_json) {
                let playlist = playlist_json[key];
                let dirs = playlist.dir;
                for (let index = 0; index < playlist.songs.length; index++) {
                    const song = playlist.songs[index];
                    const songDetails = song.split(","); // Splitting the song name by comma
                    if (songDetails.length >= 2) {
                        createCard(
                            "SongsContainer",
                            dirs,
                            dirs + song,
                            songDetails[0],
                            songDetails[1]
                        );
                    } else {
                        createCard("SongsContainer", dirs + song + ".jpeg", song, ""); // If no artist name is available
                    }
                }
            }
            MusicPlayer(); //Calling MusicPlayer to PlaySongs
            
        } else {
            throw new Error("Failed to fetch playlists");
        }
    } catch (error) {
        console.error("Error fetching playlists:", error);
        
    }
}

//This will convert seconds to Minute Seconds example: 60 --> 1:00
function secondsToMinutesSeconds(totalSeconds) {
    if (typeof totalSeconds !== "number" || totalSeconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
}

//This Function Is used to Change Music Automatically when CurrentPlaying Song get Finished on User Click
function ChangeTrack() {
    
    //Setting up All querySelector to interact with them
    let MusicInfo = document.querySelector(".song-info");
    let circle=document.querySelector(".circle")
    let CurrentLength = document.querySelector(".CurrentLen");
    let playBar = document.querySelector(".player-bar");
    let fullLength = document.querySelector(".SongLen");
    let MusicControls = document.querySelector(".playx");
    let nextSong=document.querySelector('.next-song')
    let previousSong=document.querySelector('.previous-song')
    let seekBar = document.querySelector(".player-bar");
    
    // let nextSongHander
    CurrentPlaying.removeEventListener('timeupdate',CurrentControllerHandler) //Removing Previous Song Events to avoid Multiple Song Played at one time
    
    CurrentControllerHandler=function() {

    //Updating seekbar at the time of playing Music
        seekBar.removeEventListener('click',seekBarHandler)
        //This Function will Handle SeekBar when user clicks on seekbar to forward or backwared Song 
        seekBarHandler=function(e){
            moveTo = e.offsetX / e.target.getBoundingClientRect()["width"]; 
            let FullLength = secondsToMinutesSeconds(CurrentPlaying.duration);
            fullLength.textContent = FullLength;
            CurrentLength.textContent = secondsToMinutesSeconds(CurrentPlaying.duration*moveTo);
            circle.style.left = `${moveTo*100}%`;
            playBar.style.background = `linear-gradient(to right, green ${moveTo*100}%, #ccc ${moveTo*100}%)`;

        }
        seekBar.addEventListener('click',seekBarHandler)
        durationPercent =(CurrentPlaying.currentTime / CurrentPlaying.duration) * 100;
        if (moveTo != null) {
            durationPercent = moveTo;
            moveTo = null;
            CurrentPlaying.currentTime =durationPercent * CurrentPlaying.duration;
        }
        circle.style.left = `${durationPercent}%`;
        playBar.style.background = `linear-gradient(to right, green ${durationPercent}%, #ccc ${durationPercent}%)`;

        //Plays Automatically Song When Song get Finished
        if (durationPercent == 100) {
            circle.style.left = 0;
            playBar.style.background = `linear-gradient(to right, white ${0}%, #ccc ${0}%)`;

            CurrentPlaying=null
            queue.push(queue[0]);
            queue.shift();
            console.log(queue[0])
            CurrentPlaying=new Audio(queue[0])
            MusicInfo.textContent = queue[0].split("/")[3].split(",")[0];
            console.log(queue)
            MusicControls.textContent = "pause_circle";
            CurrentPlaying.play()
            PlayingStatus=true
            ChangeTrack()
            
        }

        //Updating time and Duration of CurrentSong Playing.
        let CurrentTime = secondsToMinutesSeconds(CurrentPlaying.currentTime);
        CurrentLength.textContent = CurrentTime;

        FullLength = secondsToMinutesSeconds(CurrentPlaying.duration);
        fullLength.textContent = FullLength;

        //When User Drag the circle it moves forward and backward based on user Interaction with seekBar Circle
        let draggingCircle = document.querySelector(".circle");
            let isDragging = false;
            let offsetX, offsetY;

            draggingCircle.addEventListener("mousedown", (e) => {
                isDragging = true;
                offsetX = e.clientX - draggingCircle.getBoundingClientRect().left;
                offsetY = e.clientY - draggingCircle.getBoundingClientRect().top;
            });

            document.addEventListener("mousemove", (e) => {
                if (isDragging) {
                    let x = e.clientX - offsetX;
                    let y = e.clientY - offsetY;
                    draggingCircle.style.transform = `scale(1.5)`;
                }
            });

            document.addEventListener("mouseup", () => {
                if (isDragging) {
                    isDragging = false;
                    draggingCircle.style.transform = ""; 
                    CurrentPlaying.play(); 
                    PlayingStatus=true
                    MusicControls.textContent = "pause_circle";

                    
                }
            });

    }
    CurrentPlaying.addEventListener('timeupdate',CurrentControllerHandler)

    //Control MusicHandler Check the Current Playing Status and handle based on bool value 
    MusicControls.removeEventListener('click',MusicControlsHandler)
    MusicControlsHandler=function() {
        if (PlayingStatus) {
            PlayingStatus = false;
            CurrentPlaying.pause();
            MusicControls.textContent = "play_circle";
        } else {
            PlayingStatus = true;
            CurrentPlaying.play();
            PlayingStatus=true
            MusicControls.textContent = "pause_circle";
        }
    }
    MusicControls.addEventListener('click',MusicControlsHandler)

    //Plays next Song When Next clicks
    nextSong.removeEventListener('click',nextSongHander)
    nextSongHander=function(){
        console.log(1)
        CurrentPlaying.pause()  
        queue.push(queue[0]);
        queue.shift();
        CurrentPlaying=new Audio(queue[0])
        console.log(queue)
        MusicControls.textContent = "pause_circle";
        CurrentPlaying.play()
        PlayingStatus=true
        MusicInfo.textContent = queue[0].split("/")[3].split(",")[0];
        ChangeTrack()
    }
    nextSong.addEventListener('click',nextSongHander)

    //Playing Previous Song
    previousSong.removeEventListener('click',previousSongHandler)
    previousSongHandler=function(){
        CurrentPlaying.pause()
        queue.splice(0,0,queue[queue.length-1])
        queue.pop()
        delete CurrentPlaying     
        CurrentPlaying=new Audio(queue[0])
        CurrentPlaying.play()
        PlayingStatus=true
        MusicControls.textContent = "pause_circle";
        console.log(queue)
        MusicInfo.textContent = queue[0].split("/")[3].split(",")[0];
        ChangeTrack()}
        previousSong.addEventListener('click',previousSongHandler)
    }

//This Function Control Music
function MusicPlayer() {
    
    //Setting Querys
    let audios = document.querySelectorAll(".audio");
    let MusicControls = document.querySelector(".playx");
    let MusicInfo = document.querySelector(".song-info");
    let srcs=document.querySelectorAll(".audio p ")

    //Making Queue List of all songs
    audios.forEach((audio,index) => {
        queue.push(audio.textContent);
        // Adding EventListner to Every Card
        audio.addEventListener("click", (event) => {
            let path=srcs[index].textContent
            
            if (CurrentPlaying == null || queue[0] != path) {
                if (CurrentPlaying != null) {
                    CurrentPlaying.pause();
                    PlayingStatus=false
                    CurrentPlaying.removeEventListener('timeupdate',CurrentControllerHandler)
                    CurrentPlaying=null
                }
                queue.splice(queue.indexOf(path),1)
                queue.splice(0,0, path)
                CurrentPlaying = new Audio(queue[0]);
                CurrentPlaying.play();
                PlayingStatus=true
                ChangeTrack()
                MusicControls.textContent = "pause_circle";
                PlayingStatus = true;
                MusicInfo.textContent = queue[0].split("/")[3].split(",")[0];
                
            } else if (queue[0] == path) {
                if (PlayingStatus) {
                    CurrentPlaying.pause();
                    PlayingStatus = false;
                    MusicControls.textContent = "play_circle";
                } else {
                    CurrentPlaying.play();
                    PlayingStatus = true;
                    MusicControls.textContent = "pause_circle";
                }
            }
            
        });
        
        
    });

    // Making Random queue 
    queue=queue.sort(() => Math.random() - 0.5); 
    
    //Setting Up randomly new song intially
    CurrentPlaying=new Audio(queue[0])
    CurrentPlaying.pause()
    MusicInfo.textContent = queue[0].split("/")[3].split(",")[0];
    ChangeTrack()

}
let nextSongHander;
let previousSongHandler;
let MusicControlsHandler;
let CurrentControllerHandler
let seekBarHandler
let PlayingStatus=false
let CurrentPlaying;
let queue = [];

// Fetch Songs when Page reloads.
fetchSongs();
