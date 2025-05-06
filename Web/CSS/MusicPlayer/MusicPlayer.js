const LoopModeEnum = {
    None: 0,//不循環
    Single: 1,//單曲循環
    Random: 2,//全部隨機撥放
    All: 3//全部循環
}

var LoopMode = LoopModeEnum.None;
var LoopStatus = document.getElementById("LoopStatus");

function SetLoopMode() {
    if (LoopMode + 1 > LoopModeEnum.All) {
        LoopMode = LoopModeEnum.None;
    }
    else {
        LoopMode++;
    }

    //console.log("LoopMode : " + LoopMode);
    switch (LoopMode) {
        case LoopModeEnum.None://不循環
            LoopStatus.innerHTML = "不循環";
            break;
        case LoopModeEnum.Single://單曲重複
            LoopStatus.innerHTML = "單曲重複";
            break;
        case LoopModeEnum.Random://隨機播放
            LoopStatus.innerHTML = "隨機播放";
            break;
        case LoopModeEnum.All://全部循環
            LoopStatus.innerHTML = "全部循環";
            break;
    }
}

//使用者觸發click事件,則播放音樂
let MusicPlayer = document.getElementById("MusicPlayer");


var ProgressBar = document.getElementById("ProgressBar");
// ProgressBar.onclick=(()=>{
//     console.log("ProgressBar Clicked");
// });
// ProgressBar.oninput = (event) => {
//     //一變動就觸發
//     console.log("ProgressBar oninput");
// };
ProgressBar.onpointerdown = (event) => {
    console.log("ProgressBar onpointerdown");
    ProgressBarOnDrag = true; //設置為正在拖動進度條
};
ProgressBar.onpointerup = (event) => {
    console.log("ProgressBar onpointerup");
    ProgressBarOnDrag = false; //設置為不再拖動進度條

    MusicPlayer.currentTime = ProgressBar.value; //設置音樂的當前播放時間為進度條的值
};

var ProgressBarOnDrag = false; //是否正在拖動進度條

MusicPlayer.onended = () => {
    console.log("音樂播放結束");

    ChangeMusic(1);
};

//播放音樂
// function playMusic() {
//     MusicPlayer.play();
// }

// function pauseMusic() {
//     MusicPlayer.pause();
// }

let PlayPauseButton = document.getElementById("Btns").children[0];
function IsPlaying() {
    return PlayPauseButton.innerHTML == ";" ? true : false;
}
function SetPlayPauseButton(Value) {
    //0 : 暫停, 1 : 播放

    PlayPauseButton.innerHTML = Value == 0 ? ";" : "4"; //更改按鈕顯示為暫停
}

function LastMusic() {
    MusicPlayer.LastMusic();
}
function MusicSeek(Time) {
    MusicPlayer.currentTime += Time;
}
function NextMusic() {
    MusicPlayer.NextMusic();
}

//靜音
function SetMute() {
    //MusicPlayer.muted = !MusicPlayer.muted; //切換靜音狀態

    //event.target.innerHTML = MusicPlayer.muted ? "V" : "U"; //更改按鈕顯示
    if (MusicPlayer.muted) {
        MusicPlayer.muted = false;
        event.target.innerHTML = "U"; //移除靜音樣式
        event.target.className = "";
    } else {
        MusicPlayer.muted = true;
        event.target.innerHTML = "V"; //添加靜音樣式
        event.target.className = "Muted";
    }
}
//循環
function SetLoop() {
    //MusicPlayer.SetLoop();
}

//--------------------------------------------------音量
var VolumeControl = document.getElementById("VolumeControl");
function VolumeChange(Volume) {
    MusicPlayer.volume = Volume / 100;

    //console.log(Volume);
    //document.getElementById("VolumeText").value = Volume;
    VolumeControl.children[1].value = Volume; //更新音量值的文字顯示

    //動態調整音量拉條的背景色
    VolumeControl.children[0].style.backgroundImage = `linear-gradient(to right, #f06 ${Volume}%, #4a90e2 ${Volume}%)`;
    //background-image: linear-gradient(to right, #f06 , #4a90e2);
}
VolumeChange(100);
//---------------------------------------------------音量
var PlayingInfo = document.getElementById("PlayingInfo");

var MusicTime = PlayingInfo.children[0];
var InfoText = PlayingInfo.children[1];
function SetMusicTime() {
    //MusicTime.innerHTML="ASDASD";

    //console.log("IsPlaying : "+IsPlaying());

    MusicTime.innerHTML = GetTimeFormat(MusicPlayer.currentTime) + "/" + GetTimeFormat(MusicPlayer.duration);
    //console.log(1);

    if (!ProgressBarOnDrag) {
        //console.log("SetProgressBar " + MusicPlayer.currentTime);
        ProgressBar.value = MusicPlayer.currentTime; //更新進度條的值

        //進度條填色
        var W = MusicPlayer.currentTime / MusicPlayer.duration * 100;
        //console.log(MusicPlayer.duration + ", " + MusicPlayer.currentTime + ", Percent : " + W);
        ProgressBar.style.backgroundImage = `linear-gradient(to right, #f06 ${W}%, #4a90e2 ${W}%)`;
    }

    //音樂播放結束
    if (MusicPlayer.currentTime == MusicPlayer.duration) {


        //最後一首
        // if (MusicList.selectedIndex == MusicList.length - 1) {
        //     StopMusic();
        // }
        // else {
        //     ChangeMusic(1);//播放下一首
        // }
    }
}

