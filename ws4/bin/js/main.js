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
var GAP, HEIGHT, WIDTH, actions, canvas, ch, ctx, cw, cx, cy, initEvents, left, leftOrd, renderLeft, renderRight, right, rightOrd, slideData;

slideData = require("./slide-data.coffee");

canvas = null;

ctx = null;

left = new Image;

left.src = "img/left.png";

right = new Image;

right.src = "img/right.png";

cy = slideData.coverY;

cx = slideData.coverX;

ch = slideData.coverHeight;

cw = slideData.coverWidth;

GAP = 25;

WIDTH = 23;

HEIGHT = 60;

actions = {};

leftOrd = {
  x: cx - WIDTH - GAP,
  y: cy + (ch - HEIGHT) / 2
};

rightOrd = {
  x: cx + cw + GAP,
  y: cy + (ch - HEIGHT) / 2
};

actions.init = function(csv) {
  canvas = csv;
  ctx = canvas.getContext("2d");
  return initEvents();
};

actions.move = function() {
  renderLeft();
  return renderRight();
};

renderRight = function() {
  var x, y;
  x = cx + cw + GAP;
  y = cy + (ch - HEIGHT) / 2;
  ctx.save();
  ctx.drawImage(right, rightOrd.x, rightOrd.y, WIDTH, HEIGHT);
  return ctx.restore();
};

renderLeft = function() {
  var x, y;
  x = cx - WIDTH - GAP;
  y = cy + (ch - HEIGHT) / 2;
  ctx.save();
  ctx.drawImage(left, leftOrd.x, leftOrd.y, WIDTH, HEIGHT);
  return ctx.restore();
};

initEvents = function() {
  return window.addEventListener("touchstart", function(event) {
    var touch, x, y;
    event.preventDefault();
    touch = event.touches[0];
    x = touch.pageX;
    y = touch.pageY;
    if (x > leftOrd.x && x < leftOrd.x + WIDTH && y > leftOrd.y && y < leftOrd.y + HEIGHT) {
      actions.actionLeft();
    }
    if (x > rightOrd.x && x < rightOrd.x + WIDTH && y > rightOrd.y && y < rightOrd.y + HEIGHT) {
      return actions.actionRight();
    }
  });
};

actions.actionRight = function() {};

actions.actionLeft = function() {};

module.exports = actions;



},{"./slide-data.coffee":10}],4:[function(require,module,exports){
var PACE, back, background, blur, callback, canvas, canvasBack, changeBack, changeFront, clip, ctx, front, getRenderData, imgDataDrawer, isChange, param, renderFront, slideData, util;

blur = require("./blur.coffee");

util = require("./util.coffee");

slideData = require("./slide-data.coffee");

background = {};

imgDataDrawer = null;

ctx = null;

canvas = null;

front = null;

back = null;

param = 0;

isChange = false;

canvasBack = null;

PACE = slideData.OPACITY_PACE;

clip = util.clip;

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
      return typeof callback === "function" ? callback() : void 0;
    }
  } else {
    return renderFront();
  }
};

renderFront = function() {
  if (!front) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = 1;
  if (front.imgData) {
    ctx.drawImage(front.imgData, 0, 0);
  }
  return ctx.restore();
};

changeFront = function() {
  if (!front) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = 1 - param;
  ctx.drawImage(front.imgData, 0, 0);
  return ctx.restore();
};

changeBack = function() {
  if (!back) {
    return;
  }
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
  img.imgData = getRenderData(img);
  isChange = true;
  back = img;
  return callback = cb;
};

background.changeFront = function(img) {
  front = img;
  return img.imgData = getRenderData(img);
};

getRenderData = function(img) {
  var h, imgData, newImg, sx, sy, w, _ref;
  w = canvas.width;
  h = canvas.height;
  _ref = clip(img, w, h), sx = _ref.sx, sy = _ref.sy;
  imgDataDrawer.drawImage(img, 0, 0, w, h);
  imgData = imgDataDrawer.getImageData(0, 0, w, h);
  blur(imgData);
  imgDataDrawer.putImageData(imgData, 0, 0);
  newImg = new Image;
  newImg.src = canvasBack.toDataURL();
  return newImg;
};

