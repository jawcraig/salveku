/**
 * image.js
 * Image-recognizing tools for salveku
 */


// var myT = // [scaleX, skewX, skewY, scaleY, moveX, moveY];
var myT = [1, 0, 0, 1, 0, 0];
var myW = 100;
var myH = 100;

function drawTransformed(context, img, t) {
    context.save();
    context.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
    context.drawImage(img, 0, 0, myW, myH);
    context.restore();
}

function invert(data, threshold, max) {
    var len = data.length;

    for (var i = 0; i < len; ++i) {
        data[i] = max - data[i];
        if (data[i] < threshold) {
            data[i] = 0.0;
        }
    }

    return data;
}

/**
 * Turn image to grays on black background
 */
function toBW(data) {
    var avg = 0;
    var threshold = 0.5;
    buckets = [];

    var len = data.length;
    var result = new Array(len / 4);
    for (i = 0; i < len; i += 4) {
        var illuminance = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11

        avg += illuminance;
        result[i / 4] = illuminance;
    }

    console.log(avg);
    data = result;

    if (avg < data.length / 2) {
        // More white than black -> invert
        data = invert(result, threshold, 1.0);
    }

    return data;
}


/**
 * Hough transform to find straigth lines
 */
function hough(input, threshold = 0.5) {
    var width = input.width;
    var height = input.height;
    var rMax = Math.sqrt(width * width / 4 + height * height / 4);

    var result = new Array(input.length);

    for (var x = 0; x < width; ++x) {
        for (var y = 0; y < height; ++y) {
            var index = x * height + y;
            var color = input[index];

            if (color > threshold) {
                for (var t = 0; t < 360; ++t) {
                    var theta = Math.toRadians(t);
                    var r = (x - width / 2) * Math.cos(t) + (y - height / 2) * Math.sin(theta);
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

    return result;
}

/**
 * Draw array from data(w, h) to x,y on canvas 
 */
function drawArray(context, data, x, y, w, h) {
    var imgdata = context.createImageData(w, h);
    var len = data.length;

    for (var i = 0; i < len; ++i) {
        imgdata[4 * i] = data[i];
        imgdata[4 * i + 1] = data[i];
        imgdata[4 * i + 2] = data[i];
        imgdata[4 * i + 3] = 10;
    }

    context.putImageData(imgdata, x, y);
}

/**
 * Drop resolution to something more manageable
 */
function scaleDown(data) {
    return data;
}

/**
 * Preprocess the image for easier number recognition
 */
function preprocess(context) {
    var data = context.getImageData(0, 0, myW, myH).data;

    var bw = toBW(data);
    drawArray(context, bw, 2 * myW, myH, myW, myH);
    console.log("pew 6!");
    // Scale down to remove noise
    var scaledDown = scaleDown(bw);
    drawArray(context, scaledDown, myW, 2 * myH, myW, myH);
    console.log("pew 7!");

    var houghed = hough(scaledDown);
    drawArray(context, houghed, 2 * myW, 2 * myH, myW, myH);
    console.log("pew 8!");

    // max(x) -> rotation
    // rotate ->
    // first peak(0, y) -> top
    // last peak(0, y) -> bottom
    // first peak(90, y) -> left
    // last peak (90, y) -> right

    // Filter away everything not black for the numbers
    console.log("pew 9!");
    return data;
}

function drawResult(img, ctx) {
    myCanvas.width = img.width;
    myCanvas.height = img.height;
    console.log('pew 4!');
    ctx.drawImage(img, 0, 0);
};