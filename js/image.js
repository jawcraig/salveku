/**
 * image.js
 * Image-recognizing tools for salveku
 */


// var myT = // [scaleX, skewX, skewY, scaleY, moveX, moveY];
var myT = [1, 0, 0, 1, 0, 0];
var myW = 100;
var myH = 100;

function drawTransformed(img, t) {
    myContext.save();
    myContext.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
    myContext.drawImage(img, 0, 0, myW, myH);
    myContext.restore();
}

function invert(data, max) {
    var len = data.length;
    for (var i = 0; i < len; ++i) {
        data[i] = max - data[i];
    }

    return data;
}

/**
 * Turn image to grays on black background
 */
function toBW(data) {
    var result = new Array();
    var avg = 0;
    var threshold = 0.5;
    buckets = [];
    var illuminance = r * 0.3 + g * 0.59 + b * 0.11
    avg += illuminance;
    if (illuminance < threshold)

        if (avg < ((width * height) / 2)) {
            // More white than black -> invert
            data = invert(data, 1.0);
        }

    return data;
}


/**
 * Hough transform to find straigth lines
 */
function hough(input, result, threshold = 0.5) {
    var width = input.width;
    var height = input.height;
    var rMax = Math.sqrt(width * width / 4 + height * height / 4);

    for (var x = 0; x < width; ++x) {
        for (var y = 0; y < height; ++y) {
            var index = x * height + y;
            var color = input[index];

            if (color > threshold) {
                for (var t = 0; t < 360; ++t) {
                    var theta = Math.toRadians(t);
                    r = (x - width / 2) * Math.cos(t) + (y - height / 2) * Math.sin(theta);
                    r = rMax - r;

                    if ((r >= 0) && (r <= rMax)) {
                        // result.setPixel(t, r, result.getPixel(t, r) + 1); // add vote
                        index = t * height + r;
                        result[index] = result[index] + 1;
                    }
                }
            }
        }
    }
}

/**
 * Draw array from data(w, h) to x,y on canvas 
 */
function drawArray(data, x, y, w, h) {
    var imgdata = myContext.createImageData(w, h);
    var len = data.length;

    for (var i = 0; i < len; ++i) {
        imgdata[4 * i] = data[i];
        imgdata[4 * i + 1] = data[i];
        imgdata[4 * i + 2] = data[i];
        imgdata[4 * i + 3] = 255;
    }

    myContext.putImageData(imgdata, x, y);
}

/**
 * Preprocess the image for easier number recognition
 */
function preprocess() {
    var data = myContext.getImageData(0, 0, myW, myH).data;

    var bw = toBW(data);
    drawArray(bw, 2 * myW, myH, myW, myH);

    // Scale down to remove noise
    var scaledDown = scaleDown(bw);
    drawArray(bw, myW, 2 * myH, myW, myH);

    var houghed = hough(data);
    drawArray(houghed, 2 * myW, 2 * myH, myW, myH);

    // max(x) -> rotation
    // rotate ->
    // first peak(0, y) -> top
    // last peak(0, y) -> bottom
    // first peak(90, y) -> left
    // last peak (90, y) -> right

    // Filter away everything not black for the numbers
}

function drawResult(img, ctx) {
    myCanvas.width = img.width;
    myCanvas.height = img.height;
    console.log('pew 4!');
    ctx.drawImage(img, 0, 0);
};