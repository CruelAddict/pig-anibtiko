function waitForEl(selector, callback) {
    if (jQuery(selector).length) {
        return new Promise((resolve, reject) => {resolve(callback())});
    } else {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(waitForEl(selector, callback));
            }, 100);
        });
    }
}

function getQuoteText() {
    return new Promise((resolve, reject) => {resolve($('div article div div').html())} );
}



function onImagesLoad(quote, canv){
    console.log(quote);
    ctx=canv.getContext('2d');

    var amount=0.7;
    ctx.globalCompositeOperation = "saturation";
    // ctx.fillStyle = "hsl(0," + Math.floor(amount) + "%,50%";
    ctx.fillStyle = "#000";
    ctx.globalAlpha = amount;

    ctx.fillRect(0,0,1080,720);

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    ctx.font = "bold 30px verdana";
    ctx.fillStyle="white";
    ctx.textAlign="center";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 4;

    quote = quote.replace(/&lt;/g, "<");
    quote = quote.replace(/&gt;/g, ">");

    var lines= quote.split("<br>");
    var maxDesiredWidth=950;

    function divideLine(line){
        lineOne = line.split(" "),
            lineTwo = [];
        while (ctx.measureText(lineOne).width > maxDesiredWidth) {
            lineTwo.push(lineOne.pop());
        }
        lineTwo.reverse();
        lineOneString = lineOne.join(" ");
        lineTwoString = lineTwo.join(" ");

        return [lineOneString, lineTwoString];
    }

    var finalLines = [];

    for(var line in lines){
        if(ctx.measureText(lines[line]).width > maxDesiredWidth) {
            var currentLines=divideLine(lines[line]);
            var counter=1;
            var localLines=[];
            while(counter>=0){
                if(ctx.measureText(currentLines[counter]).width>maxDesiredWidth){
                    localLines = divideLine(currentLines[counter]);
                    currentLines.pop();
                    currentLines.push(localLines[0]);
                    currentLines.push(localLines[1]);
                    counter++;
                } else {counter--;}
            }
            for(var currLine in currentLines){
                finalLines.push(currentLines[currLine]);
                // ctx.fillText(currentLines[currLine], 540, topMargin);
                // topMargin+=40;

            }
        }else {
            finalLines.push(lines[line])
            // ctx.fillText(lines[line], 540, topMargin);
            // topMargin += 40;
        }
    }


    var verticalSize = 40*finalLines.length;
    var topMargin = 360-verticalSize/2+20;
    if(verticalSize > 720){
        ctx.font = "bold 15px verdana";
        topMargin = 20;
    }
    for(var line in finalLines){
        ctx.fillText(finalLines[line], 540, topMargin);
        topMargin += 40;
    }

    var canWrapper=document.createElement('div');
    canWrapper.style.width='100%';
    canWrapper.style.display='flex';
    canWrapper.style.justifyContent='center';
    canWrapper.appendChild(canv);
    document.body.appendChild(canWrapper);
}

function drawBackgroundImage(x, y, src, canv, quote) {
    ctx=canv.getContext('2d');
    var backImage = new Image();
    backImage.src = src;
    backImage.onload = function() {
        backImage.style.filter= "brightness(0.1)";
        if (backImage.height < 360) {
            backImage.height = backImage.height * (360 / backImage.height);
            backImage.width = backImage.width* (360 / backImage.height);
        }
        if (backImage.width < 540) {
            backImage.width = backImage.width * (540 / backImage.width);
            backImage.height = backImage.height* (540 / backImage.width);
        }
        ctx.drawImage(backImage, ((backImage.width * 0.5) - 270), ((backImage.height * 0.5) - 180), 540, 360, x, y, 540, 360);
        imagecounter++;
        if(imagecounter >= 4){
            onImagesLoad(quote, canv);
        }
    };
}

var sources = ['https://source.unsplash.com/collection/1242250',
    'https://source.unsplash.com/collection/4117184',
    'https://source.unsplash.com/collection/3378453',
    'https://source.unsplash.com/collection/2237487'
];
var x = [0, 540, 0, 540];
var y = [0, 0, 360, 360];
var imagecounter=0;

function drawQuote(quote){
    var canv=document.createElement('canvas');
    canv.width="1080";
    canv.height="720";
    canv.style.margin="0 auto";
    for (var counter =0; counter < 4; counter++){
        drawBackgroundImage(x[counter], y[counter], sources[counter], canv, quote);
    }
}

document.addEventListener("DOMContentLoaded", getQuote);
function getQuote() {
    var wrapper=document.createElement('div'), bashOrgContent=document.createElement('script');
    wrapper.style.display='none';
    bashOrgContent.type='text/javascript';
    bashOrgContent.src='https://bash.im/forweb/?u';
    wrapper.appendChild(bashOrgContent);
    document.body.appendChild(wrapper);
    waitForEl('div article div div', getQuoteText)
        .then(
            result => {
                drawQuote(result);
                $('div').remove();
            }
        )
}

