const musicImage = document.querySelector('.music_image img');
const musicName = document.querySelector('.music_name');
const artistName = document.querySelector('.artist_name');
const currentMusic = document.querySelector('#current_music');
const musicList = document.querySelector('.music_list');
const sMusicListBtn = document.querySelector('#show_music_list');
const playPauseBtn = document.querySelector('#play-pause_song');
const playNextMusic = document.querySelector('#next_song');
const playPrevMusic = document.querySelector('#prev_song');
const shuffleMusic = document.querySelector('#shuffle_song i');
const repeatMusic = document.querySelector('#repeat_song i');
const musicDuration = document.querySelector('.music_duration .starting_duration');
const musicTotalDuration = document.querySelector('.music_duration .total_duration');
const musicProgressBar = document.querySelector('.music_progress_bar');
const musicProgress = document.querySelector('.progress');

let currentMusicIndex = Math.floor(Math.random() * allMusics.length);;
let playedMusics = [];


function startMusic() {
    const music = allMusics[currentMusicIndex];
    musicImage.src = `./images/${music.musicImg}.jpg`;
    musicName.innerText = music.musicName;
    artistName.innerText = music.musicArtist;
    currentMusic.src = `./musics/${music.musicSource}.m4a`;

    updateMusicList();
}

function playPause() {
    const playIcon = 'play_arrow';
    const pauseIcon = 'pause';
    const icon = playPauseBtn.querySelector('i');
    if (icon.innerText === playIcon) {
        icon.innerText = pauseIcon;
        currentMusic.play();
    } else {
        icon.innerText = playIcon;
        currentMusic.pause();
    }
    updateMusicList();
}

function playMusic() {
    const icon = playPauseBtn.querySelector('i');
    icon.innerText = 'pause';
    currentMusic.play();
}

function pauseMusic() {
    const icon = playPauseBtn.querySelector('i');
    icon.innerText = 'play_arrow';
    currentMusic.pause();
}

function nextMusic() {
    if (shuffleMusic.classList.contains('shuffle')) {
        let nextIndex = Math.floor(Math.random() * allMusics.length);
        if (playedMusics.length === allMusics.length) {
            playedMusics = [];
        }
        while (playedMusics.includes(nextIndex)) {
            nextIndex = Math.floor(Math.random() * allMusics.length);
        }
        currentMusicIndex = nextIndex;
    } else {
        currentMusicIndex = (currentMusicIndex + 1) % allMusics.length;
    }
    startMusic();
    playedMusics.push(currentMusicIndex);
    playMusic();
}

function prevMusic() {
    if (shuffleMusic.classList.contains('shuffle')) {
        let prevIndex = Math.floor(Math.random() * allMusics.length);
        if (playedMusics.length === allMusics.length) {
            playedMusics = [];
        }
        while (playedMusics.includes(prevIndex)) {
            prevIndex = Math.floor(Math.random() * allMusics.length);
        }
        currentMusicIndex = prevIndex;
    } else {
        currentMusicIndex = (currentMusicIndex - 1 + allMusics.length) % allMusics.length;
    }

    startMusic();
    playedMusics.push(currentMusicIndex);
    playMusic();
}


function showHide() {
    const icon = sMusicListBtn.querySelector('i');
    if (icon.innerText === 'queue_music') {
        icon.innerText = 'close';
        musicList.style.opacity = 1;
        musicList.style.bottom = 0;

    } else {
        icon.innerText = 'queue_music';
        musicList.style.opacity = 0;
        musicList.style.bottom = '-50%';
        upperMusicControlBtn.setAttribute('disabled', '');
    }
}

function toggleShuffle() {
    const icon = shuffleMusic;
    if (icon.classList.contains('material-icons')) {
        icon.classList.toggle('shuffle');
        playedMusics = [];
        if (playedMusics.length === allMusics.length) {
            playedMusics = [];
        }
    }
}

function toggleRepeat() {
    const icon = repeatMusic;
    if (icon.classList.contains('material-icons')) {
        icon.classList.toggle('repeat');
        currentMusic.loop = icon.classList.contains('repeat');
        if (currentMusic.loop) {
            icon.innerText = 'repeat_one';
        } else {
            icon.innerText = 'repeat';
        }
    }
}


currentMusic.addEventListener('loadedmetadata', () => {
    musicTotalDuration.innerText = formatTime(currentMusic.duration);
});



function updateProgressBar() {
    musicProgress.style.width = `${(currentMusic.currentTime / currentMusic.duration) * 100}%`;
    musicDuration.innerText = `${Math.floor(currentMusic.currentTime / 60)}:${Math.floor(currentMusic.currentTime % 60).toString().padStart(2, '0')}`;
}



musicProgressBar.addEventListener('click', (e) => {
    const progressWidth = musicProgressBar.clientWidth;
    const clickPosition = e.offsetX;
    currentMusic.currentTime = (clickPosition / progressWidth) * currentMusic.duration;
    const playIcon = 'play_arrow';
    const pauseIcon = 'pause';
    const icon = playPauseBtn.querySelector('i');
    if (icon.innerText === playIcon) {
        icon.innerText = pauseIcon;
    }
    currentMusic.play();
    updateProgressBar();
});

function displayMusicList() {
    const musicList = document.querySelector('.music_list ul');
    musicList.innerHTML = '';
    allMusics.forEach((music) => {
        const musicItem = document.createElement('li');
        musicItem.innerHTML = `
        <div class="music_list_container">
        <div class="music_list_details">
          <span>${music.musicName}</span>
          <p>${music.musicArtist}</p>
        </div>
        <span class="duration"></span>
        </div>
      `;
        var audio = document.createElement('audio');
        audio.src = `./musics/${music.musicSource}.m4a`;
        audio.onloadedmetadata = () => {
            const durationSpan = musicItem.querySelector('.duration');
            durationSpan.innerText = formatTime(audio.duration);
        };
        musicItem.addEventListener('click', () => {
            currentMusicIndex = allMusics.indexOf(music);
            startMusic();
            playMusic();
        });
        musicItem.appendChild(audio);
        musicList.appendChild(musicItem);
    });
}
displayMusicList();

function updateMusicList() {
    const musicItems = document.querySelectorAll('.music_list li');
    musicItems.forEach((item, index) => {
        if (index === currentMusicIndex) {
            item.querySelector('.duration').textContent = 'Playing';
            item.querySelector('.music_list_container').classList.add('playing');
            item.style.padding = '5px';
        } else {
            item.querySelector('.music_list_container').classList.remove('playing');
            item.removeAttribute('style');
            const audio = new Audio(`./musics/${allMusics[index].musicSource}.m4a`);
            audio.addEventListener('loadedmetadata', () => {
                const durationSpan = item.querySelector('.duration');
                durationSpan.innerText = formatTime(audio.duration);
            });
        }
    });
}



function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

window.addEventListener('load', () => {
    startMusic();
    updateMusicList();
});

playPauseBtn.addEventListener('click', playPause);
playNextMusic.addEventListener('click', nextMusic);
playPrevMusic.addEventListener('click', prevMusic);
sMusicListBtn.addEventListener('click', showHide);
shuffleMusic.addEventListener('click', toggleShuffle);
repeatMusic.addEventListener('click', toggleRepeat);
currentMusic.addEventListener('ended', nextMusic);
currentMusic.addEventListener('timeupdate', updateProgressBar);
