// 音源用のAudioContextを作成
const audioCtx = new AudioContext();

// 入力欄のHTML要素をJavaScriptから動的に生成する関数
function createInput() {
  // div要素を作成
  const div = document.createElement("div");
  // 入力欄とボタンを作成
  const input = document.createElement("input");
  const button = document.createElement("button");
  // 入力欄の属性を設定
  input.type = "number";
  input.id = "input";
  input.placeholder = "基準とする数を入力";
  // ボタンのテキストを設定
  button.textContent = "決定";
  button.id = "button";
  
   // 入力確定ボタンがクリックされたときの処理
   button.addEventListener("click", function () {
    // 入力された数値を取得
    const n = Number(input.value);
    
    // 数値が正であれば処理を続行
    if (n > 0) {
      // 鍵盤のコンテナを空にする
      keyboard.innerHTML = "";
      
      // n平均律での周波数を計算する関数
      function calcFreq(i) {
        // iは音階のインデックス（0からn-1）
        // 基準とする音（A）からの半音数を求める
        const diff = i - (0 - n * Math.floor(0 / n));
        // 基準とする音の周波数（440Hz）にn乗根2のdiff乗をかける
        return Math.pow(2, diff / n) * 440;
      }
      
      // 鍵盤のボタンを生成する関数
      function createKey(i, octave) {
        // iは音階のインデックス（0からn-1）
        // octaveはオクターヴ（-1から1）
        // div要素を作成
        const key = document.createElement("div");
        // 音階の名前とn平均律での周波数を表示
        // 音階の名前はアルファベットで表す（Aから順に）
        key.innerHTML = `<span style="font-size:14px">${String.fromCharCode(65 + i)}</span><br><span style="font-size:10px">${(calcFreq(i) * Math.pow(2, octave)).toFixed(2)}</span>`; // HTMLで改行とフォントサイズを設定
        // スタイルを設定
        key.style.display = "inline-block";
        key.style.width = "50px";
        key.style.height = "100px";
        key.style.border = "1px solid black";
        key.style.textAlign = "center";
        key.style.verticalAlign = "top";
        key.style.cursor = "pointer";
        
        // ボタンがクリックされたときの処理
        key.addEventListener("click", function () {
          // 音源用のOscillatorNodeを作成
          const osc = audioCtx.createOscillator();
          // n平均律での周波数を設定（オクターヴ分ずらす）
          osc.frequency.value = calcFreq(i) * Math.pow(2, octave);
          // 音量用のGainNodeを作成
          const gain = audioCtx.createGain();
          // 音量を0.1に設定
          gain.gain.value = 0.1;
          // OscillatorNodeとGainNodeを接続
          osc.connect(gain);
          // GainNodeとAudioContextの出力を接続
          gain.connect(audioCtx.destination);
          // OscillatorNodeを再生
          osc.start();
          // 0.5秒後に停止
          osc.stop(audioCtx.currentTime + 0.5);
        });
        // 鍵盤のコンテナにボタンを追加
        keyboard.appendChild(key);
      }
      
      // ±1オクターヴ分のボタンを生成（n個ずつ）
      for (let octave = -1; octave <= 1; octave++) {
        for (let i = 0; i < n; i++) {
          // 音階のインデックスを求める（0からn-1の範囲にする）
          const index = ((i % n) + n) % n;
          // ボタンを生成
          createKey(index, octave);
        }
        // 改行用のbr要素を作成
        const br = document.createElement("br");
        // 鍵盤のコンテナにbr要素を追加
        keyboard.appendChild(br);
      }
    } else {
      // 数値が正でなければエラーメッセージを表示
      alert("正の数値を入力してください。");
    }
  });
  
  // div要素に入力欄とボタンを追加
  div.appendChild(input);
  div.appendChild(button);
  
  // body要素にdiv要素を追加
  document.body.appendChild(div);
}

// 鍵盤のコンテナ用のdiv要素を作成
const keyboard = document.createElement("div");
keyboard.id = "keyboard";

// body要素に鍵盤のコンテナ用のdiv要素を追加
document.body.appendChild(keyboard);

// 入力欄のHTML要素を生成する関数を呼び出す
createInput();