module.exports = background;



},{"./blur.coffee":5,"./slide-data.coffee":10,"./util.coffee":12}],5:[function(require,module,exports){
var gBlur;

gBlur = require("../../lib/blur");

module.exports = function(img) {
  return gBlur(img);
};



},{"../../lib/blur":1}],6:[function(require,module,exports){
var $, $text, $textWrapper, $title, PACE, canvas, clip, cover, ctx, currentImg, draw, drawCurrentImage, drawShadow, drawText, gradientHeight, height, imgData, initEvent, initText, isChange, nextImg, opacity, renderCurrentImage, renderNextImage, slideData, updateText, util, width, x, y;

cover = {};

canvas = null;

ctx = null;

currentImg = nextImg = null;

slideData = require("./slide-data.coffee");

PACE = slideData.OPACITY_PACE;

opacity = 0;

isChange = false;

util = require("./util.coffee");

clip = util.clip;

$ = util.$;

imgData = null;

x = y = width = height = 0;

gradientHeight = 90;

$textWrapper = $("div.text-wrapper");

$title = $("div.title");

$text = $("div.text");

cover.change = function(img) {
  imgData = img;
  nextImg = img.data;
  opacity = 0;
  isChange = true;
  return updateText();
};

cover.move = function() {
  if (isChange) {
    opacity += PACE;
    renderCurrentImage();
    renderNextImage();
    if (opacity >= 1) {
      isChange = false;
      opacity = 0;
      currentImg = nextImg;
    }
  } else {
    drawCurrentImage();
  }
  return drawText();
};

renderNextImage = function() {
  if (!currentImg) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = opacity;
  draw(nextImg);
  return ctx.restore();
};

renderCurrentImage = function() {
  if (!currentImg) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = 1 - opacity;
  draw(currentImg);
  return ctx.restore();
};

drawCurrentImage = function() {
  if (!currentImg || isChange) {
    return;
  }
  ctx.save();
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;
  ctx.shadowColor = "#000";
  draw(currentImg);
  return ctx.restore();
};

draw = function(img) {
  var sh, sw, sx, sy, _ref;
  ctx.translate(x, y);
  _ref = clip(img, width, height), sx = _ref.sx, sy = _ref.sy, sw = _ref.sw, sh = _ref.sh;
  return ctx.drawImage(img, 0, 0, width, height);
};

drawText = function() {
  if (!imgData) {
    return;
  }
  return drawShadow();
};

drawShadow = function() {
  var gradient;
  ctx.save();
  gradient = ctx.createLinearGradient(canvas.width / 2, y + height, canvas.width / 2, y + height - gradientHeight);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.9)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y + height - gradientHeight, width, gradientHeight);
  return ctx.restore();
};

cover.init = function(cvs) {
  canvas = cvs;
  ctx = canvas.getContext("2d");
  width = slideData.coverWidth;
  height = slideData.coverHeight;
  x = slideData.coverX;
  y = slideData.coverY;
  initText();
  return initEvent();
};

initText = function() {
  $textWrapper.style.width = width + 'px';
  return $textWrapper.style.top = y + height - gradientHeight + 5 + 'px';
};

initEvent = function() {
  var px, py, touch;
  px = 0;
  py = 0;
  touch = function(event) {
    event.preventDefault();
    if (!imgData) {
      return;
    }
    touch = event.touches[0];
    px = touch.pageX;
    return py = touch.pageY;
  };
  window.addEventListener("touchstart", touch);
  window.addEventListener("touchmove", touch);
  return window.addEventListener("touchend", function(event) {
    if (px > x && px < x + width && py > y && py < y + height) {
      return window.location.href = imgData.target;
    }
  });
};

updateText = function() {
  $title.innerHTML = imgData.title;
  return $text.innerHTML = imgData.text;
};

