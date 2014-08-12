(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*

StackBlur - a fast almost Gaussian Blur For Canvas

Version:    0.5
Author:     Mario Klingemann
Contact:    mario@quasimondo.com
Website:    http://www.quasimondo.com/StackBlurForCanvas
Twitter:    @quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr: 
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
        
   
var shg_table = [
         9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
        17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
        19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
        23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

// function stackBlurCanvasRGBA( id, top_x, top_y, width, height, radius )
function gBlur(imageData, radius)
{
    var radius = radius || 30 
    var pixels = imageData.data;
    var top_x = 0;
    var top_y = 0;
    var width = imageData.width;
    var height = imageData.height;
            
    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
    r_out_sum, g_out_sum, b_out_sum, a_out_sum,
    r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
    pr, pg, pb, pa, rbs;
            
    var div = radius + radius + 1;
    var w4 = width << 2;
    var widthMinus1  = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1  = radius + 1;
    var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
    
    var stackStart = new BlurStack();
    var stack = stackStart;
    for ( i = 1; i < div; i++ )
    {
        stack = stack.next = new BlurStack();
        if ( i == radiusPlus1 ) var stackEnd = stack;
    }
    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;
    
    yw = yi = 0;
    
    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];
    
    for ( y = 0; y < height; y++ )
    {
        r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
        
        r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
        g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
        b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
        a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );
        
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        
        stack = stackStart;
        
        for( i = 0; i < radiusPlus1; i++ )
        {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        
        for( i = 1; i < radiusPlus1; i++ )
        {
            p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
            r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
            g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
            b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
            a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;
            
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            
            stack = stack.next;
        }
        
        
        stackIn = stackStart;
        stackOut = stackEnd;
        for ( x = 0; x < width; x++ )
        {
            pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
            if ( pa != 0 )
            {
                pa = 255 / pa;
                pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
            } else {
                pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
            }
            
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            
            p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
            
            r_in_sum += ( stackIn.r = pixels[p]);
            g_in_sum += ( stackIn.g = pixels[p+1]);
            b_in_sum += ( stackIn.b = pixels[p+2]);
            a_in_sum += ( stackIn.a = pixels[p+3]);
            
            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;
            a_sum += a_in_sum;
            
            stackIn = stackIn.next;
            
            r_out_sum += ( pr = stackOut.r );
            g_out_sum += ( pg = stackOut.g );
            b_out_sum += ( pb = stackOut.b );
            a_out_sum += ( pa = stackOut.a );
            
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            
            stackOut = stackOut.next;

            yi += 4;
        }
        yw += width;
    }

    
    for ( x = 0; x < width; x++ )
    {
        g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
        
        yi = x << 2;
        r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
        g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
        a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);
        
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        
        stack = stackStart;
        
        for( i = 0; i < radiusPlus1; i++ )
        {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        
        yp = width;
        
        for( i = 1; i <= radius; i++ )
        {
            yi = ( yp + x ) << 2;
            
            r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
            g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
            b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
            a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;
           
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            
            stack = stack.next;
        
            if( i < heightMinus1 )
            {
                yp += width;
            }
        }
        
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for ( y = 0; y < height; y++ )
        {
            p = yi << 2;
            pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
            if ( pa > 0 )
            {
                pa = 255 / pa;
                pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
                pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
                pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
            } else {
                pixels[p] = pixels[p+1] = pixels[p+2] = 0;
            }
            
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
           
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            
            p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
            
            r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
            g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
            b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
            a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));
           
            stackIn = stackIn.next;
            
            r_out_sum += ( pr = stackOut.r );
            g_out_sum += ( pg = stackOut.g );
            b_out_sum += ( pb = stackOut.b );
            a_out_sum += ( pa = stackOut.a );
            
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            
            stackOut = stackOut.next;
            
            yi += width;
        }
    }
    
    return imageData;
}


