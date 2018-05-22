"use strict"
var game = {
  data: null, //保存游戏二维数组
  RN: 4, // 总行数
  CN: 4, // 总列数
  score: 0, // 保存游戏得分
  state: 1, // 保存游戏状态
  RUNNING: 1, // 游戏运行中
  GAMEOVER: 0, // 游戏结束
  start() { // 游戏开始
    this.state = this.RUNNING; // 重置游戏状态为运行中
    this.score = 0; // 分数清0
    // 新建空数组保存在 data 中
    this.data = [];
    for (var r = 0; r < this.RN; r++) { // r 从0开始，到<RN结束
      // 新建空数组保存到data中 r 行
      this.data.push([]);
      for (var c = 0; c < this.CN; c++) { // c 从0开始，到<CN结束
        // 设置data中 r 行 c 列的值为0
        this.data[r][c] = 0;
      }
    }
    this.randomNum();
    this.randomNum();
    this.updateView();
    document.onkeydown = function (e) {
      switch (e.keyCode) {
        case 37: //左移
          this.moveLeft();
          break;
        case 38: //上移
          this.moveUp();
          break;
        case 39: //右移
          this.moveRight();
          break;
        case 40: // 下移
          this.moveDown();
          break;
      }
    }.bind(this);
    console.log(this.data.join("\n"));
  },
  move(callback) { // 所有移动中相同的代码
    // 为data拍照，保存在before中
    var before = String(this.data);
    callback.call(this); // 左移/右移/上移/下移
    //为data拍照，保存在after中
    var after = String(this.data);
    if (before != after) { // 如果发生了移动
      this.randomNum(); // 随机生成数
      if (this.isGameOver()) { // 如果游戏结束
        // 修改游戏状态为GAMEOVER
        this.state = this.GAMEOVER;
      }
      this.updateView(); // 更新页面
    }
  },
  moveLeft() { // 左移所有行
    /*var before = String(this.data);
    for (var r = 0; r < this.RN; r++) { //遍历data中每一行r
      //左移第r行
      this.moveLeftInRow(r);
    } //(遍历结束)
    var after = String(this.data);
    if (before != after) { //如果before不等于after
      this.randomNum(); //随机生成一个新数
      if (this.isGameOver()) { // 如果游戏结束
        // 修改游戏状态为GAMEOVER
        this.state = this.GAMEOVER;
      }
      this.updateView(); //更新页面
    }*/
    this.move(function () {
      for (var r = 0; r < this.RN; r++) {
        this.moveLeftInRow(r);
      }
    });
  },
  moveRight() { //右移所有行
    /*// 为data拍照，保存在before中
    var before = String(this.data);
    // 遍历data中每一行
    for (var r = 0; r < this.RN; r++) {
      this.moveRightInRow(r); // 右移第r行
    } // (遍历结束)
    // 为data拍照，保存在after中
    var after = String(this.data);
    if (before != after) { // 如果发生了移动
      this.randomNum(); // 随机生成数
      if (this.isGameOver()) { // 如果游戏结束
        // 修改游戏状态为GAMEOVER
        this.state = this.GAMEOVER;
      }
      this.updateView(); // 更新页面
    }*/
    this.move(function () {
      for (var r = 0; r < this.RN; r++) {
        this.moveRightInRow(r);
      }
    });
  },
  moveUp() { // 上移所有列
    this.move(function () {
      //遍历data中每一列
      for (var c = 0; c < this.CN; c++)
        //调用moveUpInCol上移第c列
        this.moveUpInCol(c);
    });
  },
  moveDown() { // 下移所有列
    this.move(function () {
      //遍历data中每一列
      for (var c = 0; c < this.CN; c++) {
        //调用moveDownInCol下移第c列
        this.moveDownInCol(c);
      }
    });
  },
  moveLeftInRow(r) { // 左移第r行
    // c从0开始，到<CN-1结束，遍历r行中每个格
    for (var c = 0; c < this.CN - 1; c++) {
      // 找r行c列右侧下一个不为0的位置nextc
      var nextc = this.getNextInRow(r, c);
      // 如果nextc为-1,就退出循环
      if (nextc == -1) {
        break;
      } else { // 否则  
        // 如果c列的值是0
        if (this.data[r][c] == 0) {
          // 将nextc列的值赋值给c列
          this.data[r][c] = this.data[r][nextc];
          // 将nextc列的值置为0
          this.data[r][nextc] = 0;
          c--; // c留在原地
        } else if (this.data[r][c] == this.data[r][nextc]) { // 否则 如果c列的值等于nextc列的值
          // 将c列的值*2
          this.data[r][c] *= 2;
          this.score += this.data[r][c];
          // 将nextc列置为0
          this.data[r][nextc] = 0;
        }
      }
    }
  },
  moveRightInRow(r) { //右移第r行
    // c从CN-1开始，到>0结束，反向遍历r行中每个格
    for (var c = this.CN - 1; c > 0; c--) {
      // 找r行c列左侧前一个不为0的位置prevc
      var prevc = this.getPrevInRow(r, c);
      // 如果prevc为-1,就退出循环
      if (prevc == -1) {
        break;
      } else { // 否则
        if (this.data[r][c] == 0) { // 如果c列的值是0
          // 将prevc列的值赋值给c列
          this.data[r][c] = this.data[r][prevc];
          // 将prevc列的值置为0
          this.data[r][prevc] = 0;
          c++; // c留在原地
        } else if (this.data[r][c] == this.data[r][prevc]) {
          // 否则 如果c列的值等于prevc列的值
          this.data[r][c] *= 2; // 将c列的值*2
          this.score += this.data[r][c];
          this.data[r][prevc] = 0; // 将prevc列置为0
        }
      }
    }
  },
  moveUpInCol(c) { // 上移第c列
    // r从0开始,到r<RN-1结束，r每次递增1
    for (var r = 0; r < this.RN - 1; r++) {
      // 查找r行c列下方下一个不为0的位置nextr
      var nextr = this.getNextInCol(r, c);
      // 如果没找到,就退出循环
      if (nextr == -1) {
        break;
      } else { // 否则
        // 如果r位置c列的值为0
        if (this.data[r][c] == 0) {
          // 将nextr位置c列的值赋值给r位置
          this.data[r][c] = this.data[nextr][c];
          // 将nextr位置c列置为0
          this.data[nextr][c] = 0;
          r--; // r留在原地
        } else if (this.data[r][c] == this.data[nextr][c]) { // 否则，如果r位置c列的值等于nextr位置的值
          // 将r位置c列的值*2
          this.data[r][c] *= 2;
          this.score += this.data[r][c];
          // 将nextr位置c列的值置为0
          this.data[nextr][c] = 0;
        }
      }
    }
  },
  moveDownInCol(c) { //下移第c列
    // r从RN-1开始，到r>0结束，r每次递减1
    for (var r = this.RN - 1; r > 0; r--) {
      // 查找r位置c列上方前一个不为0的位置prevr
      var prevr = this.getPrevInCol(r, c);
      if (prevr == -1) {
        break;
      } // 如果没找到,就退出循环
      else { // 否则  
        if (this.data[r][c] == 0) { // 如果r位置c列的值为0
          // 将prevr位置c列的值赋值给r位置
          this.data[r][c] = this.data[prevr][c];
          // 将prevr位置c列置为0
          this.data[prevr][c] = 0;
          r++; // r留在原地
        } else if (this.data[r][c] == this.data[prevr][c]) { // 否则，如果r位置c列的值等于prevr位置的值
          // 将r位置c列的值*2
          this.data[r][c] *= 2;
          this.score += this.data[r][c];
          // 将prevr位置c列置为0
          this.data[prevr][c] = 0;
        }
      }
    }
  },
  getNextInRow(r, c) { // 找到r行c列右侧下一个不为0的位置
    c++; // c+1
    for (; c < this.CN; c++) { // 从c开始，到<CN结束
      // 如果r行c位置不是0
      if (this.data[r][c] != 0) {
        // 返回c
        return c;
      }
    } // (遍历结束)
    return -1; // 返回-1
  },
  getPrevInRow(r, c) { // 找到r行c列左侧前一个不为0的位置
    c--; // c-1
    // 从c开始，到>=0结束，反向遍历
    for (; c >= 0; c--) {
      // 如果r行c位置不是0，就返回c
      if (this.data[r][c] != 0) return c;
    } // (遍历结束)
    return -1; // 返回-1
  },
  getNextInCol(r, c) { //找到r行c列下方下一个不为0的位置
    r++; // r+1
    // 循环，到<RN结束，r每次递增1
    for (; r < this.RN; r++) {
      // 如果r位置c列不等于0, 就返回r
      if (this.data[r][c] != 0) return r;
    } // (遍历结束)
    return -1; // 返回-1
  },
  getPrevInCol(r, c) { //找到r行c列下方下一个不为0的位置
    r--; //r-1
    for (; r >= 0; r--) { //循环，r到>=0结束，每次递减1
      //如果r位置c列不等于0, 就返回r
      if (this.data[r][c] != 0) return r;
    } //(遍历结束)
    return -1; //返回-1
  },
  randomNum() { // 在data中随机一个位置生成 2 或 4
    while (true) { // 反复：
      // 在0~RN-1之间生成一个随机数 r
      var r = Math.floor(Math.random() * (this.RN));
      // 在0~CN-1之间生成一个随机数 c
      var c = Math.floor(Math.random() * (this.CN));
      // 如果data中 r 行 c 列的值为 0 
      if (this.data[r][c] == 0) {
        // 将data中 r 行 c 列的赋值为：
        // 随机生成一个小数，如果<0.5，就取2，否则取4
        this.data[r][c] = (Math.random() < 0.6) ? 2 : 4;
        // 退出循环
        break;
      }
    }
  },
  isGameOver() { // 判断游戏是否结束
    for (var r = 0; r < this.data.length; r++) { // 遍历data
      for (var c = 0; c < this.data[r].length; c++) {
        // 如果当前元素为0, 返回false
        if (this.data[r][c] == 0) return false;
        // 否则如果c<CN-1且当前元素等于右侧元素
        else if (c < this.CN - 1 && this.data[r][c] == this.data[r][c + 1]) {
          // 返回false
          return false;
        }
        // 否则如果r<RN-1且当前元素等于下方元素
        else if (r < this.RN - 1 && this.data[r][c] == this.data[r + 1][c]) {
          return false;
        }
      }
    } // (遍历结束)
    return true; // 返回true
  },
  updateView() { // 将data中的数据更新到页面中
    for (var r = 0; r < this.RN; r++) {
      for (var c = 0; c < this.CN; c++) {
        // 找到id为crc的div
        var div = document.getElementById("c" + r + c);
        if (this.data[r][c] != 0) { // 如果该位置为非0
          div.innerHTML = this.data[r][c];
          div.className = "cell n" + this.data[r][c];
        } else {
          // 清除div内容，并将class重置为 cell
          div.innerHTML = "";
          div.className = "cell";
        }
      }
    }
    // 找到id为score的元素, 设置其内容为score属性
    document.getElementById("score")
      .innerHTML = this.score;
    var div = document.getElementById("gameOver");
    if (this.state == this.GAMEOVER) {
      div.style.display = "block";
      document.getElementById("final").innerHTML = this.score;
    } else {
      div.style.display = "none";
    }
  },
}
game.start();