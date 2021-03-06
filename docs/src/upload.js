// I referred the following blog. Thank you!
// https://favril.hatenablog.com/entry/20100506/1273143063
// https://tech-blog.s-yoshiki.com/2018/01/10/
function preview(ele) {
    if (!ele.files.length) return;  // ファイル未選択

    var file = ele.files[0];
    if (!/^image\/(png|jpeg|gif)$/.test(file.type)) return;  // typeプロパティでMIMEタイプを参照

    // 画像名・MIMEタイプ・ファイルサイズ
    document.getElementById('preview_field').textContent =
        'file name: ' + file.name + ', ' +
        'file type: ' + file.type + ', ' +
        'file size: ' + file.size ;

    var fr = new FileReader();
    fr.onload = function() {
        var canvas = document.getElementById("canvas1");
        var ctx = canvas.getContext("2d");
        var img = new Image();
        img.onload = function () {
            drawImageKeepAspect(ctx, img);
        }
        img.src = fr.result;  // 読み込んだ画像データをsrcにセット
    }
    fr.readAsDataURL(file);  // 画像読み込み

}

// I referred the following blog. Thank you!
// https://qiita.com/PG0721/items/599ba2921b8339700fe3
function drawImageKeepAspect(ctx, img) {

    var canvasAspect = ctx.canvas.width / ctx.canvas.height;    // canvasのアスペクト比
    var imgAspect = img.width / img.height;     // 画像のアスペクト比
    var left, top, width, height;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if(imgAspect >= canvasAspect) {// 画像が横長
        left = 0;
        width = ctx.canvas.width;
        height = ctx.canvas.width / imgAspect;
        top = (ctx.canvas.height - height) / 2;
    } else {// 画像が縦長
        top = 0;
        height = ctx.canvas.height;
        width = ctx.canvas.height * imgAspect;
        left = (ctx.canvas.width - width) / 2;
    }
    ctx.drawImage(img,
        0, 0, img.width, img.height,
        left, top, width, height);
}