module.exports = cover;



},{"./slide-data.coffee":10,"./util.coffee":12}],7:[function(require,module,exports){
var $, Iterator, Thumb, active, addClass, currentActive, dashboard, data, deactive, degs, headIter, images, iniSlideAction, isSliding, makeSlideShow, next, originX, originY, prev, processSlide, removeClass, resetRotate, setBackground, setRotate, slideBackward, slideData, slideForward, tailIter, thumbs, util, visibleImgsCount, world;

data = require("./data.json");

images = data.images;

slideData = require("./slide-data.coffee");

util = require("./util.coffee");

Thumb = require("./thumb.coffee");

thumbs = [];

headIter = null;

tailIter = null;

world = null;

isSliding = false;

currentActive = null;

$ = util.$, Iterator = util.Iterator, addClass = util.addClass, removeClass = util.removeClass, setBackground = util.setBackground, setRotate = util.setRotate;

originX = slideData.originX, originY = slideData.originY, degs = slideData.degs, visibleImgsCount = slideData.visibleImgsCount;

dashboard = {};

dashboard.init = function(canvas, w) {
  Thumb.init(canvas);
  world = w;
  makeSlideShow();
  return iniSlideAction();
};

dashboard.next = next = function() {
  if (isSliding) {
    return;
  }
  return slideForward();
};

dashboard.prev = prev = function() {
  if (isSliding) {
    return;
  }
  return slideBackward();
};

makeSlideShow = function() {
  var deg, i, img, imgIter, index, thumb, _i, _len;
  imgIter = new util.Iterator(images, true);
  headIter = new util.Iterator(images, true);
  for (i = _i = 0, _len = degs.length; _i < _len; i = ++_i) {
    deg = degs[i];
    img = imgIter.current();
    index = imgIter.index;
    imgIter.next();
    thumb = new Thumb(originX, originY, deg, img);
    thumb.imgIndex = index;
    thumbs.push(thumb);
    world.add(thumb);
  }
  currentActive = thumbs[(visibleImgsCount - 1) / 2];
  tailIter = imgIter;
  return tailIter.prev();
};

slideForward = function() {
  var activeImageData, imgData, nextImgIndex, thumb;
  isSliding = true;
  deactive(currentActive);
  thumb = thumbs.shift();
  headIter.next();
  imgData = tailIter.next();
  thumbs.push(thumb);
  processSlide(thumb, imgData);
  currentActive = thumbs[(visibleImgsCount - 1) / 2];
  active(currentActive);
  nextImgIndex = currentActive.imgIndex;
  activeImageData = images[nextImgIndex];
  dashboard.activeImageData = activeImageData;
  return dashboard.onActive(activeImageData);
};

slideBackward = function() {
  var activeImageData, imgData, nextImgIndex, thumb;
  isSliding = true;
  deactive(currentActive);
  thumb = thumbs.pop();
  tailIter.prev();
  imgData = headIter.prev();
  thumbs.unshift(thumb);
  processSlide(thumb, imgData);
  currentActive = thumbs[(visibleImgsCount - 1) / 2];
  active(currentActive);
  nextImgIndex = currentActive.imgIndex;
  activeImageData = images[nextImgIndex];
  dashboard.activeImageData = activeImageData;
  return dashboard.onActive(activeImageData);
};

processSlide = function(thumb) {
  thumb.isAnima = false;
  return resetRotate(function() {
    isSliding = false;
    return thumb.isAnima = true;
  });
};

resetRotate = function(callback) {
  var cb, count, i, thumb, _i, _len, _results;
  count = 0;
  cb = function() {
    count++;
    if (count === thumbs.length - 1) {
      return callback();
    }
  };
  _results = [];
  for (i = _i = 0, _len = thumbs.length; _i < _len; i = ++_i) {
    thumb = thumbs[i];
    _results.push(thumb.change(degs[i], cb));
  }
  return _results;
};

deactive = function(thumb) {
  return thumb.deactive();
};

active = function(thumb) {
  return thumb.active();
};

iniSlideAction = function() {
  var THRESHOLD, currentPageX, isActive, originPageX;
  currentPageX = originPageX = 0;
  THRESHOLD = 50;
  isActive = false;
  window.addEventListener("touchstart", function(event) {
    var touch;
    event.preventDefault();
    touch = event.touches[0];
    if (touch.pageY >= canvas.height - slideData.DASHBOARD_HEIGHT) {
      isActive = true;
    } else {
      isActive = false;
    }
    return currentPageX = originPageX = touch.pageX;
  });
  window.addEventListener("touchmove", function(event) {
    var touch;
    if (!isActive) {
      return;
    }
    event.preventDefault();
    touch = event.touches[0];
    return currentPageX = touch.pageX;
  });
  return window.addEventListener("touchend", function(event) {
    if (!isActive) {
      return;
    }
    event.preventDefault();
    if (currentPageX > originPageX && currentPageX - originPageX > THRESHOLD) {
      return prev();
    } else if (originPageX > currentPageX && originPageX - currentPageX > THRESHOLD) {
      return next();
    }
  });
};

dashboard.onActive = function(img) {
  return console.log("TOBE IMPLEMENTED.");
};

module.exports = dashboard;



},{"./data.json":8,"./slide-data.coffee":10,"./thumb.coffee":11,"./util.coffee":12}],8:[function(require,module,exports){
module.exports={
    "images": [
        {"url": "img/foo4.jpg", "text": "这是一个美女，啊哈哈", "name": "Jimmy", "title": "中北明夷1", "target": "http://baidu.com"},
        {"url": "img/foo1.png", "text": "这是一个美女，啊哈哈22", "name": "Lucy", "title": "中北明夷2", "target": "http://baidu.com"},
        {"url": "img/foo2.jpg", "text": "这是一个美女，啊哈哈33", "name": "Tony", "title": "中北明夷3", "target": "http://baidu.com"},
        {"url": "img/foo3.jpg", "text": "这是一个美女，啊哈哈44", "name": "Honey", "title": "中北明夷4", "target": "http://baidu.com"},
        {"url": "img/foo5.jpg", "text": "这是一个美女，啊哈哈45，\n长一点，再长一点，再长一点", "name": "Jerry", "title": "中北明夷5", "target": "http://baidu.com"}
    ]
}
},{}],9:[function(require,module,exports){
var $, Iterator, actions, addClass, background, canvas, canvasBack, cover, ctx, dashboard, data, images, init, initActions, initBackground, initCover, initDashboard, initImages, removeClass, resizeCanvas, setBackground, setRotate, util, world;

data = require("./data.json");

util = require("./util.coffee");

world = require("./world.coffee");

cover = require("./cover.coffee");

background = require("./background.coffee");

images = data.images;

dashboard = require("./dashboard.coffee");

actions = require("./actions.coffee");

$ = util.$, Iterator = util.Iterator, addClass = util.addClass, removeClass = util.removeClass, setBackground = util.setBackground, setRotate = util.setRotate;

canvas = $("#canvas");

canvasBack = $("#canvas-back");

ctx = canvas.getContext("2d");

resizeCanvas = function() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvasBack.height = window.innerHeight;
  return canvasBack.width = window.innerWidth;
};

init = function() {
  resizeCanvas();
  return initImages(function() {
    initBackground();
    initDashboard();
    initCover();
    initActions();
    return world.start();
  });
};

initBackground = function() {
  background.init(canvas, canvasBack);
  return world.add(background);
};

initCover = function() {
  cover.init(canvas);
  return world.add(cover);
};

initActions = function() {
  actions.actionLeft = function() {
    return dashboard.prev();
  };
  actions.actionRight = function() {
    return dashboard.next();
  };
  actions.init(canvas);
  return world.add(actions);
};

initImages = function(callback) {
  var check, count, i, img, _i, _len, _results;
  count = 0;
  check = function() {
    count++;
    if (count === images.length) {
      return callback();
    }
  };
  _results = [];
  for (i = _i = 0, _len = images.length; _i < _len; i = ++_i) {
    img = images[i];
    data = new Image;
    data.addEventListener("load", function() {
      return check();
    });
    img.data = data;
    _results.push(data.src = img.url);
  }
  return _results;
};

initDashboard = function() {
  dashboard.init(canvas, world);
  dashboard.onActive = function(imgData) {
    background.change(imgData.data);
    return cover.change(imgData);
  };
  dashboard.next();
  return background.changeFront(dashboard.activeImageData.data);
};

init();



},{"./actions.coffee":3,"./background.coffee":4,"./cover.coffee":6,"./dashboard.coffee":7,"./data.json":8,"./util.coffee":12,"./world.coffee":13}],10:[function(require,module,exports){
var DASHBOARD_HEIGHT, DASHBOARD_WIDTH, THUMB_HEIGHT, THUMB_WIDTH, canvasHeight, canvasWidth, init, piToDeg;

THUMB_HEIGHT = 96;

THUMB_WIDTH = 65;

canvasHeight = window.innerHeight;

canvasWidth = window.innerWidth;

DASHBOARD_WIDTH = canvasWidth;

DASHBOARD_HEIGHT = 175;

init = function() {
  var half, i, imgLoops, l, perDeg, perPI, r, radius, rh, rw, totalDeg, totalPI, visibleImgsCount, w, _i;
  rh = DASHBOARD_HEIGHT - THUMB_HEIGHT;
  rw = DASHBOARD_WIDTH / 2;
  radius = 0.5 * (rw * rw + rh * rh) / rh;
  l = rw * 2;
  w = THUMB_WIDTH * 2;
  r = radius;
  perPI = Math.atan(0.5 * w / r);
  perDeg = piToDeg(perPI);
  totalPI = 2 * Math.asin(0.5 * l / r);
  totalDeg = piToDeg(totalPI);
  visibleImgsCount = Math.round(totalPI / perPI);
  if (visibleImgsCount % 2 === 0) {
    visibleImgsCount++;
  }
  imgLoops = [0];
  half = (visibleImgsCount - 1) / 2;
  for (i = _i = 1; 1 <= half ? _i <= half : _i >= half; i = 1 <= half ? ++_i : --_i) {
    imgLoops.push(i * perDeg);
    imgLoops.unshift(-i * perDeg);
  }
  exports.degs = imgLoops;
  exports.totalDeg = totalDeg;
  exports.perDeg = perDeg;
  exports.visibleImgsCount = visibleImgsCount;
  exports.originX = DASHBOARD_WIDTH / 2;
  exports.originY = canvasHeight + radius - DASHBOARD_HEIGHT + THUMB_HEIGHT;
  exports.radius = radius;
  exports.THUMB_WIDTH = THUMB_WIDTH;
  exports.THUMB_HEIGHT = THUMB_HEIGHT;
  exports.DASHBOARD_HEIGHT = DASHBOARD_HEIGHT;
  exports.DASHBOARD_WIDTH = DASHBOARD_WIDTH;
  exports.OPACITY_PACE = 0.05;
  exports.coverWidth = canvasWidth * 0.6;
  exports.coverHeight = canvasHeight * 0.53;
  exports.coverX = (canvasWidth - exports.coverWidth) / 2;
  return exports.coverY = canvasHeight - DASHBOARD_HEIGHT - exports.coverHeight - 25;
};

piToDeg = function(pi) {
  return pi / Math.PI * 180;
};

init();



},{}],11:[function(require,module,exports){
var Thumb, canvas, clip, ctx, radius, slideData, util;

slideData = require("./slide-data.coffee");

util = require("./util.coffee");

ctx = null;

canvas = null;

radius = slideData.radius;

clip = util.clip;

Thumb = (function() {
  function Thumb(originX, originY, angle, img) {
    this.originX = originX;
    this.originY = originY;
    this.angle = angle;
    this.img = img;
    this.targetAngle = this.angle;
    this.width = slideData.THUMB_WIDTH;
    this.height = slideData.THUMB_HEIGHT;
    this.isAnima = true;
  }

  Thumb.prototype.move = function() {
    var sh, sw, sx, sy, _ref;
    this.updateAngle();
    ctx.save();
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = "#555";
    ctx.translate(this.originX, this.originY);
    ctx.rotate(this.angle / 180 * Math.PI);
    _ref = clip(this.img.data, this.width, this.height), sx = _ref.sx, sy = _ref.sy, sw = _ref.sw, sh = _ref.sh;
    ctx.drawImage(this.img.data, -this.width / 2, -(radius + this.height), this.width, this.height);
    if (this.isActive) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#000000";
      ctx.fillRect(-this.width / 2, -(radius + this.height), this.width, this.height);
    }
    return ctx.restore();
  };

  Thumb.prototype.change = function(angle, callback) {
    if (this.isAnima) {
      return this.animChange(angle, callback);
    } else {
      return this.angle = this.targetAngle = angle;
    }
  };

  Thumb.prototype.animChange = function(angle, callback) {
    this.isAnima = true;
    this.targetAngle = angle;
    this.pace = (angle - this.angle) / 20;
    return this.callback = callback;
  };

  Thumb.prototype.updateAngle = function() {
    if (this.angle === this.targetAngle) {
      return;
    }
    if (Math.abs(this.targetAngle - this.angle) < 0.5) {
      this.angle = this.targetAngle;
      return typeof this.callback === "function" ? this.callback() : void 0;
    } else {
      return this.angle += this.pace;
    }
  };

  Thumb.prototype.active = function() {
    return this.isActive = true;
  };

  Thumb.prototype.deactive = function() {
    return this.isActive = false;
  };

  return Thumb;

})();

Thumb.init = function(cvs) {
  canvas = cvs;
  return ctx = canvas.getContext("2d");
};

module.exports = Thumb;



},{"./slide-data.coffee":10,"./util.coffee":12}],12:[function(require,module,exports){
var $, Iterator, addClass, clip, removeClass, setBackground, setRotate,
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

clip = function(img, width, height, percentage) {
  var ih, iw, sh, sw, sx, sy;
  percentage = percentage || 0.8;
  iw = img.width;
  ih = img.height;
  if (width / height > iw / ih) {
    sw = iw * percentage;
    sh = sw * height / width;
  } else {
    sh = ih * percentage;
    sw = sh * width / height;
  }
  sx = (iw - sw) / 2;
  sy = (ih - sh) / 2;
  return {
    sx: sx,
    sy: sy,
    sw: sw,
    sh: sh
  };
};

module.exports = {
  $: $,
  Iterator: Iterator,
  clip: clip,
  addClass: addClass,
  removeClass: removeClass,
  setBackground: setBackground,
  setRotate: setRotate
};



},{}],13:[function(require,module,exports){
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



},{"../../lib/init":2}]},{},[9]);