function stackBlurCanvasRGB( id, top_x, top_y, width, height, radius )
{
    if ( isNaN(radius) || radius < 1 ) return;
    radius |= 0;
    
    var canvas  = document.getElementById( id );
    var context = canvas.getContext("2d");
    var imageData;
    
    try {
      try {
        imageData = context.getImageData( top_x, top_y, width, height );
      } catch(e) {
      
        // NOTE: this part is supposedly only needed if you want to work with local files
        // so it might be okay to remove the whole try/catch block and just use
        // imageData = context.getImageData( top_x, top_y, width, height );
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
            imageData = context.getImageData( top_x, top_y, width, height );
        } catch(e) {
            alert("Cannot access local image");
            throw new Error("unable to access local image data: " + e);
            return;
        }
      }
    } catch(e) {
      alert("Cannot access image");
      throw new Error("unable to access image data: " + e);
    }
            
    var pixels = imageData.data;
            
    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
    r_out_sum, g_out_sum, b_out_sum,
    r_in_sum, g_in_sum, b_in_sum,
    pr, pg, pb, rbs;
            
    var div = radius + radius + 1;
    var w4 = width << 2;
    var widthMinus1  = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1  = radius + 1;
    var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
    
    var stackStart = new BlurStack();
    var stack = stackStart;
    for ( i = 1; i < div; i++ )
    {
        stack = stack.next = new BlurStack();
        if ( i == radiusPlus1 ) var stackEnd = stack;
    }
    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;
    
    yw = yi = 0;
    
    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];
    
    for ( y = 0; y < height; y++ )
    {
        r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
        
        r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
        g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
        b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
        
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        
        stack = stackStart;
        
        for( i = 0; i < radiusPlus1; i++ )
        {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.next;
        }
        
        for( i = 1; i < radiusPlus1; i++ )
        {
            p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
            r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
            g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
            b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
            
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            
            stack = stack.next;
        }
        
        
        stackIn = stackStart;
        stackOut = stackEnd;
        for ( x = 0; x < width; x++ )
        {
            pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
            pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
            pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
            
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            
            p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
            
            r_in_sum += ( stackIn.r = pixels[p]);
            g_in_sum += ( stackIn.g = pixels[p+1]);
            b_in_sum += ( stackIn.b = pixels[p+2]);
            
            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;
            
            stackIn = stackIn.next;
            
            r_out_sum += ( pr = stackOut.r );
            g_out_sum += ( pg = stackOut.g );
            b_out_sum += ( pb = stackOut.b );
            
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            
            stackOut = stackOut.next;

            yi += 4;
        }
        yw += width;
    }

    
    for ( x = 0; x < width; x++ )
    {
        g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
        
        yi = x << 2;
        r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
        g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
        
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        
        stack = stackStart;
        
        for( i = 0; i < radiusPlus1; i++ )
        {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.next;
        }
        
        yp = width;
        
        for( i = 1; i <= radius; i++ )
        {
            yi = ( yp + x ) << 2;
            
            r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
            g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
            b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
            
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            
            stack = stack.next;
        
            if( i < heightMinus1 )
            {
                yp += width;
            }
        }
        
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for ( y = 0; y < height; y++ )
        {
            p = yi << 2;
            pixels[p]   = (r_sum * mul_sum) >> shg_sum;
            pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
            pixels[p+2] = (b_sum * mul_sum) >> shg_sum;
            
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            
            p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
            
            r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
            g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
            b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
            
            stackIn = stackIn.next;
            
            r_out_sum += ( pr = stackOut.r );
            g_out_sum += ( pg = stackOut.g );
            b_out_sum += ( pb = stackOut.b );
            
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            
            stackOut = stackOut.next;
            
            yi += width;
        }
    }
    
    context.putImageData( imageData, top_x, top_y );
    
}

function BlurStack()
{
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
}

