// AudioContextをグローバル変数として宣言
var context = new AudioContext();
let secBeep = false;
let minBeep = false;

// 音を生成する関数
function beep(frequency, duration) {
  var oscillator = context.createOscillator();
  var gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration / 1000);
}

// 時刻に応じて音を鳴らす関数
function alarm() {
  // dateオブジェクトを毎回新しく作成
  var date = new Date(); // 現在の時刻を取得
  var hour = date.getHours(); // 時間
  var minute = date.getMinutes(); // 分
  var second = date.getSeconds(); // 秒
  console.log(hour + ":" + minute + ":" + second); // 時刻を表示
  if (minute == 0 && second == 0) {
    // 毎正時にピーと鳴らす
    beep(880, 2000);
  } else if (minute % 15 == 0 && second == 0) {
    // 15分ごとにピピッと鳴らす
    beep(880, 125);
    setTimeout(function () {
      beep(880, 125);
    }, 150);
  } else if (minute % 5 == 0 && second == 0) {
    // 5分ごとにピッと鳴らす
    beep(880*2, 300);
    setTimeout(function () {
      beep(880*2, 125);
    }, 350);
  }else if(second == 0 && minBeep){
    //minBeepがtrueの場合、1分ごとにピッと鳴らす
    beep(880*2,300);
  }else if(secBeep){
    //secBeepがtrueの場合、1秒ごとにピッと鳴らす
    beep(880*2,30);
  }
}

// ページのタイトルを「時報アプリ」に変更する
document.title = "時報アプリ";

// 自己同期型のタイマーを作る関数
function createTimer(callback, interval) {
    var expected = Date.now() + interval; // 目標の時刻
    var timeout; // タイムアウトID

    function tick() {
        callback(); // コールバック関数を呼び出す
        var delta = Date.now() - expected; // 現在の時刻と目標の時刻との差分
        expected += interval; // 次の目標の時刻を更新する
        timeout = setTimeout(tick, Math.max(0, interval - delta)); // 次のタイマーの発火時間を調整する
    }

    timeout = setTimeout(tick, interval); // 最初のタイマーをセットする

    return {
        stop: function() { clearTimeout(timeout); } // タイマーを停止するメソッド
    };
}

// createTimerでalarm関数を1秒ごとに呼び出す
var timer = createTimer(alarm, 1000);

// ボタンを作成する関数
function createButton(text, onclick) {
  // button要素を作成
  var button = document.createElement("button");
  // テキストを設定
  button.innerText = text;
  // クリックイベントに関数を登録
  button.addEventListener("click", onclick);
  // ボタンを返す
  return button;
}

// minBeepをトグルする関数
function toggleMinBeep() {
  // minBeepの値を反転
  minBeep = !minBeep;
  // コンソールに結果を表示
  console.log("minBeep is " + minBeep);
}

// secBeepをトグルする関数
function toggleSecBeep() {
  // secBeepの値を反転
  secBeep = !secBeep;
  // コンソールに結果を表示
  console.log("secBeep is " + secBeep);
}

// minBeepをトグルするボタンを作成
var minButton = createButton("Toggle minBeep", toggleMinBeep);
// secBeepをトグルするボタンを作成
var secButton = createButton("Toggle secBeep", toggleSecBeep);

// body要素にボタンを追加
document.body.appendChild(minButton);
document.body.appendChild(secButton);