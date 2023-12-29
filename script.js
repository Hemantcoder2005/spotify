//Storing Theme Prefernce in localStorage



//ChangeTheme By buuton
function ChangeTheme() {
    var body_id=document.getElementById("body")
    body_id.classList.toggle("bg-black")
    body_id.classList.toggle("bg-white")

}

//For playlist Setting ids
// let card=document.getElementById('card')
// let title=document.getElementById('title')
// let subject =document.getElementById('subject')
//  let thumbnail=document.getElementById('inner-card')

// let playListContainer=document.getElementById('playlist')

// let playlist_json=fetch("/playlists.json")

// playlist_json.then((value1)=>{
//     return value1.json()
// }).then((value2)=>{
//     for(let key in value2){
//     //    title.textContent=value2[key].title
//     //    subject.textContent=value2[key].subject
//     //    thumbnail.style.backgroundImage=`url("${value2[key].img}")`

       
//     }
// })


// Fetch JSON data
let playlistContainer = document.getElementById('playlistContainer');
let store_dirs=[]
let playlist_json = fetch("/playlists.json")
playlist_json.then((value1) => {
    return value1.json()
}).then((value2) => {
    for (let key in value2) {
        // Create elements for each playlist card
        let card = document.createElement('div');
        card.classList.add('card');

        let innerCard = document.createElement('div');
        innerCard.classList.add('inner-card');
        innerCard.style.backgroundImage = `url("${value2[key].img}")`;

        let cardPlay = document.createElement('div');
        cardPlay.classList.add('card-play');
        cardPlay.innerHTML = '<span class="material-symbols-outlined">play_circle</span>';

        let cardTitle = document.createElement('div');
        cardTitle.classList.add('card-title');

        let strong = document.createElement('strong');
        let title = document.createElement('p');
        title.textContent = value2[key].title;

        let subject = document.createElement('p');
        subject.textContent = value2[key].subject;
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

        store_dirs.push(value2[key].dir)
    }
});

console.log(store_dirs)
async function loadMusic(dir){
    let final_data=[]
    let data=await fetch("/playlists/Punjabi/")
    console.log(dir)
}

loadMusic(store_dirs[0])


    