function GetTimeFormat(t) {
    //總秒數轉換為00:00格式文字

    var Min = parseInt(t.toFixed(0) / 60);
    var Sec = parseInt(t.toFixed(0) % 60);

    return Min.toString().padStart(2, '0') + ":" + Sec.toString().padStart(2, '0');
}

function ChangeMusic(n) {

    //console.log("ChangeMusic : " + n);
    //MusicPlayer.src = MusicList.children[MusicList.selectedIndex].value;
    //console.log("CurrentMusic : " + MusicList.children[MusicList.selectedIndex].value);

    if (n == 0)//由音樂選單選取，直接播放指定曲目
    {
        //console.log(MusicList.selectedIndex);
        PlayIndex(MusicList.selectedIndex); //播放音樂
        return;
    }

    //當前播放曲目
    var Index = MusicList.selectedIndex;

    switch (LoopMode) {
        case LoopModeEnum.None://不循環
        case LoopModeEnum.Single://單曲重複
        case LoopModeEnum.All://全部循環
            {
                //判斷第一首或最後一首
                if ((n == -1 && Index > 0) || n == 1 && Index < MusicList.length - 1) {
                    // MusicPlayer.src = MusicList.children[Index + n].value;
                    // MusicPlayer.title = MusicList.children[Index + n].innerHTML;
                    // MusicList.children[Index + n].selected = true;

                    // console.log("ChangeMusic : " + MusicPlayer.title);

                    // if (PlayPauseButton.innerText == ";") {
                    //     MusicPlayer.onloadeddata = PlayMusic; //等歌曲載入完畢後再播放音樂
                    // }

                    PlayIndex(Index + n); //播放音樂
                }
                else {
                    console.log("MusicList位於第一首或最後一首");
                }
                break;
            }
        case LoopModeEnum.Random://隨機播放
            {
                //隨機播放
                var RandomIndex = 0;

                //隨機取值，避免取到的值與當前播放相同
                while (true) {
                    RandomIndex = Math.floor(Math.random() * MusicList.length);

                    if (RandomIndex != Index) {
                        break;
                    }
                }

                PlayIndex(RandomIndex); //播放隨機音樂
                break;
            }
    }

    function PlayIndex(Index) {
        MusicPlayer.src = MusicList.children[Index].value;
        MusicPlayer.title = MusicList.children[Index].innerHTML;
        MusicList.children[Index].selected = true;

        console.log("ChangeMusic : " + MusicPlayer.title);

        if (IsPlaying()) {

            // console.log("MusicLength : " + MusicList.children.length);
            // console.log("Index : " + Index);
            // console.log("New Music : " + MusicList.children[Index].value);

            MusicPlayer.onloadeddata = this.PlayMusic; //等歌曲載入完畢後再播放音樂
        }
        else {
            console.log("未播放中");
        }
    }




    // var Index = MusicList.selectedIndex;

    // if ((n == -1 && Index > 0) || n == 1 && Index < MusicList.length - 1) {
    //     MusicPlayer.src = MusicList.children[Index + n].value; //更改音樂來源
    //     MusicPlayer.title = MusicList.children[Index + n].innerText;

    //     MusicList.children[Index + n].selected = true;
    //     //console.log(event.target.children[a].innerText);


    //     console.log("Play " + MusicList.children[Index + n].innerText);

    //     if (btnPlay.innerText == ";") {
    //         MusicPlayer.onloadeddata = PlayMusic; //等歌曲載入完畢後再播放音樂
    //     }
    // }
    // else {
    //     console.log("MusicList到底");
    // }
}


function PlayMusic() {
    MusicPlayer.play();
    SetPlayPauseButton(0);
    PlayPauseButton.onclick = PauseMusic;

    ProgressInit();//初始化進度條

    UpdateInfo("目前播放 : " + MusicPlayer.title);
}
function PauseMusic() {
    MusicPlayer.pause();
    SetPlayPauseButton(1);
    PlayPauseButton.onclick = PlayMusic;
    //playStatus.innerHTML = "音樂暫停...";
    UpdateInfo("音樂暫停");
}
function StopMusic() {
    //console.log("StopMusic");

    MusicPlayer.pause();
    MusicPlayer.currentTime = 0; //將音樂播放時間歸零
    PlayPauseButton.innerHTML = "4"; //更改按鈕顯示為播放
    PlayPauseButton.onclick = PlayMusic;

    UpdateInfo("音樂停止");
}

//更新播放資訊
function UpdateInfo(Msg) {
    console.log("UpdateInfo : " + Msg);

    InfoText.innerHTML = Msg;
}


//進度條初始化
function ProgressInit() {
    setInterval(SetMusicTime, 10);
    ProgressBar.max = MusicPlayer.duration; //設置進度條的最大值為音樂的總時長
}
function ProgressUpdate() {

}