module.exports = gBlur;
},{}],2:[function(require,module,exports){
// From http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
// By @PaulIrish, thx god!
var lastTime = 0;
var vendors = ['webkit', 'moz'];

for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };

// Fastclick for mobile
window.addEventListener("load", function() {
    // FastClick.attach(document.body)
})

},{}],3:[function(require,module,exports){
var PACE, a, b, back, background, blur, callback, canvas, canvasBack, changeA, changeB, changeBack, changeFront, ctx, front, imgDataDrawer, isChange, param, renderFront;

blur = require("./blur.coffee");

background = {};

imgDataDrawer = null;

ctx = null;

canvas = null;

front = new Image;

front.src = "/img/bg.png";

back = new Image;

back.src = "/img/foo2.jpg";

param = 0;

PACE = 0.01;

isChange = false;

canvasBack = null;

callback = function() {};

background.move = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (isChange) {
    changeFront();
    changeBack();
    param += PACE;
    if (param > 1) {
      isChange = false;
      param = 0;
      front = back;
      return callback();
    }
  } else {
    return renderFront();
  }
};

renderFront = function() {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.drawImage(front, 0, 0);
  return ctx.restore();
};

changeFront = function() {
  ctx.save();
  ctx.globalAlpha = 1 - param;
  ctx.drawImage(front.imgData, 0, 0);
  return ctx.restore();
};

changeBack = function() {
  ctx.save();
  ctx.globalAlpha = param;
  ctx.drawImage(back.imgData, 0, 0);
  return ctx.restore();
};

background.init = function(cvs, cvsb) {
  canvas = cvs;
  canvasBack = cvsb;
  ctx = canvas.getContext("2d");
  return imgDataDrawer = cvsb.getContext("2d");
};

background.change = function(img, cb) {
  var imgData, newImg;
  if (!img.imgData) {
    imgDataDrawer.drawImage(img, 0, 0);
    imgData = imgDataDrawer.getImageData(0, 0, canvas.width, canvas.height);
    blur(imgData);
    imgDataDrawer.putImageData(imgData, 0, 0);
    newImg = new Image;
    newImg.src = canvasBack.toDataURL();
    img.imgData = newImg;
  }
  isChange = true;
  back = img;
  return callback = cb;
};

a = front;

b = back;

changeA = function() {
  return background.change(a, changeB);
};

changeB = function() {
  return background.change(b, changeA);
};

setTimeout(function() {
  return changeA();
}, 100);

module.exports = background;



},{"./blur.coffee":4}],4:[function(require,module,exports){
var gBlur;

gBlur = require("../../lib/blur");

module.exports = function(img) {
  return gBlur(img);
};



},{"../../lib/blur":1}],5:[function(require,module,exports){
module.exports={
    "images": [
        {"url": "img/foo4.jpg", "text": "这是一个美女", "name": "Jimmy"},
        {"url": "img/foo1.png", "text": "这是一个美女", "name": "Lucy"},
        {"url": "img/foo2.jpg", "text": "这是一个美女", "name": "Tony"},
        {"url": "img/foo3.jpg", "text": "这是一个美女", "name": "Honey"},
        {"url": "img/foo5.jpg", "text": "这是一个美女", "name": "Jerry"}
    ]
}
},{}],6:[function(require,module,exports){
var $, Iterator, addClass, background, canvas, canvasBack, ctx, data, images, init, initBackground, initImages, removeClass, resizeCanvas, setBackground, setRotate, util, world;

data = require("./data.json");

util = require("./util.coffee");

world = require("./world.coffee");

background = require("./background.coffee");

images = data.images;

$ = util.$, Iterator = util.Iterator, addClass = util.addClass, removeClass = util.removeClass, setBackground = util.setBackground, setRotate = util.setRotate;

canvas = $("#canvas");

canvasBack = $("#canvas-back");

ctx = canvas.getContext("2d");

resizeCanvas = function() {
  canvas.height = window.outerHeight;
  canvas.width = window.outerWidth;
  canvasBack.height = window.outerHeight;
  return canvasBack.width = window.outerWidth;
};

init = function() {
  resizeCanvas();
  initImages();
  initBackground();
  return world.start();
};

initBackground = function() {
  background.init(canvas, canvasBack);
  return world.add(background);
};

initImages = function() {
  var img, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = images.length; _i < _len; _i++) {
    img = images[_i];
    data = new Image;
    data.src = img.url;
    _results.push(img.data = data);
  }
  return _results;
};

init();



},{"./background.coffee":3,"./data.json":5,"./util.coffee":7,"./world.coffee":8}],7:[function(require,module,exports){
var $, Iterator, addClass, removeClass, setBackground, setRotate,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$ = function(selector) {
  var dom, doms;
  doms = document.querySelectorAll(selector);
  if (doms.length === 1) {
    dom = doms[0];
    dom.on = function() {
      return dom.addEventListener.apply(dom, arguments);
    };
    return doms[0];
  }
  return doms;
};

removeClass = function($dom, className) {
  var klass;
  if (!$dom) {
    return;
  }
  klass = $dom.className;
  return $dom.className = klass.replace(RegExp("\\s" + className + "\\s?"), " ");
};

addClass = function($dom, className) {
  var classes;
  if (!$dom) {
    return;
  }
  classes = $dom.className.split(" ");
  if (__indexOf.call(classes, className) < 0) {
    if ($dom.className.match(/\s$/)) {
      return $dom.className += "" + className;
    } else {
      return $dom.className += " " + className;
    }
  }
};

setBackground = function($dom, url) {
  return $dom.style.backgroundImage = "url(" + url + ")";
};

setRotate = function($dom, deg) {
  return $dom.style.webkitTransform = "rotateZ(" + (deg + 'deg') + ")";
};

Iterator = (function() {
  function Iterator(list, isLoop) {
    this.list = list;
    this.index = 0;
    this.isLoop = isLoop || false;
  }

  Iterator.prototype.set = function(index) {
    return this.index = index;
  };

  Iterator.prototype.next = function() {
    if (this.index + 1 === this.list.length) {
      if (this.isLoop) {
        this.index = 0;
      } else {
        return;
      }
    } else {
      this.index++;
    }
    return this.list[this.index];
  };

  Iterator.prototype.prev = function() {
    if (this.index - 1 <= 0) {
      if (this.isLoop) {
        this.index = this.list.length - 1;
      } else {
        return;
      }
    } else {
      this.index--;
    }
    return this.list[this.index];
  };

  Iterator.prototype.current = function() {
    return this.list[this.index];
  };

  return Iterator;

})();

module.exports = {
  $: $,
  Iterator: Iterator,
  addClass: addClass,
  removeClass: removeClass,
  setBackground: setBackground,
  setRotate: setRotate
};



},{}],8:[function(require,module,exports){
var spirts, timer, world;

require("../../lib/init");

world = {};

timer = null;

spirts = [];

world.start = function() {
  var run;
  run = function() {
    var spirt, _i, _len;
    for (_i = 0, _len = spirts.length; _i < _len; _i++) {
      spirt = spirts[_i];
      spirt.move();
    }
    return timer = requestAnimationFrame(run);
  };
  return run();
};

world.add = function(spirt) {
  return spirts.push(spirt);
};

module.exports = world;



},{"../../lib/init":2}]},{},[6]);