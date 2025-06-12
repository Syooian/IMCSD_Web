const LoopModeEnum = {
    None: 0,//不循環
    Single: 1,//單曲循環
    Random: 2,//全部隨機撥放
    All: 3//全部循環
}

//循環模式======================================================
var LoopMode = LoopModeEnum.None;
var LoopStatus = document.getElementById("LoopStatus");;

function SetLoopMode() {
    if (LoopMode + 1 > LoopModeEnum.All) {
        LoopMode = LoopModeEnum.None;
    }
    else {
        LoopMode++;
    }

    //console.log("LoopMode : " + LoopMode);

    LoopStatus.innerHTML = GetLoopModeStr();
}

function GetLoopModeStr() {
    switch (LoopMode) {
        case LoopModeEnum.None://不循環
            return "不循環";
        case LoopModeEnum.Single://單曲重複
            return "單曲重複";
        case LoopModeEnum.Random://隨機播放
            return "隨機播放";
        case LoopModeEnum.All://全部循環
            return "全部循環";
    }
}
//循環模式======================================================

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

    MusicPlayer.currentTime = ProgressBar.value / ProgressBarScale; //設置音樂的當前播放時間為進度條的值
};

var ProgressBarOnDrag = false; //是否正在拖動進度條

MusicPlayer.onended = () => {
    console.log("音樂播放結束");

    var NewIndex = ChangeMusic(1);

    if (NewIndex == -1)
        StopMusic();
};

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
    if (MusicPlayer.volume == 0) {
        VolumeChange(VolumeValue * 100); //恢復音量
        event.target.innerHTML = "U"; //移除靜音樣式
        event.target.className = "";
    } else {
        VolumeValue = MusicPlayer.volume; //記錄當前音量
        VolumeChange(0); //設置音量為0
        event.target.innerHTML = "V"; //添加靜音樣式
        event.target.className = "Muted";
    }
}

//--------------------------------------------------音量
//音量原始數值 (0~1)
var VolumeValue;

var VolumeControl = document.getElementById("VolumeControl");
//音量變更 (Volume：0~100)
function VolumeChange(Volume) {
    //console.log(Volume);

    MusicPlayer.volume = Volume / 100;

    //document.getElementById("VolumeText").value = Volume;
    VolumeControl.children[1].value = Volume; //更新音量值的文字顯示

    //動態調整音量拉條的背景色
    VolumeControl.children[0].style.backgroundImage = `linear-gradient(to right, #f06 ${Volume}%, #4a90e2 ${Volume}%)`;
    //background-image: linear-gradient(to right, #f06 , #4a90e2);
}

VolumeChange(100);
//---------------------------------------------------音量

//音樂的秒數轉換成進度條的最大值（細分度），讓進度條更精細。
var ProgressBarScale = 10000;

var MusicTime = document.getElementById("MusicTime");
var InfoText = document.getElementById("InfoText");
function SetMusicTime() {
    //MusicTime.innerHTML="ASDASD";

    //console.log("IsPlaying : "+IsPlaying());

    MusicTime.innerHTML = GetTimeFormat(MusicPlayer.currentTime) + "/" + GetTimeFormat(MusicPlayer.duration);
    //console.log(1);

    if (!ProgressBarOnDrag) {
        //console.log("SetProgressBar " + MusicPlayer.currentTime);
        ProgressBar.value = MusicPlayer.currentTime * ProgressBarScale; //更新進度條的值

        //進度條填色
        var W = MusicPlayer.currentTime / MusicPlayer.duration * 100;
        //console.log(MusicPlayer.duration + ", " + MusicPlayer.currentTime + ", Percent : " + W);
        ProgressBar.style.backgroundImage = `linear-gradient(to right, #f06 ${W}%, #4a90e2 ${W}%)`;
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
        return MusicList.selectedIndex;
    }

    //當前播放曲目
    var Index = MusicList.selectedIndex;

    switch (LoopMode) {
        case LoopModeEnum.Single://單曲重複
            {
                PlayIndex(Index); //播放音樂
                return Index;
            }
        case LoopModeEnum.None://不循環
            {
                if ((n == -1 && Index > 0) || n == 1 && Index < MusicList.length - 1) {
                    var NewIndex = Index + n;

                    PlayIndex(Index + n);

                    return NewIndex;
                }
                else {
                    console.log("MusicList位於第一首或最後一首，且循環模式為'不循環'");

                    return -1;
                }
            }
        case LoopModeEnum.All://全部循環
            {
                if (n == -1 && Index == 0) {
                    //位在第一首且要播放上一首，跳至最後一首
                    var NewIndex = MusicList.length - 1;

                    PlayIndex(NewIndex);
                    return NewIndex;
                }
                else if (n == 1 && Index == MusicList.length - 1) {
                    //位在最後一首且要播放下一首，跳至第一首
                    var NewIndex = 0;

                    PlayIndex(NewIndex);
                    return NewIndex;
                }
                else {
                    //正常播放下一首或上一首
                    var NewIndex = Index + n;

                    PlayIndex(NewIndex);
                    return NewIndex;
                }
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
                return RandomIndex;
            }
    }

    function PlayIndex(Index) {
        MusicPlayer.src = MusicList.children[Index].value;
        MusicPlayer.title = MusicList.children[Index].innerHTML;
        MusicList.children[Index].selected = true;

        console.log("ChangeMusic Index : " + Index + ", : " + MusicPlayer.title);

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

    ProgressStop();
}
function StopMusic() {
    //console.log("StopMusic");

    MusicPlayer.pause();
    MusicPlayer.currentTime = 0; //將音樂播放時間歸零
    PlayPauseButton.innerHTML = "4"; //更改按鈕顯示為播放
    PlayPauseButton.onclick = PlayMusic;

    UpdateInfo("音樂停止");

    ProgressStop();
}

//更新播放資訊
function UpdateInfo(Msg) {
    console.log("UpdateInfo : " + Msg);

    InfoText.innerHTML = Msg;
}


//進度條初始化
function ProgressInit() {
    ProgressBar.max = MusicPlayer.duration * ProgressBarScale; //設置進度條的最大值為音樂的總時長
    setInterval(SetMusicTime, 10);
}
//停止進度條
function ProgressStop() {
    try {
        clearInterval(SetMusicTime);
    }
    catch {

    }
}
function ProgressUpdate() {

}