//使用者觸發click事件,則播放音樂
var myMusic = document.getElementById("myMusic");
var volumeControl = document.getElementById("volumeControl");
var information = document.getElementById("information");
var progressBar = document.getElementById("progressBar");
var musicList = document.getElementById("musicList");
var functionButtons = document.getElementById("functionButtons");

var txtVolume = volumeControl.children[3];
var rangeVolume = volumeControl.children[0];

var musicDuration = information.children[0];
var playStatus = information.children[1];
var btnPlay = functionButtons.children[0];


var infoStatus = information.children[2];


/////////////////////////////////////////////
function musicStatus() {

    if (infoStatus.innerText == "單曲循環") {
        changeMusic(0);
    }
    else if (infoStatus.innerText == "隨機播放") {
        var n = Math.floor(Math.random() * musicList.length); //隨機在musicList中選擇一首歌
        changeMusic(n - musicList.selectedIndex);
    }
    else if (infoStatus.innerText == "全曲循環" && musicList.length == musicList.selectedIndex + 1) {

        changeMusic(0 - musicList.selectedIndex);
    }
    else if (musicList.length == musicList.selectedIndex + 1) { //是否為最後一首歌
        stopMusic();
    }
    else { //不是最後一首歌就播下一首歌
        changeMusic(1);
    }
}



function loopOne() {
    infoStatus.innerHTML = infoStatus.innerHTML == "單曲循環" ? "正常" : "單曲循環";
}
function setRandom() {
    infoStatus.innerHTML = infoStatus.innerHTML == "隨機播放" ? "正常" : "隨機播放";
}
function loopAll() {
    infoStatus.innerHTML = infoStatus.innerHTML == "全曲循環" ? "正常" : "全曲循環";
}

function changeMusic(n) {

    var i = musicList.selectedIndex; //選擇的音樂索引
    //console.log(i + n);
    myMusic.src = musicList.children[i + n].value; //更改音樂來源
    myMusic.title = musicList.children[i + n].innerText;
    musicList.children[i + n].selected = true; //選擇的音樂索引


    //console.log(btnPlay.innerText);

    if (btnPlay.innerText == ";") {
        myMusic.onloadeddata = playMusic; //等歌曲載入完畢後再播放音樂
    }


}



//時間格式
function getTimeFormat(t) {
    var min = parseInt(t.toFixed(0) / 60);
    var sec = parseInt(t.toFixed(0) % 60);

    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    return min + ":" + sec;
}

function setProgress() {

    myMusic.currentTime = progressBar.value / 10000; //更新音樂的當前時間
}



//音樂播放時間
function setMusicDuration() {
    musicDuration.innerHTML = getTimeFormat(myMusic.currentTime) + " / " + getTimeFormat(myMusic.duration);

    progressBar.value = myMusic.currentTime * 10000; //更新進度條的值
    //console.log(progressBar.value);

    var w = myMusic.currentTime / myMusic.duration * 100; //計算進度條的百分比
    progressBar.style.backgroundImage = `linear-gradient(to right, rgb(197, 7, 0) ${w}%,rgb(236,235,234) ${w}%)`;


}

//目前歌曲的長度初始化
function ProgressInitial() {
    progressBar.max = myMusic.duration * 10000; //音樂的總長度
    setInterval(setMusicDuration, 10); //每秒更新一次音樂時間



}

setVolumeByRangeBar(); //初始化音量

//音量調整
function setVolumeByRangeBar() {
    //console.log(event.target.value);
    txtVolume.value = rangeVolume.value;
    myMusic.volume = txtVolume.value / 100; //真正寫入音量屬性值

    //塗音量條的顏色
    rangeVolume.style.backgroundImage = `linear-gradient(to right, rgb(255, 179, 14) ${rangeVolume.value}%,rgb(240, 240, 240) ${rangeVolume.value}%)`;
}

//音量調整
function changeVolume(v) {
    rangeVolume.value = parseInt(rangeVolume.value) + v;
    setVolumeByRangeBar();
}


//靜音
function setMute() {
    myMusic.muted = !myMusic.muted;
    //event.target.innerHTML = event.target.innerHTML == "U" ? "V" : "U";
    event.target.className = event.target.className == "setMute" ? "" : "setMute";
}

//快轉倒轉
function changeTime(s) {
    myMusic.currentTime += s;
}


//倒轉
/*   function prevTime() {
      myMusic.currentTime -= 5;
  } */

//快轉
/* function nextTime() {
    myMusic.currentTime += 5;
} */

function updateInfo(txt) {
    playStatus.innerHTML = txt;
}


//播放音樂
function playMusic() {
    //console.log(event.target);
    myMusic.play();
    event.target.innerHTML = ";";
    event.target.onclick = pauseMusic;

    ProgressInitial(); //音樂開始播放時,才開始更新進度條的值
    //playStatus.innerHTML = "目前播放" + myMusic.title + "...";
    updateInfo("目前播放" + myMusic.title + "...")
}

//暫停音樂
function pauseMusic() {
    myMusic.pause();
    event.target.innerHTML = "4";
    event.target.onclick = playMusic;
    //playStatus.innerHTML = "音樂暫停...";
    updateInfo("音樂暫停...")
}

//音樂停止
function stopMusic() {
    //音樂要停下來 且 時間歸零
    myMusic.pause();
    myMusic.currentTime = 0;
    btnPlay.innerHTML = "4";
    btnPlay.onclick = playMusic; //恢復播放音樂的功能
    //playStatus.innerHTML = "音樂停止...";
    updateInfo("音樂停止...")
}