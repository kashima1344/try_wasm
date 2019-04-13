sharedBuffer

var sharedBuffer = null;
var filteredImageData = null;
var ptr = null;

function doFilter() {

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
    filter(ptr, width, height);

    // フィルタ処理後の画像をコピー
    ctx.putImageData(filteredImageData, 0, 0);

}
