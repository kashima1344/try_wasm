
var sharedBuffer = null;
var filteredImageData = null;
var ptr = null;

function doFilter() {
    performance.clearMeasures();
    performance.mark("wasm_start");

    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;

    if (sharedBuffer == null) {

        var byteSize = width * height * 4; // canvas memory size
        ptr = alloc(byteSize); // pointer of memory

         // wasm側バッファ上の配列を参照
        sharedBuffer = new Uint8ClampedArray(wasm_bindgen.wasm.memory.buffer, ptr, byteSize);

        // フィルター加工後のimageData
        filteredImageData = new ImageData(sharedBuffer, width, height);
    }

    var currentImage = ctx.getImageData(0, 0, width, height);

    // 共有バッファにコピー
    sharedBuffer.set(currentImage.data);

    // フィルタを処理
    performance.mark("wasm_start2");
    filter(ptr, width, height);
    performance.mark("wasm_end2");

    // フィルタ処理後の画像をコピー
    ctx.putImageData(filteredImageData, 0, 0);

    performance.mark("wasm_end");

    performance.measure("wasm", "wasm_start", "wasm_end");
    result = performance.getEntriesByName('wasm');
    performance.measure("wasm2", "wasm_start2", "wasm_end2");
    result2 = performance.getEntriesByName('wasm2');

    document.getElementById('result_wasm').textContent = "success: " + result[0].duration + "(ms); "
        + result2[0].duration + "(ms)";
}

const COLOR_SUM = 765.0;
const SEPIA_R = 240.0;
const SEPIA_G = 200.0;
const SEPIA_B = 118.0;

function doFilterJS() {
    performance.clearMeasures();
    performance.mark("js_start");

    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;

    var currentImage = ctx.getImageData(0, 0, width, height);

    performance.mark("js_start2");

    var data = currentImage.data;
    var num = data.length / 4;

    for (var i=0; i<num; i++) {
        var p = i * 4;
        var r = data[p];
        var g = data[p + 1];
        var b = data[p + 2];
        var avg = (r + g + b) / COLOR_SUM;
        data[p] = (SEPIA_R * avg);
        data[p + 1] = (SEPIA_G * avg);
        data[p + 2] = (SEPIA_B * avg);
    }

    performance.mark("js_end2");

    // フィルタ処理後の画像をコピー
    ctx.putImageData(currentImage, 0, 0);

    performance.mark("js_end");

    performance.measure("js", "js_start", "js_end");
    result = performance.getEntriesByName('js');
    performance.measure("js2", "js_start2", "js_end2");
    result2 = performance.getEntriesByName('js2');

    document.getElementById('result_js').textContent = "success:" + result[0].duration + "(ms); "
        + result2[0].duration + "(ms)";

}
