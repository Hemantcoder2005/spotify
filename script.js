 function createCard(classname,dir, background, title1, subject1) {
    let playlistContainer = document.getElementById(classname);
    let card = document.createElement('div');
    card.classList.add('card');

    let innerCard = document.createElement('div');
    innerCard.classList.add('inner-card');
    innerCard.style.backgroundImage = `url("${background}")`;

    
   
    
    
    
    let cardPlay = document.createElement('div');
    cardPlay.classList.add('card-play');
    cardPlay.innerHTML = '<span class="material-symbols-outlined">play_circle</span>';
    
    let audio=document.createElement('audio')
    audio.src=dir+title1+","+subject1+".mp3"
    audio.classList('audio')

    let cardTitle = document.createElement('div');
    cardTitle.classList.add('card-title');

    let strong = document.createElement('strong');
    let title = document.createElement('p');
    title.textContent = title1;

    let subject = document.createElement('p');
    subject.textContent = subject1;
    subject.style.fontSize = '13px';
    subject.style.color = 'rgb(172, 177, 182)';

    // Append elements to their respective parent elements
    innerCard.appendChild(cardPlay);
    cardTitle.appendChild(strong);
    strong.appendChild(title);
    cardTitle.appendChild(subject);
    card.appendChild(innerCard);
    card.appendChild(cardTitle);

    // Append the card to the playlist container
    playlistContainer.appendChild(card);
    return audio
}

async function fetchSongs() {
    let songs = [];
    try {
        let response = await fetch("/playlists.json");
        if (response.ok) {
            let playlist_json = await response.json();
            for (let key in playlist_json) {
                let playlist = playlist_json[key];
                createCard("playlistContainer",playlist.dir, playlist.img, playlist.title, playlist.subject);
                let dirs = playlist.dir;
                for (let index = 0; index < playlist.songs.length; index++) {
                    const song = playlist.songs[index];
                    songs.push(dirs + song);
                    // Splitting the song name assuming it's in the format "SongName, ArtistName"
                    const songDetails = song.split(','); // Splitting the song name by comma
                    if (songDetails.length >= 2) {
                        createCard("SongsContainer",dirs, dirs + song + ".jpeg", songDetails[0], songDetails[1]);
                    } else {
                        createCard("SongsContainer", dirs + song + ".jpeg", song, ""); // If no artist name is available
                    }   
                }
            }
            return songs;
        } else {
            throw new Error('Failed to fetch playlists');
        }
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return songs; // Return empty array or handle error as needed
    }
}

fetchSongs();

function controlSong{
    
}
