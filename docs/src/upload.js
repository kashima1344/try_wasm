// I referred the following blog. Thank you!
// https://favril.hatenablog.com/entry/20100506/1273143063
function preview(ele) {
    if (!ele.files.length) return;  // ファイル未選択
    
    var file = ele.files[0];
    if (!/^image\/(png|jpeg|gif)$/.test(file.type)) return;  // typeプロパティでMIMEタイプを参照

    // 画像名・MIMEタイプ・ファイルサイズ
    document.getElementById('preview_field').textContent =
        'file name: ' + file.name + ', ' +
        'file type: ' + file.type + ', ' +
        'file size: ' + file.size ;

    var ctx = document.getElementById("canvas1").getContext("2d");
    var img = new Image();
    img.src = file + "#" + new Date().getTime();

    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    }
}

