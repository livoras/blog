void function(exports) {
  /**
   * 扑腾鸟 power by The-Best-JS-Game-Framework
   * @author 王集鹄(wangjihu,http//weibo.com/zswang)
   * @version 2014年05月26日
   */

  var DEBUG = false;

  var groundInfo = {
    height: 281
  };

  var bridInfo = { // 鸟在偏移信息
    gravity: 2.5 / 1000, // 重力加速度
    jumpSpeed: -800 / 1000, // 初速度
    minAngle: -0.1 * Math.PI,
    maxAngle: 0.5 * Math.PI,
    top: 620,
    left: 175,
    width: 86,
    height: 60,
    offsets: [[673, 1], [673, 62], [673, 123]]
  };

  var readyTextInfo = { // Get Ready! 偏移信息
    top: 340,
    width: 508,
    height: 158,
    offset: [510,300]
  };

  var clockInfo = {
    top: 575,
    width: 286,
    height: 246,
    offset: [760, 1]
  };

  var overTextInfo = {
    top: 270,
    width: 508,
    height: 158,
    offset: [1, 300]
  };

  var baseInfo = {
    top: 460,
    width: 590,
    height: 298,
    offset: [1, 1]
  };

  var startInfo = { // 开始按钮
    top: 846,
    left: 68,
    width: 290,
    height: 176,
    offset: [448, 459]
  };

  var gradeInfo = { // 排名
    top: 846,
    left: 368,
    width: 290,
    height: 176,
    offset: [1556, 1]
  };

  var grayInfo = {
    left: 136,
    top: 568,
    width: 123,
    height: 113,
    offset: [1047,160]
  };

  var yellowInfo = {
    left: 136,
    top: 568,
    width: 123,
    height: 113,
    offset: [1847, 85]
  };

  var numberInfo = {
    height: 91,
    itemWidth: 60,
    itemOffset: 70,
    top: 0,
    zoom: 1,
    align: 'center',
    offset: [1019, 300]
  };

  var newInfo = {
    left: 420,
    top: 610,
    width: 81,
    height: 36,
    offset: [673,184]
  };

  var holdbackInfo = {
    space: 255, // 缝隙大小
    distance: 148 + 280, // 两个之间的距离
    minTop: 80, // 最小高度
    beginTick: 2000, // 出现时机
    width: 148,
    height: 830,
    offsets: [[1, 459], [150, 459], [299, 459]]
  };

  /**
   * 计算抛物线
   * @param{Number} v0 初速度
   * @param{Number} t 时间
   * @param{Number} a 加速度
   */
  function parabola(v0, a, t) {
    return v0 * t + 0.5 * a * t * t;
  }

  function ptInRect(p, rect) {
    return p[0] >= rect.left && p[0] <= rect.left + rect.width &&
      p[1] >= rect.top && p[1] <= rect.top + rect.height;
  }

  var context;
  var jumpTick;
  var jumpTop;
  var canvas;

  var score = 0; // 积分
  var best = 0; // 历史最高
  if (window.localStorage) {
    best = localStorage.getItem('best') || 0;
  }
  var status; // 'loading', 'ready', 'playing', 'gameover'
  var statusTick;
  var holdbackMax = 1000;
  var holdbackList = new Array(holdbackMax); // 障碍物地图
  var bestNew = false; // 新记录
  function setStatus(value) {
    if (status == value) {
      return;
    }
    status = value;
    switch (status) {
      case 'loading':
        statusTick = 0;
        context.font = "30px Verdana";
        break;
      case 'ready':
        statusTick = 0;
        bestNew = false;
        score = 0;
        minHoldbackIndex = 0;
        for (var i = 0; i < holdbackMax; i++) {
          holdbackList[i] = holdbackInfo.minTop + 
            Math.random() * (canvas.height - groundInfo.height - 
            holdbackInfo.minTop * 2 - holdbackInfo.space);
        }
        break;
      case 'playing':
        jumpTop = bridInfo.top;
        jumpTick = new Date;
        break;
      case 'gameover':
        statusTick = 0;
        if (score > best) {
          best = score;
          bestNew = true;
          if (window.localStorage) {
            localStorage.setItem('best', best);
          }
        }
        break;
    }
  }

  var loadCount = 0;
  var imageHost = 'images/';
  var images;

  var KeyState = {};
  var Key = {
      Space: 32,
      Enter: 13,
      Up: 38,
      P: 80,
      R: 82,
  };

  /**
   * 渲染小鸟
   * @param top 小鸟高度
   * @param angle 角度
   */
  function renderBrid(top, angle, offset) {
    if (typeof offset == 'undefined') {
      offset = parseInt(+new Date() / 150) % bridInfo.offsets.length;
    }

    if (angle) {
      context.save();
      context.translate(bridInfo.left + bridInfo.width / 2, top + bridInfo.height / 2);
      context.rotate(angle);
      
      context.drawImage(images[2],
        bridInfo.offsets[offset][0], bridInfo.offsets[offset][1],
        bridInfo.width, bridInfo.height,
        -bridInfo.width / 2, -bridInfo.height / 2,
        bridInfo.width, bridInfo.height);
      context.restore();
    } else {
      context.drawImage(images[2],
        bridInfo.offsets[offset][0], bridInfo.offsets[offset][1],
        bridInfo.width, bridInfo.height,
        bridInfo.left, top, bridInfo.width, bridInfo.height);
    }
  }

  function renderBackground() {
    context.drawImage(images[0], 0, 0);
  }

  function renderGround() {
    var offset = status == 'playing' ? 
      -((statusTick) / 1200 * holdbackInfo.distance) % 840 : 0;
    context.save();
    context.translate(offset, canvas.height - groundInfo.height);
    context.fillStyle = patternGround;
    context.fillRect(-offset, 0, canvas.width, groundInfo.height);
    context.restore();
  }

  function renderItem(info, top) {
    context.drawImage(images[2],
      info.offset[0], info.offset[1],
      info.width, info.height,
      info.left || (canvas.width - info.width) / 2, (info.top || 0) + (top || 0),
      info.width, info.height);
  }

  /**
   * 绘制障碍物
   * @param{Number} left 左边距
   * @param{Number} top 缝隙高度
   * @param{Number} space 缝隙大小
   */
  function renderHoldback(left, top, space) {
    space = space || holdbackInfo.space;

    // 绘制上方
    context.drawImage(images[2],
      holdbackInfo.offsets[1][0], holdbackInfo.offsets[1][1] + (holdbackInfo.height - top),
      holdbackInfo.width, top,
      left, 0,
      holdbackInfo.width, top);

    var height = canvas.height - groundInfo.height - top - space;
    // 绘制下方
    context.drawImage(images[2],
      holdbackInfo.offsets[0][0], holdbackInfo.offsets[0][1],
      holdbackInfo.width, height,
      left, top + space,
      holdbackInfo.width, height);
  }

  var loadingText = 'Loading...';
  var loadingTextWidth;
  function renderLoading() {
    context.save();
    var tick = statusTick;
    var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop((tick / 100 % 20 / 20), 'blue');
    context.fillStyle = gradient;
    if (!loadingTextWidth) {
      var meause = context.measureText(loadingText);
      loadingTextWidth = meause.width;
    }
    context.fillText(loadingText,
      (canvas.width - loadingTextWidth) / 2, (canvas.height - 30) / 2);
    context.restore();
  }

  /**
   * 渲染“Get Ready!”
   * @param top 文字高度
   */
  function renderReady(top) {
    renderItem(readyTextInfo, top);
  }

  function renderClock(top) {
    renderItem(clockInfo, top);
  }

  function renderOver(top) {
    renderItem(overTextInfo, top);
  }

  function renderBase(top) {
    renderItem(baseInfo, top);
  }

  function renderStartButton(top) {
    renderItem(startInfo, top);
  }

  function renderGradeButton(top) {
    renderItem(gradeInfo, top);
  }

  function renderGray(top) {
    renderItem(grayInfo, top);
  }

  function renderYellow(top) {
    renderItem(yellowInfo, top);
  }

  function renderNew(top) {
    renderItem(newInfo, top);
  }

  /**
   * 绘制数字
   * @param{Number} number 显示数字
   * @param{Number} x 参考坐标
   * @param{Number} top 顶部坐标
   * @param{Number} zoom 缩放倍数
   */
  function renderNumber(number, x, top, zoom, align) {
    top = top || numberInfo.top;
    zoom = zoom || numberInfo.zoom;
    align = align || numberInfo.align;
    number = String(parseInt(number));

    var width = number.length * numberInfo.itemWidth * zoom;
    var left;
    switch (align) {
      case 'center':
        left = x - (width / 2);
        break;
      case 'right':
        left = x - width;
        break;
      default:
        left = x;
        break;
    }

    for (var i = 0; i < number.length; i++) {
      var item = parseInt(number.charAt(i));
      var offset = item == 1 ? -10 : (item == 0 ? 0 : -18);
      context.drawImage(images[2],
        numberInfo.offset[0] + offset + numberInfo.itemOffset * item,
        numberInfo.offset[1],
        numberInfo.itemWidth, numberInfo.height,
        left + numberInfo.itemWidth * i * zoom, top,
        numberInfo.itemWidth * zoom, numberInfo.height * zoom);
    }
  }

  var minHoldbackIndex = 0;
  var holdbackOffset = 0;
  function renderHoldbacks() {
    for (var i = minHoldbackIndex; true; i++) {
      if (canvas.width + holdbackOffset + i * holdbackInfo.distance > canvas.width) {
        break;
      }
      if (canvas.width + holdbackOffset + i * holdbackInfo.distance + holdbackInfo.width < 0) {
        minHoldbackIndex = i;
      }
      renderHoldback(canvas.width + holdbackOffset + i * holdbackInfo.distance,
        holdbackList[i % holdbackMax]);
    }
  }

  function cross(a, b, c, d) {
    return (a >= c && a <= d) || 
      (b >= c && b <= d) ||
      (c >= a && c <= b) ||
      (d >= a && d <= b);
  }

  function checkOver() {
    if (bridTop + 0.01 >= canvas.height - bridInfo.height - groundInfo.height) {
      return true;
    }

    var tick = statusTick - holdbackInfo.beginTick;
    if (tick < 0) {
      return;
    }
    var offset = -tick / 1200 * holdbackInfo.distance;
    for (var i = minHoldbackIndex; true; i++) {
      if (canvas.width + offset + i * holdbackInfo.distance > canvas.width) {
        break;
      }
      var x = canvas.width + offset + i * holdbackInfo.distance;
      var y = holdbackList[i % holdbackMax];
      if (cross(bridInfo.left, bridInfo.left + bridInfo.width - 10,
        x, x + holdbackInfo.width
        )) {
        if (bridTop < y) {
          return true;
        }
        if (bridTop + bridInfo.height - 10 > y + holdbackInfo.space) {
          return true;
        }
      }
    }
  }

  var bridTop;

  function setScore(value) {
    if (value == score) {
      return;
    }
    score = value;
    //playSound();
  }

  function fly(e) {
    switch (status) {
      case 'playing':
        var tick = new Date - jumpTick;
        var bridTop = parabola(bridInfo.jumpSpeed, bridInfo.gravity, tick % 5000);
        bridTop = Math.min(canvas.height - bridInfo.height - groundInfo.height,
          jumpTop + bridTop);
        jumpTop = bridTop;
        jumpTick = new Date;
        break;
    }
  }

  /**
   * 全局渲染
   */
  function render() {
    if (status == 'loading') {
      context.fillStyle = '#000000';
      context.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      renderBackground();
      renderGround();
    }
    var tick = statusTick;
    switch (status) {
      case 'loading':
        renderLoading();
        break;
      case 'ready':
        renderNumber(score, canvas.width / 2, 150);
        renderClock();
        renderReady(0);
        renderBrid(bridInfo.top + 15 * Math.cos((tick / 150) % 100));
        break;
      case 'playing':
        holdbackOffset = -(tick - holdbackInfo.beginTick) / 1200 * holdbackInfo.distance;
        setScore(Math.max(0, (tick - holdbackInfo.beginTick - 100) / 1200));
        tick = new Date - jumpTick;
        bridTop = parabola(bridInfo.jumpSpeed, 
          bridInfo.gravity, tick);
        bridTop = Math.min(canvas.height - bridInfo.height - groundInfo.height,
          jumpTop + bridTop);
        var angle = (bridTop - jumpTop) / 100 + 0.01 * Math.PI;
        angle = Math.max(bridInfo.minAngle, 
          Math.min(bridInfo.maxAngle, angle));
        if (checkOver(bridTop)) {
          overAngle = angle;
          setStatus('gameover');
        }

        renderHoldbacks();
        renderNumber(score, canvas.width / 2, 150);
        renderBrid(bridTop, angle);
        break;
      case 'gameover':
        var angle = (bridTop - jumpTop) / 100 + 0.01 * Math.PI;
        angle = Math.max(bridInfo.minAngle, 
          Math.min(bridInfo.maxAngle, angle));
        renderBrid(bridTop, angle, 0);
        renderHoldbacks();
        renderBase(0);
        renderOver(0);
        renderGray(0);
        renderYellow(0);
        if (bestNew) {
          renderNew(0);
        }
        renderNumber(score, 580, 545, 0.6, 'right');
        renderNumber(best, 580, 650, 0.6, 'right');
        renderStartButton(0);
        renderGradeButton(0);
        break;
    }    
  }

  exports.flappy = new Best.Game({
    FPS: 60,
    onInit: function(c) {
      canvas = c;
      context = canvas.getContext("2d");
      context.font = '76px 宋体';
      context.fillStyle = 'red';

      this.initEvent();
      setStatus('loading');
      images = ['bg.png', 'ground.png', 'flappy_packer.png'].map(function(url) {
        var result = new Image();
        result.onload = function(e) {
          if (DEBUG) {
            console.log('%s loaded.', this.src);
          }
          loadCount++;
          if (loadCount >= images.length) {
            patternGround = context.createPattern(images[1], "repeat");
            setStatus('ready');
          }
        };
        result.src = imageHost + url;
        return result;
      });
    },
    initEvent: function() {
      var self = this;
      var content = canvas.parentNode;
      function resize() {
        canvas.style.height = window.innerHeight + 'px';
        canvas.style.width = window.innerHeight * (canvas.width / canvas.height) + 'px';
        content.style.width = canvas.style.width;
      }
      resize();
      window.addEventListener('resize', resize);
      window.addEventListener('pageshow', function() {
        self.resume();
      });

      window.addEventListener('pagehide', function() {
        self.pause();
      });
      window.addEventListener("keydown", function(event) {
        KeyState[event.keyCode] = true;
      }, true);

      window.addEventListener("keyup", function(event) {
        KeyState[event.keyCode] = false;
      }, true);
      function mousedown(e) {
        switch (status) {
          case 'playing':
            fly();
            break;
          case 'gameover':
            var pos = [
                typeof e.offsetX == 'number' ? e.offsetX : e.layerX,
                typeof e.offsetY == 'number' ? e.offsetY : e.layerY
            ];
            pos[0] *= canvas.width / canvas.offsetWidth;
            pos[1] *= canvas.height / canvas.offsetHeight;
            if (ptInRect(pos, startInfo)) {
              setStatus('ready');
            }
            break;
          case 'ready':
            self.replay();
            break;
        }
      }
      canvas.addEventListener('touchdown', mousedown);
      canvas.addEventListener('mousedown', mousedown);
    },
    replay: function() {
      statusTick = 0;
      setStatus('playing');
    },
    onStart: function() {
    },
    onPause: function() {
      if (status == 'playing') {
        setStatus('pause');
      }
    },
    onResume: function() {
      if (status == 'pause') {
        setStatus('playing');
      }
    },
    handleInput: function(timeStep, now) {
      if (KeyState[Key.Enter]) {
        if (status == 'gameover') {
          setStatus('ready');
        }
      }
      if (KeyState[Key.Space] || KeyState[Key.Up]) {
        if (status == 'ready') {
          this.replay();
        }
        if (status == 'playing') {
          fly();
          KeyState[Key.Space] = 0; // 不是飞机
          KeyState[Key.Up] = 0;
        }
      }
      if (KeyState[Key.P]) {
          this.pause();
      }
      if (KeyState[Key.R]) {
          this.resume();
      }
    },
    update: function(timeStep, now) {
      statusTick += timeStep;
      switch (status) {
        case 'playing':
          var tick = statusTick;
          holdbackOffset = -(tick - holdbackInfo.beginTick) / 1200 * holdbackInfo.distance;
          setScore(Math.max(0, (tick - holdbackInfo.beginTick - 100) / 1200));
          tick = new Date - jumpTick;
          bridTop = parabola(bridInfo.jumpSpeed, 
            bridInfo.gravity, tick);
          bridTop = Math.min(canvas.height - bridInfo.height - groundInfo.height,
            jumpTop + bridTop);
          var angle = (bridTop - jumpTop) / 100 + 0.01 * Math.PI;
          angle = Math.max(bridInfo.minAngle, 
            Math.min(bridInfo.maxAngle, angle));
          if (checkOver(bridTop)) {
            overAngle = angle;
            setStatus('gameover');
          }
          break;
      }
    },
    render: function(timeStep, now) {
      if (status == 'loading') {
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        renderBackground();
        renderGround();
      }
      var tick = statusTick;
      switch (status) {
        case 'loading':
          renderLoading();
          break;
        case 'ready':
          renderNumber(score, canvas.width / 2, 150);
          renderClock();
          renderReady(0);
          renderBrid(bridInfo.top + 15 * Math.cos((tick / 150) % 100));
          break;
        case 'playing':
          holdbackOffset = -(tick - holdbackInfo.beginTick) / 1200 * holdbackInfo.distance;
          renderHoldbacks();
          setScore(Math.max(0, (tick - holdbackInfo.beginTick - 100) / 1200));
          renderNumber(score, canvas.width / 2, 150);

          tick = new Date - jumpTick;
          bridTop = parabola(bridInfo.jumpSpeed, 
            bridInfo.gravity, tick);
          bridTop = Math.min(canvas.height - bridInfo.height - groundInfo.height,
            jumpTop + bridTop);
          var angle = (bridTop - jumpTop) / 100 + 0.01 * Math.PI;
          angle = Math.max(bridInfo.minAngle, 
            Math.min(bridInfo.maxAngle, angle));
          renderBrid(bridTop, angle);
          if (checkOver(bridTop)) {
            overAngle = angle;
            setStatus('gameover');
          }
          break;
        case 'gameover':
          var angle = (bridTop - jumpTop) / 100 + 0.01 * Math.PI;
          angle = Math.max(bridInfo.minAngle, 
            Math.min(bridInfo.maxAngle, angle));
          renderBrid(bridTop, angle, 0);
          renderHoldbacks();
          renderBase(0);
          renderOver(0);
          renderGray(0);
          renderYellow(0);
          if (bestNew) {
            renderNew(0);
          }
          renderNumber(score, 580, 545, 0.6, 'right');
          renderNumber(best, 580, 650, 0.6, 'right');
          renderStartButton(0);
          renderGradeButton(0);
          break;
      }
      context.save();
      context.font = '30px Verdana';
      context.fillStyle = 'red';
      context.fillText('power by The-Best-JS-Game-Framework',
        10, canvas.height - 30);
      context.restore();
    }
  });

}(this);