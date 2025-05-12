let currentSong = new Audio();
let songs;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60); // round instead of just using %
  const formattedMins = String(mins).padStart(2, "0");
  const formattedSecs = String(secs).padStart(2, "0");
  return `${formattedMins}:${formattedSecs}`;
}

async function getSongs() {
  //This code goes to the given link and fetches all the data
  let api = await fetch("http://127.0.0.1:3000/songs/");
  //Converting the data to understandable form
  let response = await api.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  //Getting required data
  let a = div.getElementsByTagName("a");
  //for storing .mp3
  let song = [];
  // looping to check if the a have .mp3 or not
  for (let index = 0; index < a.length; index++) {
    const element = a[index];
    if (element.href.endsWith(".mp3")) {
      song.push(element.href.split("/songs/")[1]);
    }
  }
  return song;
}

const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if (pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".sname").innerHTML = decodeURI(track);
  document.querySelector(".time").innerHTML = "00:00 / 00:00";
};
async function main() {
  songs = await getSongs();

  playMusic(songs[0]);
  let songUl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    let final = song.replaceAll("%20", " ");
    let Aname = final.split("-")[0];
    let Sname = final.split("-")[1];

    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
              <div style="display:none">${final}</div>
              <div class="list ">
                <div class="box  center">

                  <i class="fa-solid fa-music" style="color: #ffffff;"></i>
                  <div class="info">
                  <div style="font-size:16px;">${Sname.split(".m")[0]}</div>
                    <div style="font-size:14px;">${Aname}</div>
                  </div>
                </div>
                <div class="play center">
                  Play now
                  <img src="play.svg" style="filter:invert();" alt="">
                </div>
              </div>
            </li>`;
  }

  //event listner to library
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      
      playMusic(e.firstElementChild.innerHTML, true);
    });
  });

  //event listner to button

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();

      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  previous.addEventListener("click", () => {
    
    let index = songs.indexOf(currentSong.src.split("/songs/")[1]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1], true);
    } else {
      playMusic(songs[songs.length - 1], true);
    }
  });
  next.addEventListener("click", () => {
    
    let index = songs.indexOf(currentSong.src.split("/songs/")[1]);
    if (index + 1 < songs.length) playMusic(songs[index + 1], true);
    else {
      playMusic(songs[0], true);
    }
  });
  
  //time update and circle update
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".time").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
    (currentSong.currentTime / currentSong.duration) * 100 + "%";

    if(currentSong.currentTime/currentSong.duration==1){
      let index = songs.indexOf(currentSong.src.split("/songs/")[1]);
      if(index+1<songs.length){

        playMusic(songs[index+1],true)
      }
      else{
        playMusic(songs[0],true)
      }
    }

  });

  //seekbar manipulation
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let timestap = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = timestap + "%";
    currentSong.currentTime = (timestap * currentSong.duration) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    left.style.left = 0;
  });
  document.querySelector(".close").addEventListener("click", () => {
    left.style.left = -110 + "%";
  });

  for (const song of songs) {
    let final = song.replaceAll("%20", " ");
    let Aname = final.split("-")[0];
    let Sname = final.split("-")[1].split(".mp3")[0];
    let cardHtml = document.querySelector(".card-container");
    cardHtml.innerHTML =
      cardHtml.innerHTML +
      `          
          <li class="card">
          <div style="display:none">${final}</div>
            <div class="play">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="34"
              >
                <path
                fill="#1dc35d"
                d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"
                />
              </svg>
            </div>
            <img src="song1.png" alt="" class="" />
            <h2>${Sname}</h2>
            <p>${Aname}</p>
          </li>`;
  }
  Array.from(
    document.querySelector(".card-container").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click",()=>{

      playMusic(e.firstElementChild.innerHTML,true);
    })
    
  });
}
main();
