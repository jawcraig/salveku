/**
 * salveku.js
 * Image-recognizing sudoku solver
 */

var myInput = document.getElementById('drop-image');
var myCanvas = document.getElementById('image-result');
var myContext = myCanvas.getContext('2d');
var myImage = new Image();

function imageLoaded() {
    drawResult(myImage, myContext);
    preprocess(myContext);
}

function salveku(event) {
    console.log('pew 1!');

    var target = event.target || window.event.srcElement
    files = target.files, file = null;

    if (files && files.length) {
        file = files[0];
        document.getElementById('temp-img').src = URL.createObjectURL(file);

        if (FileReader) {
            var reader = new FileReader();

            reader.onload = function(e) {
                myImage.onload = imageLoaded;
                myImage.src = e.target.result;
                console.log('pew 3!');
            };

            reader.readAsDataURL(files[0]);
        } else {
            console.log('No pie two.');
        }
        console.log('pew 2!');
    } else {
        console.log('No pie.');
        document.getElementById('image-container').setText('Sorry, unsupported platform.');
    }
}

myInput.addEventListener('change', salveku, false);