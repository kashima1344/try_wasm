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
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = fr.result;  // 読み込んだ画像データをsrcにセット
    }
    fr.readAsDataURL(file);  // 画像読み込み

}

