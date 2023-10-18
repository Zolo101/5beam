import resourceData from "./images2.json";

const version = "v0.1.1*";
const levelToPreview = 0;
let imageFunc;
const cwidth = 960;
const cheight = 540;
let pixelRatio = 1;
let addedZoom = 1;
let osc1, osctx1;
let osc2, osctx2;
let osc3, osctx3;
let osc4, osctx4;
let qTimer = 0;
let levelsString = "";
let levelCount = 53;
let f = 19;
let levels = new Array(levelCount);
let startLocations = new Array(levelCount);
const locations = new Array(6);
let bgs = new Array(levelCount);
let levelStart = 0;
let levelWidth = 0;
let levelHeight = 0;
let thisLevel = [];
let tileFrames = [];
const switchable = new Array(6);
let charCount = 0;
let charCount2 = 0;
let playMode = 0;
let lineCount = 0;
let lineLength = 0;
let levelName = new Array(levelCount);
let mdao = new Array(levelCount);
let mdao2 = 0;
let gotThisCoin = false;
let longMode = false;
let quirksMode = false;
let frameRateThrottling = true;
let coinAlpha = 0;
function charAt(j) {
  return levelsString.charCodeAt(j + levelStart) - 48;
}
function charAt2(j) {
  return levelsString.charAt(j + levelStart);
}
function tileAt(j) {
  let num = levelsString.charCodeAt(j + levelStart);
  if (num == 8364)
    return 93;
  if (num <= 126)
    return num - 46;
  if (num <= 182)
    return num - 80;
  return num - 81;
}
function loadLevels() {
  levelCount = 1;
  levels = new Array(levelCount);
  startLocations = new Array(levelCount);
  bgs = new Array(levelCount);
  levelName = new Array(levelCount);
  mdao = new Array(levelCount);
  mdao2 = 0;
  levelStart = 0;
  for (let i = 0; i < levelCount; i++) {
    levelStart += 2;
    levelName[i] = "";
    for (lineLength = 0; charAt(lineLength) != -35; lineLength++) {
      levelName[i] += charAt2(lineLength);
    }
    levelStart += lineLength;
    levelWidth = 10 * charAt(2) + charAt(3);
    levelHeight = 10 * charAt(5) + charAt(6);
    charCount = 10 * charAt(8) + charAt(9);
    bgs[i] = 10 * charAt(11) + charAt(12);
    longMode = false;
    if (charAt(14) == 24)
      longMode = true;
    levels[i] = new Array(levelHeight);
    for (let j = 0; j < levelHeight; j++) {
      levels[i][j] = new Array(levelWidth);
    }
    if (longMode) {
      for (let y = 0; y < levelHeight; y++) {
        for (let x = 0; x < levelWidth; x++) {
          levels[i][y][x] = 111 * tileAt(y * (levelWidth * 2 + 2) + x * 2 + 17, i, y) + tileAt(y * (levelWidth * 2 + 2) + x * 2 + 18, i, y);
        }
      }
      levelStart += levelHeight * (levelWidth * 2 + 2) + 17;
    } else {
      for (let y = 0; y < levelHeight; y++) {
        for (let x = 0; x < levelWidth; x++) {
          levels[i][y][x] = tileAt(y * (levelWidth + 2) + x + 17, i, y);
        }
      }
      levelStart += levelHeight * (levelWidth + 2) + 17;
    }
    startLocations[i] = new Array(charCount);
    for (let j = 0; j < charCount; j++) {
      startLocations[i][j] = new Array(6);
      for (let k = 0; k < (f - 1) / 3; k++) {
        startLocations[i][j][k] = charAt(k * 3) * 10 + charAt(k * 3 + 1);
      }
      levelStart += f - 2;
      if (startLocations[i][j][5] == 3 || startLocations[i][j][5] == 4) {
        levelStart++;
        startLocations[i][j].push([]);
        for (lineLength = 0; charAt(lineLength) != -35; lineLength++) {
          startLocations[i][j][6].push(charAt(lineLength));
        }
        levelStart += lineLength;
      }
      levelStart += 2;
    }
    lineCount = 10 * charAt(0) + charAt(1);
    levelStart += 4;
    for (let j = 0; j < lineCount; j++) {
      levelStart += 4;
      lineLength = 0;
      while (charAt(lineLength) != -35) {
        lineLength++;
      }
      levelStart += lineLength + 2;
    }
    mdao2 += 1e5 * charAt(0) + 1e4 * charAt(1) + 1e3 * charAt(2) + 100 * charAt(3) + 10 * charAt(4) + charAt(5);
    mdao[i] = mdao2;
    levelStart += 8;
  }
}
const blockProperties = [
  // tile0
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 0, false],
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, true, false, true, 1, false],
  [true, true, true, true, true, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, true, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, true, false, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, false, true, false, false, false, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, true, false, 0, 0, false, false, true, 0, false],
  [false, false, false, false, false, false, false, false, true, true, false, 0, 0, false, false, true, 120, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]],
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 0, false],
  [false, false, false, false, false, false, false, false, false, false, true, 0, 0, false, false, true, 1, false],
  // tile1
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, true, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, true, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, true, false, 0, 0, false, false, true, 0, false],
  [true, true, true, true, false, false, false, false, true, false, false, 0, 0, false, false, true, 14, false, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]],
  [true, true, true, true, false, false, false, false, true, false, false, 0, 6, false, false, true, 12, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
  [false, false, false, false, false, false, false, false, true, false, true, 0, 0, false, false, true, 41, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]],
  [true, true, true, true, false, false, false, false, true, false, false, 0, 6, false, false, true, 12, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
  [true, true, true, true, true, true, true, true, false, false, false, 0, 0, false, false, true, 1, true],
  [false, true, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, true, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  // tile2
  [true, true, true, true, false, true, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, true, false, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, false, true, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, true, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  // tile3
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, true, false, false, 0, 1, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, true, false, false, 0, 1, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, false, false, 0, 1, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, false, false, 0, 1, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, true, false, 1, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, true, false, 7, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, true, false, 2, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, true, false, 8, 0, false, false, true, 1, false],
  [false, true, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  // tile4
  [true, true, true, true, false, false, false, false, true, true, false, 13, 0, false, false, true, 5, false],
  [true, true, true, true, false, false, false, false, true, true, false, 14, 0, false, false, true, 5, false],
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [false, false, true, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, true, false, true, false, true, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, true, true, false, false, true, false, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, true, false, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, true, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, true, false, false, 0, 0, false, false, true, 3, true, [0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 1]],
  // tile5
  [false, false, false, false, false, false, false, false, false, true, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, true, false, false, 0, 2, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, true, false, false, 0, 2, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, false, false, 0, 2, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, false, false, 0, 2, false, false, true, 1, false],
  [false, true, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, true, false, 3, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, true, false, 9, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, true, false, 0, 0, false, false, true, 120, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]],
  // tile6
  [true, true, true, true, false, false, false, false, true, false, false, 0, 3, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, false, false, 0, 3, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, false, false, 0, 3, false, false, true, 1, false],
  [false, true, false, false, false, false, false, false, true, false, false, 0, 3, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, false, false, 0, 3, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, true, false, false, 0, 3, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, true, false, 0, 0, false, false, true, 2, true, [0, 0, 0, 1, 1, 1]],
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [false, false, false, true, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [true, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  // tile7
  [false, false, false, true, false, false, false, false, false, false, true, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, true, true, false, 15, 0, false, false, true, 5, false],
  [true, true, true, true, true, true, true, true, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, true, false, true, 1, false],
  [true, true, true, true, false, false, false, false, true, false, false, 0, 0, false, false, true, 30, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]],
  [false, false, false, false, true, true, true, true, true, false, false, 0, 0, false, false, true, 20, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]],
  [false, false, false, false, true, true, true, true, true, false, false, 0, 0, false, false, true, 20, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]],
  [false, false, false, false, false, false, false, false, false, false, true, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, false, false, 0, 1, false, false, true, 1, false],
  [true, true, true, true, true, true, true, true, true, false, false, 0, 1, false, false, true, 1, false],
  // tile8
  [false, false, false, false, false, false, false, false, true, true, false, 0, 0, false, false, true, 120, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]],
  [false, true, false, false, false, false, false, false, true, false, false, 0, 1, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, false, false, 0, 1, false, false, true, 1, false],
  [false, true, false, false, false, false, false, false, true, false, false, 0, 6, false, false, true, 12, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
  [false, true, false, false, false, false, false, false, true, false, false, 0, 6, false, false, false, 1, false],
  [false, true, false, false, false, false, false, false, true, false, false, 0, 6, false, false, true, 12, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
  [false, true, false, false, false, false, false, false, true, false, false, 0, 6, false, false, false, 1, false],
  [false, false, false, false, false, false, false, false, false, false, true, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, true, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  // tile9
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, true, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, true, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, true, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, true, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, true, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, true, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, true, 0, 0, false, false, false, 1, false],
  // tile10
  [false, false, false, false, true, true, true, true, false, false, false, 0, 1, false, true, true, 1, false],
  [false, false, false, false, false, false, false, false, true, false, false, 0, 0, false, false, true, 60, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]],
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, true, false, true, 1, false],
  [false, false, false, false, true, true, true, true, false, false, false, 0, 1, false, true, true, 1, false],
  [false, false, false, false, false, false, false, false, true, false, false, 0, 0, false, false, true, 60, true, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]],
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, true, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, false, true, 0, 0, false, false, true, 1, false],
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, true, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, true, false, 6, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, true, false, 12, 0, false, false, true, 1, false],
  // tile11
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  // tile12
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 0, false],
  // tile13
  [false, false, false, false, false, false, false, false, false, false, false, 0, 0, false, true, true, 1, false],
  [true, true, true, true, false, false, false, false, false, false, false, 0, 0, true, false, true, 1, false],
  [false, false, false, false, false, false, false, false, false, true, true, 0, 0, false, false, false, 1, false],
  [false, true, false, false, false, false, false, false, true, false, false, 0, 2, false, false, true, 1, false],
  [false, false, false, false, false, false, false, false, true, false, false, 0, 2, false, false, true, 1, false]
];
const charD = [
  [28, 45.4, 0.45, 27, 0.8, false, 1, 1, true, 10],
  [23, 56, 0.36, 31, 0.8, false, 1.7, 1, true, 10],
  [20, 51, 0.41, 20, 0.85, false, 5, 1, false, 10],
  [10, 86, 0.26, 31, 0.8, false, 1.6, 1, true, 10],
  [10, 84, 0.23, 31, 0.8, false, 1.4, 1, true, 10],
  [28, 70, 0.075, 28, 0.8, false, 9, 1, true, 10],
  [26, 49, 0.2, 20, 0.75, false, 0.6, 1, false, 10],
  [44, 65, 0.8, 20, 0.75, false, 0.8, 1, false, 10],
  [16, 56, 0.25, 17, 0.76, false, 0.8, 1, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [0, 0, 0, 0, 0, false, 1, 0, true, 10],
  [36.5, 72.8, 1, 20, 0.6, false, 0, 1, true, 6],
  [15.1, 72.8, 0.6, 20, 0.7, true, 0, 1, true, 6],
  [20, 40, 0.15, 20, 0.7, true, 0.7, 1, true, 6],
  [25, 50, 0.64, 20, 0.6, true, 0.1, 1, true, 6],
  [25, 10, 1, 5, 0.7, true, 0.2, 1, true, 4],
  [25, 50, 1, 20, 0.7, true, 0.1, 1, true, 3],
  [25, 29, 0.1, 20, 0.8, true, 1, 1, true, 6],
  [21.5, 43, 0.3, 20, 0.6, true, 0.5, 1, true, 6],
  [35, 60, 1, 20, 0.7, true, 0.1, 1, true, 3],
  [22.5, 45, 1, 20, 0.7, true, 0.8, 1, true, 3],
  [25, 50, 1, 20, 0.7, true, 0.1, 27, true, 3],
  [15, 30, 0.64, 20, 0.6, true, 0.2, 1, true, 3],
  [10, 55, 0.8, 20, 0.3, true, 0.4, 1, true, 6],
  [45, 10, 1, 20, 0.7, true, 0.2, 1, true, 4],
  [20, 40, 1, 20, 0.8, false, 0.8, 5, true, 3],
  [16, 45, 0.4, 20, 0.94, false, 1.1, 60, true, 3],
  [25, 10, 1, 20, 0.7, true, 0.3, 1, true, 3],
  [45, 10, 0.4, 20, 0.7, true, 0.7, 1, true, 4],
  [15, 50, 0.1, 20, 0.8, true, 1.9, 1, true, 6],
  [25, 25, 0.1, 20, 0.8, true, 1.7, 1, true, 6],
  [30, 540, 10, 20, 0.4, true, 0, 1, true, 3]
];
const diaMouths = [
  {
    frameorder: [1, 2, 3, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0],
    frames: [
      { type: "static", bodypart: 36, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -1.55, ty: -0.1 } },
      { type: "static", bodypart: 37, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -1.55, ty: -0.1 } },
      { type: "static", bodypart: 45, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -1.55, ty: -0.1 } },
      { type: "static", bodypart: 36, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -1.55, ty: -0.1 } }
    ]
  },
  {
    frameorder: [0, 0, 1, 2, 3, 1, 1, 0, 0, 1, 2, 3, 1, 1, 0, 0, 1, 2, 3, 1, 1, 0, 0, 1, 2, 3, 1, 1, 0, 0, 1, 2, 3, 1, 1, 0, 0, 1, 2, 3, 1, 1, 0, 0, 1, 2, 3, 1, 1, 0, 0, 1, 2, 3, 1, 1, 0],
    frames: [
      { type: "static", bodypart: 1, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -0.55, ty: 1.35 } },
      { type: "static", bodypart: 42, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -0.55, ty: 1.35 } },
      { type: "static", bodypart: 43, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -0.55, ty: 1.35 } },
      { type: "static", bodypart: 44, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -0.55, ty: 1.35 } }
    ]
  },
  {
    frameorder: [1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0],
    frames: [
      { type: "static", bodypart: 51, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -33.45, ty: -2.15 } },
      { type: "static", bodypart: 52, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -33.45, ty: -2.15 } },
      { type: "static", bodypart: 53, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -33.45, ty: -2.15 } }
    ]
  },
  {
    frameorder: [1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0],
    frames: [
      { type: "static", bodypart: 54, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -33.45, ty: -2.15 } },
      { type: "static", bodypart: 55, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -33.45, ty: -2.15 } },
      { type: "static", bodypart: 56, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -33.45, ty: -2.15 } }
    ]
  }
];
const bodyPartAnimations = [
  {
    // Running Arm
    bodypart: 41,
    frames: [
      { a: 0.1691741943359375, b: -0.3343353271484375, c: -0.32513427734375, d: -0.164520263671875, tx: 0, ty: 0 },
      { a: 0.1628875732421875, b: -0.3369293212890625, c: -0.32763671875, d: -0.1584014892578125, tx: -0.05, ty: 0.05 },
      { a: 0.143402099609375, b: -0.3457183837890625, c: -0.3361968994140625, d: -0.13946533203125, tx: 0, ty: 0.05 },
      { a: 0.106475830078125, b: -0.35894775390625, c: -0.3490753173828125, d: -0.1035614013671875, tx: 0, ty: 0.15 },
      { a: 0.0476837158203125, b: -0.37158203125, c: -0.3613433837890625, d: -0.0463714599609375, tx: 0, ty: 0.2 },
      { a: -0.0312652587890625, b: -0.3734130859375, c: -0.3631439208984375, d: 0.0304107666015625, tx: 0.1, ty: 0.3 },
      { a: -0.130035400390625, b: -0.3511962890625, c: -0.341522216796875, d: 0.12646484375, tx: 0.2, ty: 0.45 },
      { a: -0.2310028076171875, b: -0.29461669921875, c: -0.2865142822265625, d: 0.224639892578125, tx: 0.4, ty: 0.6 },
      { a: -0.31005859375, b: -0.209991455078125, c: -0.2042236328125, d: 0.3015289306640625, tx: 0.5, ty: 0.6 },
      { a: -0.3542327880859375, b: -0.1222076416015625, c: -0.1188507080078125, d: 0.3444976806640625, tx: 0.75, ty: 0.65 },
      { a: -0.3712921142578125, b: -0.0524749755859375, c: -0.051025390625, d: 0.361083984375, tx: 0.9, ty: 0.65 },
      { a: -0.37493896484375, b: -0.0117645263671875, c: -0.011444091796875, d: 0.3646240234375, tx: 1, ty: 0.6 },
      { a: -0.37518310546875, b: -152587890625e-16, c: -152587890625e-16, d: 0.3648681640625, tx: 0.95, ty: 0.55 },
      { a: -0.375152587890625, b: -0.0035858154296875, c: -0.0034942626953125, d: 0.364837646484375, tx: 0.95, ty: 0.55 },
      { a: -0.3746490478515625, b: -0.0182647705078125, c: -0.01776123046875, d: 0.364349365234375, tx: 0.95, ty: 0.55 },
      { a: -0.3723907470703125, b: -0.044281005859375, c: -0.0430755615234375, d: 0.3621368408203125, tx: 0.85, ty: 0.6 },
      { a: -0.3656005859375, b: -0.0829010009765625, c: -0.08062744140625, d: 0.35552978515625, tx: 0.8, ty: 0.65 },
      { a: -0.3497314453125, b: -0.1344451904296875, c: -0.1307373046875, d: 0.3401031494140625, tx: 0.7, ty: 0.6 },
      { a: -0.3190460205078125, b: -0.196136474609375, c: -0.19073486328125, d: 0.310272216796875, tx: 0.6, ty: 0.6 },
      { a: -0.2664947509765625, b: -0.2629547119140625, c: -0.2557220458984375, d: 0.2591705322265625, tx: 0.5, ty: 0.6 },
      { a: -0.19036865234375, b: -0.3223876953125, c: -0.3135223388671875, d: 0.1851348876953125, tx: 0.3, ty: 0.5 },
      { a: -0.0957794189453125, b: -0.36212158203125, c: -0.3521575927734375, d: 0.0931396484375, tx: 0.2, ty: 0.45 },
      { a: -0.0017242431640625, b: -0.3748016357421875, c: -0.3644866943359375, d: 0.001678466796875, tx: 0.15, ty: 0.3 },
      { a: 0.076385498046875, b: -0.3666534423828125, c: -0.3565673828125, d: -0.07427978515625, tx: 0.1, ty: 0.15 },
      { a: 0.129913330078125, b: -0.35107421875, c: -0.3414154052734375, d: -0.1263275146484375, tx: 0.05, ty: 0.05 },
      { a: 0.159912109375, b: -0.338348388671875, c: -0.32904052734375, d: -0.155517578125, tx: 0.05, ty: 0.05 }
    ]
  },
  {
    // Jump Arm
    bodypart: 3,
    frames: [
      { a: 0.24114990234375, b: 0.0818023681640625, c: -0.123992919921875, d: 0.365570068359375, tx: -0.05, ty: 4.4 },
      { a: 0.2412567138671875, b: 0.083343505859375, c: -0.12591552734375, d: 0.364501953125, tx: 0, ty: 4.4 },
      { a: 0.2418670654296875, b: 0.0895843505859375, c: -0.1339111328125, d: 0.3616180419921875, tx: -0.1, ty: 4.25 },
      { a: 0.2423858642578125, b: 0.1007843017578125, c: -0.1479644775390625, d: 0.356048583984375, tx: -0.1, ty: 4.2 },
      { a: 0.2422637939453125, b: 0.1172943115234375, c: -0.1678619384765625, d: 0.3470306396484375, tx: -0.15, ty: 4 },
      { a: 0.240447998046875, b: 0.139434814453125, c: -0.193145751953125, d: 0.3335418701171875, tx: -0.25, ty: 3.8 },
      { a: 0.2349395751953125, b: 0.1680755615234375, c: -0.222930908203125, d: 0.3143310546875, tx: -0.3, ty: 3.6 },
      { a: 0.22479248046875, b: 0.20147705078125, c: -0.255889892578125, d: 0.2880706787109375, tx: -0.4, ty: 3.25 },
      { a: 0.2071990966796875, b: 0.239471435546875, c: -0.2901611328125, d: 0.25347900390625, tx: -0.6, ty: 2.85 },
      { a: 0.1816253662109375, b: 0.27899169921875, c: -0.3218231201171875, d: 0.2118682861328125, tx: -0.75, ty: 2.5 },
      { a: 0.146728515625, b: 0.3177032470703125, c: -0.3484039306640625, d: 0.1646728515625, tx: -0.85, ty: 2.1 },
      { a: 0.1043548583984375, b: 0.351959228515625, c: -0.3685150146484375, d: 0.11297607421875, tx: -1.05, ty: 1.65 },
      { a: 0.056854248046875, b: 0.37933349609375, c: -0.3805389404296875, d: 0.062042236328125, tx: -1.2, ty: 1.3 },
      { a: 0.0088653564453125, b: 0.3985443115234375, c: -0.3854522705078125, d: 0.0136566162109375, tx: -1.3, ty: 0.9 },
      { a: -0.0344390869140625, b: 0.410064697265625, c: -0.3846893310546875, d: -0.0270843505859375, tx: -1.4, ty: 0.6 },
      { a: -0.07354736328125, b: 0.41558837890625, c: -0.3806915283203125, d: -0.0607147216796875, tx: -1.5, ty: 0.35 },
      { a: -0.1043243408203125, b: 0.41729736328125, c: -0.375457763671875, d: -0.0870208740234375, tx: -1.6, ty: 0.15 },
      { a: -0.1259613037109375, b: 0.4172210693359375, c: -0.37078857421875, d: -0.104949951171875, tx: -1.6, ty: 0 },
      { a: -0.1394805908203125, b: 0.4163665771484375, c: -0.3674163818359375, d: -0.115997314453125, tx: -1.7, ty: -0.1 },
      { a: -0.1436767578125, b: 0.4165496826171875, c: -0.3667144775390625, d: -0.119384765625, tx: -1.7, ty: -0.1 }
    ]
  },
  {
    // Jump Arm 2
    bodypart: 2,
    frames: [
      { a: 0.363616943359375, b: 0.0290069580078125, c: -0.0290069580078125, d: 0.363616943359375, tx: 0.05, ty: 2.5 },
      { a: 0.3632659912109375, b: 0.03179931640625, c: -0.03179931640625, d: 0.3632659912109375, tx: 0.1, ty: 2.45 },
      { a: 0.362457275390625, b: 0.0399322509765625, c: -0.0399322509765625, d: 0.362457275390625, tx: 0, ty: 2.45 },
      { a: 0.3603515625, b: 0.0555419921875, c: -0.0555419921875, d: 0.3603515625, tx: 0, ty: 2.4 },
      { a: 0.356475830078125, b: 0.07623291015625, c: -0.07623291015625, d: 0.356475830078125, tx: 0, ty: 2.35 },
      { a: 0.3489227294921875, b: 0.105255126953125, c: -0.105255126953125, d: 0.3489227294921875, tx: 0, ty: 2.3 },
      { a: 0.336517333984375, b: 0.1396942138671875, c: -0.1396942138671875, d: 0.336517333984375, tx: -0.05, ty: 2.25 },
      { a: 0.317535400390625, b: 0.178497314453125, c: -0.178497314453125, d: 0.317535400390625, tx: -0.1, ty: 2.1 },
      { a: 0.2895660400390625, b: 0.2209014892578125, c: -0.2209014892578125, d: 0.2895660400390625, tx: -0.15, ty: 2.05 },
      { a: 0.252410888671875, b: 0.26251220703125, c: -0.26251220703125, d: 0.252410888671875, tx: -0.15, ty: 2 },
      { a: 0.20660400390625, b: 0.2999420166015625, c: -0.2999420166015625, d: 0.20660400390625, tx: -0.25, ty: 2 },
      { a: 0.152862548828125, b: 0.3306884765625, c: -0.3306884765625, d: 0.152862548828125, tx: -0.3, ty: 2 },
      { a: 0.096160888671875, b: 0.3515472412109375, c: -0.3515472412109375, d: 0.096160888671875, tx: -0.3, ty: 2 },
      { a: 0.0413360595703125, b: 0.3622894287109375, c: -0.3622894287109375, d: 0.0413360595703125, tx: -0.35, ty: 2.05 },
      { a: -0.00811767578125, b: 0.364654541015625, c: -0.364654541015625, d: -0.00811767578125, tx: -0.5, ty: 2.05 },
      { a: -0.04949951171875, b: 0.361236572265625, c: -0.361236572265625, d: -0.04949951171875, tx: -0.55, ty: 2.1 },
      { a: -0.08221435546875, b: 0.3551177978515625, c: -0.3551177978515625, d: -0.08221435546875, tx: -0.6, ty: 2.25 },
      { a: -0.103973388671875, b: 0.34930419921875, c: -0.34930419921875, d: -0.103973388671875, tx: -0.7, ty: 2.25 },
      { a: -0.117431640625, b: 0.344970703125, c: -0.344970703125, d: -0.117431640625, tx: -0.7, ty: 2.25 },
      { a: -0.12213134765625, b: 0.343719482421875, c: -0.343719482421875, d: -0.12213134765625, tx: -0.75, ty: 2.25 }
    ]
  },
  {
    // Shaking Arm
    bodypart: 2,
    frames: [
      { a: 1, b: 0, c: 0, d: 1, tx: 0.45, ty: -0.05 },
      { a: 0.941253662109375, b: 0.334625244140625, c: -0.334625244140625, d: 0.941253662109375, tx: 0.45, ty: -0.05 },
      { a: 0.902191162109375, b: -0.428955078125, c: 0.428955078125, d: 0.902191162109375, tx: 0.45, ty: -0.05 },
      { a: 0.962890625, b: 0.2609100341796875, c: -0.2609100341796875, d: 0.962890625, tx: 0.45, ty: -0.05 }
    ]
  },
  {
    bodypart: 57,
    frames: [
      { a: -0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: 27.45, ty: -49.95 },
      { a: -0.30633544921875, b: 0.0095062255859375, c: 0.0095062255859375, d: 0.30633544921875, tx: 26.5, ty: -50.75 },
      { a: -0.3059234619140625, b: 0.01763916015625, c: 0.01763916015625, d: 0.3059234619140625, tx: 25.75, ty: -51.45 },
      { a: -0.305419921875, b: 0.0243682861328125, c: 0.0243682861328125, d: 0.305419921875, tx: 25.1, ty: -51.95 },
      { a: -0.304901123046875, b: 0.029693603515625, c: 0.029693603515625, d: 0.304901123046875, tx: 24.5, ty: -52.4 },
      { a: -0.304473876953125, b: 0.0336456298828125, c: 0.0336456298828125, d: 0.304473876953125, tx: 24.15, ty: -52.75 },
      { a: -0.304168701171875, b: 0.0362091064453125, c: 0.0362091064453125, d: 0.304168701171875, tx: 23.85, ty: -52.95 },
      { a: -0.3041229248046875, b: 0.037567138671875, c: 0.037567138671875, d: 0.3041229248046875, tx: 23.75, ty: -53.05 },
      { a: -0.304168701171875, b: 0.0362091064453125, c: 0.0362091064453125, d: 0.304168701171875, tx: 23.85, ty: -52.95 },
      { a: -0.3044586181640625, b: 0.0336456298828125, c: 0.0336456298828125, d: 0.3044586181640625, tx: 24.1, ty: -52.7 },
      { a: -0.304901123046875, b: 0.029693603515625, c: 0.029693603515625, d: 0.304901123046875, tx: 24.55, ty: -52.4 },
      { a: -0.305419921875, b: 0.0243682861328125, c: 0.0243682861328125, d: 0.305419921875, tx: 25.05, ty: -51.95 },
      { a: -0.3059234619140625, b: 0.01763916015625, c: 0.01763916015625, d: 0.3059234619140625, tx: 25.75, ty: -51.45 },
      { a: -0.30633544921875, b: 0.009521484375, c: 0.009521484375, d: 0.30633544921875, tx: 26.55, ty: -50.7 },
      { a: -0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: 27.45, ty: -49.95 },
      { a: -0.3064117431640625, b: -0.008209228515625, c: -0.008209228515625, d: 0.3064117431640625, tx: 28.15, ty: -49.15 },
      { a: -0.3060760498046875, b: -0.0161285400390625, c: -0.0161285400390625, d: 0.3060760498046875, tx: 28.85, ty: -48.45 },
      { a: -0.305633544921875, b: -0.022735595703125, c: -0.022735595703125, d: 0.305633544921875, tx: 29.45, ty: -47.8 },
      { a: -0.30517578125, b: -0.028045654296875, c: -0.028045654296875, d: 0.30517578125, tx: 29.9, ty: -47.3 },
      { a: -0.304779052734375, b: -0.0320587158203125, c: -0.0320587158203125, d: 0.304779052734375, tx: 30.25, ty: -46.9 },
      { a: -0.3044586181640625, b: -0.0347747802734375, c: -0.0347747802734375, d: 0.3044586181640625, tx: 30.45, ty: -46.6 },
      { a: -0.304290771484375, b: -0.0362091064453125, c: -0.0362091064453125, d: 0.304290771484375, tx: 30.55, ty: -46.45 },
      { a: -0.3042755126953125, b: -0.037353515625, c: -0.037353515625, d: 0.3042755126953125, tx: 30.65, ty: -46.35 },
      { a: -0.304290771484375, b: -0.0361785888671875, c: -0.0361785888671875, d: 0.304290771484375, tx: 30.55, ty: -46.45 },
      { a: -0.304595947265625, b: -0.033599853515625, c: -0.033599853515625, d: 0.304595947265625, tx: 30.4, ty: -46.7 },
      { a: -0.3050079345703125, b: -0.0296630859375, c: -0.0296630859375, d: 0.3050079345703125, tx: 30, ty: -47.1 },
      { a: -0.305511474609375, b: -0.0243377685546875, c: -0.0243377685546875, d: 0.305511474609375, tx: 29.6, ty: -47.65 },
      { a: -0.3059844970703125, b: -0.0176239013671875, c: -0.0176239013671875, d: 0.3059844970703125, tx: 29, ty: -48.3 },
      { a: -0.306365966796875, b: -0.0095062255859375, c: -0.0095062255859375, d: 0.306365966796875, tx: 28.3, ty: -49 },
      { a: -0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: 27.45, ty: -49.95 }
    ]
  }
];
const legFrames = [
  { type: "static", bodypart: 6 },
  { type: "static", bodypart: 7 },
  { type: "anim", usesMats: false, frames: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35] },
  { type: "anim", usesMats: true, bodypart: 62, frames: [
    { a: 0.351593017578125, b: 0.111663818359375, c: -0.1230926513671875, d: 0.463104248046875, tx: 0.25, ty: -0.7 },
    { a: 0.3514251708984375, b: 0.1110687255859375, c: -0.122222900390625, d: 0.46295166015625, tx: 0.2, ty: -0.75 },
    { a: 0.3518218994140625, b: 0.1097564697265625, c: -0.12200927734375, d: 0.4629974365234375, tx: 0.25, ty: -0.75 },
    { a: 0.351898193359375, b: 0.1095123291015625, c: -0.12017822265625, d: 0.4634857177734375, tx: 0.25, ty: -0.7 },
    { a: 0.35235595703125, b: 0.10797119140625, c: -0.118133544921875, d: 0.4640350341796875, tx: 0.35, ty: -0.7 },
    { a: 0.3529052734375, b: 0.1063232421875, c: -0.115966796875, d: 0.464569091796875, tx: 0.25, ty: -0.7 },
    { a: 0.3537445068359375, b: 0.103363037109375, c: -0.1120758056640625, d: 0.4655303955078125, tx: 0.25, ty: -0.75 },
    { a: 0.35467529296875, b: 0.1002655029296875, c: -0.108001708984375, d: 0.46649169921875, tx: 0.25, ty: -0.7 },
    { a: 0.3555755615234375, b: 0.097015380859375, c: -0.103729248046875, d: 0.4674835205078125, tx: 0.35, ty: -0.7 },
    { a: 0.3567962646484375, b: 0.0924530029296875, c: -0.0977325439453125, d: 0.468780517578125, tx: 0.35, ty: -0.75 },
    { a: 0.3580169677734375, b: 0.08770751953125, c: -0.09149169921875, d: 0.470062255859375, tx: 0.35, ty: -0.75 },
    { a: 0.35943603515625, b: 0.0815887451171875, c: -0.0834808349609375, d: 0.4715576171875, tx: 0.4, ty: -0.7 },
    { a: 0.3608551025390625, b: 0.075286865234375, c: -0.0751953125, d: 0.4729461669921875, tx: 0.4, ty: -0.65 },
    { a: 0.36212158203125, b: 0.068817138671875, c: -0.0667266845703125, d: 0.4742431640625, tx: 0.35, ty: -0.75 },
    { a: 0.363555908203125, b: 0.06097412109375, c: -0.0564727783203125, d: 0.4756011962890625, tx: 0.35, ty: -0.7 },
    { a: 0.36480712890625, b: 0.052978515625, c: -0.046051025390625, d: 0.476715087890625, tx: 0.45, ty: -0.7 },
    { a: 0.3661041259765625, b: 0.0436859130859375, c: -0.033905029296875, d: 0.477783203125, tx: 0.4, ty: -0.65 },
    { a: 0.3669586181640625, b: 0.0355377197265625, c: -0.02325439453125, d: 0.4784393310546875, tx: 0.5, ty: -0.75 },
    { a: 0.3676605224609375, b: 0.0273284912109375, c: -0.0125579833984375, d: 0.4788665771484375, tx: 0.6, ty: -0.75 },
    { a: 0.3682708740234375, b: 0.017974853515625, c: -396728515625e-15, d: 0.4790496826171875, tx: 0.5, ty: -0.75 },
    { a: 0.368621826171875, b: 0.009918212890625, c: 0.00848388671875, d: 0.47894287109375, tx: 0.6, ty: -0.75 },
    { a: 0.3687286376953125, b: 0.003204345703125, c: 0.017181396484375, d: 0.4786376953125, tx: 0.6, ty: -0.75 },
    { a: 0.36871337890625, b: -0.0032806396484375, c: 0.027191162109375, d: 0.4781646728515625, tx: 0.65, ty: -0.7 },
    { a: 0.3686370849609375, b: -0.00836181640625, c: 0.0337677001953125, d: 0.4777069091796875, tx: 0.6, ty: -0.7 },
    { a: 0.3684844970703125, b: -0.0131988525390625, c: 0.040069580078125, d: 0.4771728515625, tx: 0.65, ty: -0.7 },
    { a: 0.368255615234375, b: -0.0178070068359375, c: 0.0460052490234375, d: 0.4766387939453125, tx: 0.65, ty: -0.7 },
    { a: 0.3680419921875, b: -0.0209503173828125, c: 0.0500946044921875, d: 0.4762115478515625, tx: 0.7, ty: -0.7 },
    { a: 0.3679656982421875, b: -0.0226898193359375, c: 0.0523529052734375, d: 0.4759368896484375, tx: 0.65, ty: -0.7 },
    { a: 0.3678741455078125, b: -0.024200439453125, c: 0.054290771484375, d: 0.4757080078125, tx: 0.65, ty: -0.7 },
    { a: 0.367889404296875, b: -0.02484130859375, c: 0.05499267578125, d: 0.4757843017578125, tx: 0.65, ty: -0.7 },
    { a: 0.3678741455078125, b: -0.024261474609375, c: 0.0543670654296875, d: 0.4757080078125, tx: 0.65, ty: -0.7 },
    { a: 0.367919921875, b: -0.02288818359375, c: 0.0525970458984375, d: 0.475921630859375, tx: 0.6, ty: -0.7 },
    { a: 0.367950439453125, b: -0.02264404296875, c: 0.052276611328125, d: 0.4759368896484375, tx: 0.65, ty: -0.7 },
    { a: 0.3680419921875, b: -0.0210723876953125, c: 0.05023193359375, d: 0.476165771484375, tx: 0.65, ty: -0.75 },
    { a: 0.3681793212890625, b: -0.019378662109375, c: 0.048065185546875, d: 0.476409912109375, tx: 0.65, ty: -0.7 },
    { a: 0.368316650390625, b: -0.0163421630859375, c: 0.044158935546875, d: 0.4768218994140625, tx: 0.65, ty: -0.75 },
    { a: 0.3684844970703125, b: -0.0131988525390625, c: 0.0400543212890625, d: 0.4771728515625, tx: 0.6, ty: -0.7 },
    { a: 0.3685760498046875, b: -0.0099029541015625, c: 0.0358123779296875, d: 0.4775543212890625, tx: 0.6, ty: -0.7 },
    { a: 0.36865234375, b: -0.0064544677734375, c: 0.0313262939453125, d: 0.4778594970703125, tx: 0.6, ty: -0.7 },
    { a: 0.3687286376953125, b: -0.00164794921875, c: 0.0251007080078125, d: 0.4782867431640625, tx: 0.6, ty: -0.7 },
    { a: 0.3687286376953125, b: 0.0032958984375, c: 0.01708984375, d: 0.4786376953125, tx: 0.5, ty: -0.7 },
    { a: 0.3686370849609375, b: 0.0084075927734375, c: 0.01043701171875, d: 0.4788970947265625, tx: 0.5, ty: -0.7 },
    { a: 0.36834716796875, b: 0.0160980224609375, c: 457763671875e-15, d: 0.4790191650390625, tx: 0.5, ty: -0.7 },
    { a: 0.3679962158203125, b: 0.022705078125, c: -0.006561279296875, d: 0.47900390625, tx: 0.5, ty: -0.75 },
    { a: 0.367431640625, b: 0.0306549072265625, c: -0.01690673828125, d: 0.4787139892578125, tx: 0.4, ty: -0.7 },
    { a: 0.3666534423828125, b: 0.0386505126953125, c: -0.0273590087890625, d: 0.47821044921875, tx: 0.45, ty: -0.7 },
    { a: 0.36572265625, b: 0.0467376708984375, c: -0.0378875732421875, d: 0.47747802734375, tx: 0.4, ty: -0.7 },
    { a: 0.36456298828125, b: 0.0548095703125, c: -0.0484161376953125, d: 0.4764862060546875, tx: 0.35, ty: -0.75 },
    { a: 0.363250732421875, b: 0.062835693359375, c: -0.0604705810546875, d: 0.47509765625, tx: 0.4, ty: -0.7 },
    { a: 0.36151123046875, b: 0.07196044921875, c: -0.0708770751953125, d: 0.4736328125, tx: 0.25, ty: -0.65 },
    { a: 0.3601226806640625, b: 0.0785675048828125, c: -0.0795135498046875, d: 0.47222900390625, tx: 0.35, ty: -0.7 },
    { a: 0.3583526611328125, b: 0.0861663818359375, c: -0.089508056640625, d: 0.4704437255859375, tx: 0.35, ty: -0.65 },
    { a: 0.3568267822265625, b: 0.0923919677734375, c: -0.09765625, d: 0.468780517578125, tx: 0.2, ty: -0.75 },
    { a: 0.3555145263671875, b: 0.0972137451171875, c: -0.1039886474609375, d: 0.4674072265625, tx: 0.25, ty: -0.7 },
    { a: 0.3542022705078125, b: 0.1017913818359375, c: -0.1100006103515625, d: 0.46600341796875, tx: 0.25, ty: -0.65 },
    { a: 0.3532867431640625, b: 0.1049957275390625, c: -0.114227294921875, d: 0.4650115966796875, tx: 0.2, ty: -0.75 },
    { a: 0.3524017333984375, b: 0.10797119140625, c: -0.1181488037109375, d: 0.4640045166015625, tx: 0.15, ty: -0.7 },
    { a: 0.3518829345703125, b: 0.109619140625, c: -0.120269775390625, d: 0.4634552001953125, tx: 0.25, ty: -0.7 },
    { a: 0.3514404296875, b: 0.1110076904296875, c: -0.1221466064453125, d: 0.46295166015625, tx: 0.2, ty: -0.7 },
    { a: 0.351593017578125, b: 0.111663818359375, c: -0.1230926513671875, d: 0.463104248046875, tx: 0.25, ty: -0.7 }
  ] },
  { type: "anim", usesMats: true, bodypart: 62, frames: [
    { a: 0.2861175537109375, b: 0.232147216796875, c: -0.2834320068359375, d: 0.3856353759765625, tx: 0.1, ty: -0.65 },
    { a: 0.2884979248046875, b: 0.228240966796875, c: -0.2781219482421875, d: 0.3885650634765625, tx: 0.15, ty: -0.7 },
    { a: 0.29730224609375, b: 0.2166748046875, c: -0.262603759765625, d: 0.3993072509765625, tx: 0, ty: -0.7 },
    { a: 0.312591552734375, b: 0.194122314453125, c: -0.23236083984375, d: 0.417724609375, tx: 0.2, ty: -0.7 },
    { a: 0.3320465087890625, b: 0.1588134765625, c: -0.18536376953125, d: 0.4407501220703125, tx: 0.35, ty: -0.7 },
    { a: 0.3515167236328125, b: 0.1096343994140625, c: -0.120361328125, d: 0.4630279541015625, tx: 0.45, ty: -0.75 },
    { a: 0.3641204833984375, b: 0.0562286376953125, c: -0.05029296875, d: 0.47607421875, tx: 0.5, ty: -0.65 },
    { a: 0.368499755859375, b: 0.0100250244140625, c: 0.0083465576171875, d: 0.4788360595703125, tx: 0.65, ty: -0.7 },
    { a: 0.368316650390625, b: -0.0161285400390625, c: 0.043853759765625, d: 0.4767913818359375, tx: 0.7, ty: -0.75 },
    { a: 0.367889404296875, b: -0.0248565673828125, c: 0.05499267578125, d: 0.4757843017578125, tx: 0.7, ty: -0.7 },
    { a: 0.3680419921875, b: -0.02099609375, c: 0.050140380859375, d: 0.476165771484375, tx: 0.7, ty: -0.75 },
    { a: 0.3685760498046875, b: -0.0084228515625, c: 0.0338897705078125, d: 0.4776763916015625, tx: 0.65, ty: -0.7 },
    { a: 0.3684844970703125, b: 0.0113525390625, c: 0.0066070556640625, d: 0.4788665771484375, tx: 0.6, ty: -0.7 },
    { a: 0.365966796875, b: 0.043426513671875, c: -0.0335845947265625, d: 0.4776153564453125, tx: 0.5, ty: -0.65 },
    { a: 0.358428955078125, b: 0.0848388671875, c: -0.0877532958984375, d: 0.4704437255859375, tx: 0.45, ty: -0.7 },
    { a: 0.3435211181640625, b: 0.13238525390625, c: -0.1503753662109375, d: 0.45404052734375, tx: 0.35, ty: -0.65 },
    { a: 0.3231201171875, b: 0.1761322021484375, c: -0.208404541015625, d: 0.430267333984375, tx: 0.2, ty: -0.7 },
    { a: 0.3029327392578125, b: 0.2087860107421875, c: -0.2519989013671875, d: 0.4060821533203125, tx: 0.1, ty: -0.65 },
    { a: 0.29034423828125, b: 0.225860595703125, c: -0.274932861328125, d: 0.390838623046875, tx: 0.1, ty: -0.7 },
    { a: 0.2861175537109375, b: 0.232147216796875, c: -0.2834320068359375, d: 0.3856353759765625, tx: 0.1, ty: -0.65 }
  ] }
];
const charModels = [
  {
    // Ruby
    torsomat: { a: 1, b: 0, c: 0, d: 1, tx: 0.05, ty: -3.1 },
    legx: [-8.55, 9.8],
    legy: [-11.25, -11.25],
    firemat: { a: -0.45697021484375, b: 0.0060882568359375, c: 0.0076904296875, d: 0.5772552490234375, tx: -2.3, ty: -51.8 },
    charimgmat: { a: 0.15606689453125, b: 0, c: 0, d: 0.15606689453125, tx: 0.05, ty: 0.6 },
    burstmat: { a: 1.5308685302734375, b: 0, c: 0, d: 0.8062744140625, tx: 0.05, ty: -23.95 },
    defaultExpr: 0,
    mouthType: 0,
    frames: [
      [
        { type: "anim", anim: 0, offset: 15, loop: true, mat: { a: 1, b: 0, c: 0, d: 1, tx: -19.05, ty: -17.65 } },
        { type: "body", mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 0, ty: -24.75 } },
        { type: "static", bodypart: 36, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -13.05, ty: -20.25 } },
        { type: "static", bodypart: 39, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -25.35, ty: -30.7 } },
        { type: "static", bodypart: 39, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -9.65, ty: -30.95 } },
        { type: "anim", anim: 0, offset: 0, loop: true, mat: { a: 1, b: 0, c: 0, d: 1, tx: 15.95, ty: -17.65 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: 0.3648681640625, b: 152587890625e-16, c: -152587890625e-16, d: 0.3648681640625, tx: -19.15, ty: -18.1 } },
        { type: "body", mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 0, ty: -23.85 } },
        { type: "dia", mat: { a: 1, b: 0, c: 0, d: 1, tx: -11.7, ty: -19.35 } },
        { type: "static", bodypart: 39, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -25.35, ty: -29.8 } },
        { type: "static", bodypart: 39, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -9.65, ty: -30.05 } },
        { type: "static", bodypart: 2, mat: { a: 0.3648681640625, b: 0, c: 152587890625e-16, d: 0.3648681640625, tx: 19.2, ty: -19.6 } }
      ],
      [
        { type: "anim", anim: 0, offset: 15, loop: true, mat: { a: -1, b: 0, c: 0, d: 1, tx: 18.95, ty: -17.65 } },
        { type: "body", mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -0.1, ty: -24.75 } },
        { type: "static", bodypart: 36, mat: { a: 0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: 12.95, ty: -20.25 } },
        { type: "static", bodypart: 39, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 9.55, ty: -30.95 } },
        { type: "static", bodypart: 39, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 25.25, ty: -30.7 } },
        { type: "anim", anim: 0, offset: 0, loop: true, mat: { a: -1, b: 0, c: 0, d: 1, tx: -16.05, ty: -17.65 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: -0.3648681640625, b: 152587890625e-16, c: 152587890625e-16, d: 0.3648681640625, tx: 19.15, ty: -18.1 } },
        { type: "body", mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 0, ty: -23.85 } },
        { type: "dia", mat: { a: -1, b: 0, c: 0, d: 1, tx: 11.7, ty: -19.35 } },
        { type: "static", bodypart: 39, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 9.65, ty: -30.05 } },
        { type: "static", bodypart: 39, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 25.35, ty: -29.8 } },
        { type: "static", bodypart: 2, mat: { a: -0.3648681640625, b: 0, c: -152587890625e-16, d: 0.3648681640625, tx: -19.2, ty: -19.35 } }
      ],
      [
        { type: "anim", anim: 2, offset: 0, loop: false, mat: { a: 1, b: 0, c: 0, d: 1, tx: -20.65, ty: -23.15 } },
        { type: "body", mat: { a: 0.3636016845703125, b: 0.02899169921875, c: -0.02899169921875, d: 0.3636016845703125, tx: 1.5, ty: -23.8 } },
        { type: "static", bodypart: 36, mat: { a: -0.39892578125, b: -0.0318145751953125, c: -0.0318145751953125, d: 0.39892578125, tx: -11.85, ty: -20.4 } },
        { type: "static", bodypart: 39, mat: { a: 0.3636016845703125, b: 0.02899169921875, c: -0.02899169921875, d: 0.3636016845703125, tx: -23.3, ty: -31.75 } },
        { type: "static", bodypart: 39, mat: { a: 0.3636016845703125, b: 0.02899169921875, c: -0.02899169921875, d: 0.3636016845703125, tx: -7.6, ty: -30.75 } },
        { type: "anim", anim: 2, offset: 0, loop: false, mat: { a: -1, b: 0, c: 0, d: 1, tx: 21.75, ty: -22.9 } }
      ],
      [
        { type: "anim", anim: 2, offset: 0, loop: false, mat: { a: -1, b: 0, c: 0, d: 1, tx: 21.05, ty: -23.15 } },
        { type: "body", mat: { a: -0.3636016845703125, b: 0.02899169921875, c: 0.02899169921875, d: 0.3636016845703125, tx: -1.1, ty: -23.8 } },
        { type: "static", bodypart: 36, mat: { a: 0.39892578125, b: -0.0318145751953125, c: 0.0318145751953125, d: 0.39892578125, tx: 12.25, ty: -20.4 } },
        { type: "static", bodypart: 39, mat: { a: -0.3636016845703125, b: 0.02899169921875, c: 0.02899169921875, d: 0.3636016845703125, tx: 8, ty: -30.75 } },
        { type: "static", bodypart: 39, mat: { a: -0.3636016845703125, b: 0.02899169921875, c: 0.02899169921875, d: 0.3636016845703125, tx: 23.7, ty: -31.75 } },
        { type: "anim", anim: 2, offset: 0, loop: false, mat: { a: 1, b: 0, c: 0, d: 1, tx: -21.35, ty: -22.9 } }
      ],
      [
        { type: "static", bodypart: 41, mat: { a: 0.211151123046875, b: -0.2940673828125, c: -0.300384521484375, d: -0.2069244384765625, tx: -21.25, ty: -20.6 } },
        { type: "body", mat: { a: 0.3636016845703125, b: 0.02899169921875, c: -0.02899169921875, d: 0.3636016845703125, tx: 1.5, ty: -23.8 } },
        { type: "static", bodypart: 1, mat: { a: -0.399322509765625, b: -0.0230865478515625, c: -0.0230865478515625, d: 0.399322509765625, tx: -13, ty: -21.15 } },
        { type: "static", bodypart: 0, mat: { a: 0.3636016845703125, b: 0.02899169921875, c: -0.02899169921875, d: 0.3636016845703125, tx: -19.45, ty: -31.5 } },
        { type: "static", bodypart: 0, mat: { a: -0.3636016845703125, b: 0.02899169921875, c: -0.02899169921875, d: 0.3636016845703125, tx: -5.4, ty: -30.5 } },
        { type: "static", bodypart: 41, mat: { a: 0.211151123046875, b: -0.2940673828125, c: -0.300384521484375, d: -0.2069244384765625, tx: -1.35, ty: -17.85 } }
      ],
      [
        { type: "static", bodypart: 41, mat: { a: -0.211151123046875, b: -0.2940673828125, c: 0.300384521484375, d: -0.2069244384765625, tx: 23.05, ty: -20.6 } },
        { type: "body", mat: { a: -0.3636016845703125, b: 0.02899169921875, c: 0.02899169921875, d: 0.3636016845703125, tx: -1.1, ty: -23.8 } },
        { type: "static", bodypart: 1, mat: { a: 0.399322509765625, b: -0.0230865478515625, c: 0.0230865478515625, d: 0.399322509765625, tx: 14.8, ty: -21.15 } },
        { type: "static", bodypart: 0, mat: { a: 0.3636016845703125, b: 0.02899169921875, c: 0.02899169921875, d: 0.3636016845703125, tx: 7.2, ty: -30.5 } },
        { type: "static", bodypart: 0, mat: { a: -0.3636016845703125, b: 0.02899169921875, c: 0.02899169921875, d: 0.3636016845703125, tx: 21.25, ty: -31.5 } },
        { type: "static", bodypart: 41, mat: { a: -0.211151123046875, b: -0.2940673828125, c: 0.300384521484375, d: -0.2069244384765625, tx: 3.15, ty: -17.85 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: -0.12213134765625, b: 0.343719482421875, c: -0.343719482421875, d: -0.12213134765625, tx: -21.4, ty: -20.9 } },
        { type: "body", mat: { a: 0.3636016845703125, b: 0.02899169921875, c: -0.02899169921875, d: 0.3636016845703125, tx: 1.5, ty: -23.8 } },
        { type: "static", bodypart: 5, mat: { a: -0.412109375, b: -0.0328521728515625, c: -0.024749755859375, d: 0.3104248046875, tx: -9.3, ty: -21.75 } },
        { type: "static", bodypart: 4, mat: { a: 0.3636016845703125, b: 0.02899169921875, c: -0.02899169921875, d: 0.3636016845703125, tx: -20.8, ty: -32 } },
        { type: "static", bodypart: 4, mat: { a: 0.3636016845703125, b: 0.02899169921875, c: -0.02899169921875, d: 0.3636016845703125, tx: -4.85, ty: -31 } },
        { type: "static", bodypart: 2, mat: { a: -0.0661163330078125, b: -0.358734130859375, c: 0.358734130859375, d: -0.066131591796875, tx: 20.35, ty: -18.1 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: 0.12213134765625, b: 0.343719482421875, c: 0.343719482421875, d: -0.12213134765625, tx: 22.4, ty: -20.9 } },
        { type: "body", mat: { a: -0.3636016845703125, b: 0.02899169921875, c: 0.02899169921875, d: 0.3636016845703125, tx: -0.5, ty: -23.8 } },
        { type: "static", bodypart: 5, mat: { a: 0.412109375, b: -0.0328521728515625, c: 0.024749755859375, d: 0.3104248046875, tx: 10.3, ty: -21.75 } },
        { type: "static", bodypart: 4, mat: { a: -0.3636016845703125, b: 0.02899169921875, c: 0.02899169921875, d: 0.3636016845703125, tx: 5.85, ty: -31 } },
        { type: "static", bodypart: 4, mat: { a: -0.3636016845703125, b: 0.02899169921875, c: 0.02899169921875, d: 0.3636016845703125, tx: 21.8, ty: -32 } },
        { type: "static", bodypart: 2, mat: { a: 0.0661163330078125, b: -0.358734130859375, c: -0.358734130859375, d: -0.066131591796875, tx: -19.35, ty: -18.1 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: -19.4, y: -17.4 } },
        { type: "body", mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 0, ty: -23.85 } },
        { type: "static", bodypart: 36, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -13.05, ty: -19.35 } },
        { type: "static", bodypart: 39, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -25.35, ty: -29.8 } },
        { type: "static", bodypart: 39, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -9.65, ty: -30.05 } },
        { type: "armroot", id: 1, pos: { x: 19.2, y: -17.4 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 19.2, y: -17.4 } },
        { type: "body", mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 0, ty: -23.85 } },
        { type: "static", bodypart: 36, mat: { a: 0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: 11.6, ty: -19.35 } },
        { type: "static", bodypart: 39, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 9.65, ty: -30.05 } },
        { type: "static", bodypart: 39, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 25.35, ty: -29.8 } },
        { type: "armroot", id: 1, pos: { x: -19.4, y: -17.4 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 19.2, y: -17.4 } },
        { type: "armroot", id: 1, pos: { x: -19.4, y: -17.4 } },
        { type: "body", mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 0, ty: -23.85 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 19.2, y: -17.4 } },
        { type: "armroot", id: 1, pos: { x: -19.4, y: -17.4 } },
        { type: "body", mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 0, ty: -23.85 } }
      ]
    ]
  },
  {
    // Book
    torsomat: { a: 1, b: 0, c: 0, d: 1, tx: 1.15, ty: -8.95 },
    legx: [-5.55, 8.8],
    legy: [-11.25, -11.25],
    firemat: { a: -0.4046630859375, b: 0.0060882568359375, c: 0.006805419921875, d: 0.5772552490234375, tx: 1.05, ty: -51.05 },
    charimgmat: { a: 0.12158203125, b: -0.0020751953125, c: 0.0037384033203125, d: 0.12152099609375, tx: 0.1, ty: 0.4 },
    burstmat: { a: 1.0688934326171875, b: 0, c: 0, d: 1, tx: 1.6, ty: -32.25 },
    defaultExpr: 1,
    mouthType: 0,
    frames: [
      [
        { type: "anim", anim: 0, offset: 15, loop: true, mat: { a: 1, b: 0, c: 0, d: 1, tx: -21.05, ty: -17.65 } },
        { type: "body", mat: { a: 0.2847747802734375, b: -0.0040130615234375, c: 0.0086822509765625, d: 0.285064697265625, tx: 0.35, ty: -26.65 } },
        { type: "static", bodypart: 0, mat: { a: -0.375213623046875, b: 0.00494384765625, c: 0, d: 0.375213623046875, tx: -9.05, ty: -30.6 } },
        { type: "static", bodypart: 0, mat: { a: -0.37518310546875, b: 0.00494384765625, c: 0, d: 0.375213623046875, tx: 4.2, ty: -30.35 } },
        { type: "static", bodypart: 1, mat: { a: -0.3180999755859375, b: 0.01141357421875, c: 0.022735595703125, d: 0.43402099609375, tx: -2.5, ty: -17.5 } },
        { type: "anim", anim: 0, offset: 0, loop: true, mat: { a: 1, b: 0, c: 0, d: 1, tx: 17.95, ty: -17.65 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: 0.3733978271484375, b: 0.0712127685546875, c: -0.0721435546875, d: 0.3782196044921875, tx: -21.35, ty: -16.9 } },
        { type: "body", mat: { a: 0.2847747802734375, b: -0.0040130615234375, c: 0.0086822509765625, d: 0.285064697265625, tx: 0.6, ty: -26.2 } },
        { type: "static", bodypart: 0, mat: { a: -0.375213623046875, b: 0.00494384765625, c: 0, d: 0.375213623046875, tx: -8.8, ty: -30.15 } },
        { type: "static", bodypart: 0, mat: { a: -0.37518310546875, b: 0.00494384765625, c: 0, d: 0.375213623046875, tx: 4.45, ty: -29.8 } },
        { type: "static", bodypart: 2, mat: { a: -0.3849334716796875, b: 0.0501251220703125, c: 0.0777587890625, d: 0.3766937255859375, tx: 21.1, ty: -18.65 } },
        { type: "dia", mat: { a: 0.886138916015625, b: 0, c: 0, d: 0.886138916015625, tx: -2.05, ty: -18.05 } }
      ],
      [
        { type: "anim", anim: 0, offset: 15, loop: true, mat: { a: -1, b: 0, c: 0, d: 1, tx: 22.1, ty: -17.65 } },
        { type: "body", mat: { a: 0.283721923828125, b: 0.0136260986328125, c: -0.0087432861328125, d: 0.283905029296875, tx: 0.85, ty: -26.65 } },
        { type: "static", bodypart: 0, mat: { a: 0.37518310546875, b: 0.00494384765625, c: 0, d: 0.375213623046875, tx: -4.2, ty: -30.25 } },
        { type: "static", bodypart: 0, mat: { a: 0.37518310546875, b: 0.00494384765625, c: 0, d: 0.375213623046875, tx: 9.05, ty: -30.6 } },
        { type: "static", bodypart: 1, mat: { a: 0.3180999755859375, b: 0.01141357421875, c: -0.022735595703125, d: 0.43402099609375, tx: 2.5, ty: -17.5 } },
        { type: "anim", anim: 0, offset: 0, loop: true, mat: { a: -1, b: 0, c: 0, d: 1, tx: -17.95, ty: -17.65 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: -0.3730010986328125, b: 0.071136474609375, c: 0.0718994140625, d: 0.3780364990234375, tx: 21.2, ty: -16.8 } },
        { type: "body", mat: { a: 0.2848052978515625, b: 0.003997802734375, c: -0.0077362060546875, d: 0.2839813232421875, tx: -0.3, ty: -26.2 } },
        { type: "static", bodypart: 0, mat: { a: 0.37518310546875, b: 0.00494384765625, c: 0, d: 0.375213623046875, tx: -4.4, ty: -29.75 } },
        { type: "static", bodypart: 0, mat: { a: 0.37518310546875, b: 0.00494384765625, c: 0, d: 0.375213623046875, tx: 8.75, ty: -30.1 } },
        { type: "static", bodypart: 2, mat: { a: 0.3796844482421875, b: 0.0500335693359375, c: -0.076751708984375, d: 0.3769683837890625, tx: -20.85, ty: -18.65 } },
        { type: "dia", mat: { a: -0.886138916015625, b: 0, c: 0, d: 0.886138916015625, tx: 2.35, ty: -18.05 } }
      ],
      [
        { type: "anim", anim: 1, offset: 0, loop: false, mat: { a: 1, b: 0, c: 0, d: 1, tx: -18.55, ty: -24.65 } },
        { type: "body", mat: { a: 0.28375244140625, b: 0.0136871337890625, c: -0.009918212890625, d: 0.2838592529296875, tx: 1.9, ty: -26.75 } },
        { type: "static", bodypart: 0, mat: { a: -0.37451171875, b: -0.0196380615234375, c: -0.0245208740234375, d: 0.374267578125, tx: -7.25, ty: -31.35 } },
        { type: "static", bodypart: 0, mat: { a: -0.37451171875, b: -0.0196380615234375, c: -0.0245208740234375, d: 0.374267578125, tx: 6, ty: -30.1 } },
        { type: "static", bodypart: 1, mat: { a: -0.3180389404296875, b: -0.0084075927734375, c: -0.004058837890625, d: 0.310455322265625, tx: -1.55, ty: -17.8 } },
        { type: "anim", anim: 1, offset: 0, loop: false, mat: { a: -1, b: 0, c: 0, d: 1, tx: 21.4, ty: -24.65 } }
      ],
      [
        { type: "anim", anim: 1, offset: 0, loop: false, mat: { a: -1, b: 0, c: 0, d: 1, tx: 21.4, ty: -24.65 } },
        { type: "body", mat: { a: 0.2836456298828125, b: -0.0136871337890625, c: 0.009918212890625, d: 0.2837677001953125, tx: 0.9, ty: -26.75 } },
        { type: "static", bodypart: 0, mat: { a: 0.37451171875, b: -0.0196380615234375, c: 0.0245208740234375, d: 0.374267578125, tx: -3.2, ty: -30.1 } },
        { type: "static", bodypart: 0, mat: { a: 0.37451171875, b: -0.0196380615234375, c: 0.0245208740234375, d: 0.374267578125, tx: 10.05, ty: -31.35 } },
        { type: "static", bodypart: 1, mat: { a: 0.3180389404296875, b: -0.0084075927734375, c: 0.004058837890625, d: 0.310455322265625, tx: 4.35, ty: -17.8 } },
        { type: "anim", anim: 1, offset: 0, loop: false, mat: { a: 1, b: 0, c: 0, d: 1, tx: -18.55, ty: -24.65 } }
      ],
      [
        { type: "static", bodypart: 3, mat: { a: -0.0284576416015625, b: -0.457672119140625, c: -0.385009765625, d: 0.023651123046875, tx: -17.15, ty: -21.15 } },
        { type: "body", mat: { a: 0.28375244140625, b: 0.0136871337890625, c: -0.009918212890625, d: 0.2838592529296875, tx: 1.9, ty: -26.75 } },
        { type: "static", bodypart: 0, mat: { a: -0.37451171875, b: -0.0196380615234375, c: -0.0245208740234375, d: 0.374267578125, tx: -7.25, ty: -31.35 } },
        { type: "static", bodypart: 0, mat: { a: -0.37451171875, b: -0.0196380615234375, c: -0.0245208740234375, d: 0.374267578125, tx: 6, ty: -30.1 } },
        { type: "static", bodypart: 1, mat: { a: -0.3180389404296875, b: -0.0084075927734375, c: -0.004058837890625, d: 0.310455322265625, tx: -1.55, ty: -17.8 } },
        { type: "static", bodypart: 3, mat: { a: -0.02813720703125, b: -0.4629669189453125, c: -0.386383056640625, d: 0.0238037109375, tx: 9.25, ty: -19.75 } }
      ],
      [
        { type: "static", bodypart: 3, mat: { a: 0.0284576416015625, b: -0.457672119140625, c: 0.385009765625, d: 0.023651123046875, tx: 16.9, ty: -21.25 } },
        { type: "body", mat: { a: 0.28363037109375, b: -0.0136871337890625, c: 0.009918212890625, d: 0.28375244140625, tx: -2.3, ty: -26.75 } },
        { type: "static", bodypart: 0, mat: { a: 0.37451171875, b: -0.0196380615234375, c: 0.0245208740234375, d: 0.374267578125, tx: -6.4, ty: -30.1 } },
        { type: "static", bodypart: 0, mat: { a: 0.37451171875, b: -0.0196380615234375, c: 0.0245208740234375, d: 0.374267578125, tx: 6.85, ty: -31.35 } },
        { type: "static", bodypart: 1, mat: { a: 0.3180389404296875, b: -0.0084075927734375, c: 0.004058837890625, d: 0.310455322265625, tx: 1.15, ty: -17.8 } },
        { type: "static", bodypart: 3, mat: { a: 0.02813720703125, b: -0.46295166015625, c: 0.386383056640625, d: 0.0238037109375, tx: -9.5, ty: -19.75 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: -0.26220703125, b: 0.2750244140625, c: -0.2784881591796875, d: -0.2655029296875, tx: -20.2, ty: -24.1 } },
        { type: "body", mat: { a: 0.283966064453125, b: 0.0086822509765625, c: -0.00372314453125, d: 0.28411865234375, tx: 1.5, ty: -25.95 } },
        { type: "static", bodypart: 4, mat: { a: -0.37493896484375, b: -0.011810302734375, c: -0.016754150390625, d: 0.3746490478515625, tx: -7.6, ty: -30.4 } },
        { type: "static", bodypart: 4, mat: { a: -0.3749237060546875, b: -0.011810302734375, c: -0.016448974609375, d: 0.3746795654296875, tx: 5.6, ty: -29.45 } },
        { type: "static", bodypart: 5, mat: { a: -0.3182525634765625, b: -0.0028076171875, c: 3204345703125e-16, d: 0.3105926513671875, tx: -0.7, ty: -18.75 } },
        { type: "static", bodypart: 2, mat: { a: 0.21820068359375, b: 0.313629150390625, c: 0.29925537109375, d: -0.2410430908203125, tx: 21.95, ty: -24.25 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: 0.26220703125, b: 0.2750244140625, c: 0.2784881591796875, d: -0.2655029296875, tx: 20.6, ty: -24.5 } },
        { type: "body", mat: { a: 0.2838592529296875, b: -0.0077362060546875, c: 0.0037994384765625, d: 0.284027099609375, tx: -1.2, ty: -26.4 } },
        { type: "static", bodypart: 4, mat: { a: 0.3748626708984375, b: -0.0118255615234375, c: 0.0179901123046875, d: 0.374542236328125, tx: -5.2, ty: -29.85 } },
        { type: "static", bodypart: 4, mat: { a: 0.3748779296875, b: 0.011810302734375, c: 0.0179901123046875, d: 0.3745269775390625, tx: 8, ty: -30.8 } },
        { type: "static", bodypart: 5, mat: { a: 0.3182220458984375, b: -0.0028076171875, c: -0.0013580322265625, d: 0.3105621337890625, tx: 1.1, ty: -19.15 } },
        { type: "static", bodypart: 2, mat: { a: -0.21820068359375, b: 0.313629150390625, c: -0.29925537109375, d: -0.2410430908203125, tx: -21.2, ty: -24.75 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: -21.1, y: -17.05 } },
        { type: "body", mat: { a: 0.2847747802734375, b: -0.0040130615234375, c: 0.0086822509765625, d: 0.285064697265625, tx: 0.6, ty: -26.2 } },
        { type: "static", bodypart: 0, mat: { a: -0.375213623046875, b: 0.00494384765625, c: 0, d: 0.375213623046875, tx: -8.8, ty: -30.15 } },
        { type: "static", bodypart: 0, mat: { a: -0.37518310546875, b: 0.00494384765625, c: 0, d: 0.375213623046875, tx: 4.45, ty: -29.9 } },
        { type: "static", bodypart: 1, mat: { a: -0.3180999755859375, b: 0.01141357421875, c: 0.022735595703125, d: 0.43402099609375, tx: -2.25, ty: -17.05 } },
        { type: "armroot", id: 1, pos: { x: 21.5, y: -17.05 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 22.1, y: -17.05 } },
        { type: "body", mat: { a: 0.28399658203125, b: 0.00396728515625, c: -0.008697509765625, d: 0.2838592529296875, tx: 0.25, ty: -26.2 } },
        { type: "static", bodypart: 0, mat: { a: 0.37518310546875, b: 0.00494384765625, c: 0, d: 0.375213623046875, tx: -3.45, ty: -29.8 } },
        { type: "static", bodypart: 0, mat: { a: 0.37518310546875, b: 0.00494384765625, c: 0, d: 0.375213623046875, tx: 9.8, ty: -30.15 } },
        { type: "static", bodypart: 1, mat: { a: 0.3180999755859375, b: 0.01141357421875, c: -0.022735595703125, d: 0.43402099609375, tx: 3.25, ty: -17.05 } },
        { type: "armroot", id: 1, pos: { x: -20.5, y: -17.05 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 22.1, y: -17.05 } },
        { type: "armroot", id: 1, pos: { x: -20.5, y: -17.05 } },
        { type: "body", mat: { a: -0.28411865234375, b: 152587890625e-16, c: -0.0037078857421875, d: 0.2840576171875, tx: 0.4, ty: -26.2 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 22.1, y: -17.05 } },
        { type: "armroot", id: 1, pos: { x: -20.5, y: -17.05 } },
        { type: "body", mat: { a: -0.28411865234375, b: 152587890625e-16, c: -0.0037078857421875, d: 0.2840576171875, tx: 0.4, ty: -26.2 } }
      ]
    ]
  },
  {
    // Ice Cube
    torsomat: { a: 1, b: 0, c: 0, d: 1, tx: -0.05, ty: -4.6 },
    legx: [-5.55, 8.8],
    legy: [-11.25, -11.25],
    firemat: { a: 0.8855438232421875, b: 0, c: 0, d: 1, tx: 2.05, ty: 0 },
    charimgmat: { a: 0.14532470703125, b: -0.00250244140625, c: 0.00445556640625, d: 0.1452484130859375, tx: -0.3, ty: 0.5 },
    burstmat: { a: 1, b: 0, c: 0, d: 0.8679046630859375, tx: 0.6, ty: -27.95 },
    defaultExpr: 1,
    mouthType: 0,
    frames: [
      [
        { type: "body", mat: { a: 0.319091796875, b: -0.0054779052734375, c: 0.009796142578125, d: 0.3189697265625, tx: 0.35, ty: -26.65 } },
        { type: "static", bodypart: 39, mat: { a: -0.375244140625, b: 0.0051116943359375, c: 0, d: 0.375244140625, tx: -17.4, ty: -30 } },
        { type: "static", bodypart: 1, mat: { a: -0.318145751953125, b: 0.0123748779296875, c: 0.01629638671875, d: 0.31024169921875, tx: -11.3, ty: -18.55 } }
      ],
      [
        { type: "body", mat: { a: 0.31939697265625, b: -0.005462646484375, c: 0.0098114013671875, d: 0.3192596435546875, tx: -0.05, ty: -26.6 } },
        { type: "static", bodypart: 39, mat: { a: -0.375244140625, b: 0.0051116943359375, c: 0, d: 0.375244140625, tx: -17.75, ty: -29.55 } },
        { type: "dia", mat: { a: 0.759613037109375, b: 0, c: 0, d: 0.759613037109375, tx: -11.75, ty: -19.85 } }
      ],
      [
        { type: "body", mat: { a: -0.319091796875, b: -0.0054779052734375, c: -0.009796142578125, d: 0.3189697265625, tx: -0.45, ty: -26.65 } },
        { type: "static", bodypart: 39, mat: { a: 0.375244140625, b: 0.0051116943359375, c: 0, d: 0.375244140625, tx: 17.3, ty: -30 } },
        { type: "static", bodypart: 1, mat: { a: 0.318145751953125, b: 0.0123748779296875, c: -0.01629638671875, d: 0.31024169921875, tx: 11.2, ty: -18.55 } }
      ],
      [
        { type: "body", mat: { a: -0.31939697265625, b: -0.005462646484375, c: -0.0098114013671875, d: 0.3192596435546875, tx: 1.05, ty: -26.6 } },
        { type: "static", bodypart: 39, mat: { a: 0.375244140625, b: 0.0051116943359375, c: 0, d: 0.375244140625, tx: 18.75, ty: -29.55 } },
        { type: "dia", mat: { a: -0.759613037109375, b: 0, c: 0, d: 0.759613037109375, tx: 12.75, ty: -19.85 } }
      ],
      [
        { type: "body", mat: { a: 0.3189697265625, b: 0.0085296630859375, c: -0.00421142578125, d: 0.31903076171875, tx: 0.6, ty: -26.6 } },
        { type: "static", bodypart: 39, mat: { a: -0.3750457763671875, b: -0.0113525390625, c: -0.0164642333984375, d: 0.37481689453125, tx: -16.95, ty: -30.7 } },
        { type: "static", bodypart: 1, mat: { a: -0.318328857421875, b: -0.0016021728515625, c: 0.002655029296875, d: 0.31060791015625, tx: -11.35, ty: -19 } }
      ],
      [
        { type: "body", mat: { a: -0.3189697265625, b: 0.0085296630859375, c: 0.00421142578125, d: 0.31903076171875, tx: -0.7, ty: -26.6 } },
        { type: "static", bodypart: 39, mat: { a: 0.3750457763671875, b: -0.0113525390625, c: 0.0164642333984375, d: 0.37481689453125, tx: 16.85, ty: -30.7 } },
        { type: "static", bodypart: 1, mat: { a: 0.318328857421875, b: -0.0016021728515625, c: -0.002655029296875, d: 0.31060791015625, tx: 11.25, ty: -19 } }
      ],
      [],
      [],
      [
        { type: "body", mat: { a: 0.31939697265625, b: -0.005462646484375, c: 0.0098114013671875, d: 0.3192596435546875, tx: -0.05, ty: -26.6 } },
        { type: "static", bodypart: 40, mat: { a: -0.375244140625, b: 0.0051116943359375, c: 0, d: 0.375244140625, tx: -16.85, ty: -28 } },
        { type: "static", bodypart: 5, mat: { a: -0.318145751953125, b: 0.0123748779296875, c: 0.01629638671875, d: 0.31024169921875, tx: -11.4, ty: -19.15 } }
      ],
      [
        { type: "body", mat: { a: -0.31939697265625, b: -0.005462646484375, c: -0.0098114013671875, d: 0.3192596435546875, tx: 1.6, ty: -26.6 } },
        { type: "static", bodypart: 40, mat: { a: 0.375244140625, b: 0.0051116943359375, c: 0, d: 0.375244140625, tx: 18.4, ty: -28 } },
        { type: "static", bodypart: 5, mat: { a: 0.318145751953125, b: 0.0123748779296875, c: -0.01629638671875, d: 0.31024169921875, tx: 12.95, ty: -19.15 } }
      ],
      [],
      [],
      [],
      []
    ]
  },
  {
    // Match
    torsomat: { a: 0.9517822265625, b: 0, c: 0, d: 0.9517822265625, tx: 0.4, ty: -8.95 },
    legx: [-2.45, 5.1],
    legy: [-11.25, -11.25],
    firemat: { a: -0.1956634521484375, b: 0.0030975341796875, c: 0.0032806396484375, d: 0.2937164306640625, tx: 1.05, ty: -94 },
    charimgmat: { a: 0.1161346435546875, b: 0, c: 0, d: 0.1161346435546875, tx: -0.15, ty: 0.2 },
    burstmat: { a: 0.5277099609375, b: 0, c: 0, d: 1.2281951904296875, tx: 0.6, ty: -41 },
    defaultExpr: 0,
    mouthType: 0,
    frames: [
      [
        { type: "anim", anim: 0, offset: 15, loop: true, mat: { a: 1, b: 0, c: 0, d: 1, tx: -6.1, ty: -22.1 } },
        { type: "body", mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.05, ty: -41.75 } },
        { type: "static", bodypart: 0, mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: -3.6, ty: -39.6 } },
        { type: "static", bodypart: 36, mat: { a: -0.194427490234375, b: 0, c: 0, d: 0.329345703125, tx: -1.4, ty: -29.45 } },
        { type: "anim", anim: 0, offset: 0, loop: true, mat: { a: 1, b: 0, c: 0, d: 1, tx: 5.95, ty: -22.65 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: -0.322235107421875, b: -0.090789794921875, c: -0.090789794921875, d: 0.322235107421875, tx: -5.6, ty: -19.95 } },
        { type: "body", mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.05, ty: -40.85 } },
        { type: "static", bodypart: 0, mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: -3.6, ty: -38.7 } },
        { type: "static", bodypart: 2, mat: { a: -0.313751220703125, b: 0.1172332763671875, c: 0.1172332763671875, d: 0.313751220703125, tx: 4.65, ty: -20.1 } },
        { type: "dia", mat: { a: 0.4889373779296875, b: 0, c: 0, d: 0.9688720703125, tx: -0.8, ty: -28.85 } }
      ],
      [
        { type: "anim", anim: 0, offset: 15, loop: true, mat: { a: -1, b: 0, c: 0, d: 1, tx: 7.5, ty: -22.65 } },
        { type: "body", mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.05, ty: -41.75 } },
        { type: "static", bodypart: 0, mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 5, ty: -39.6 } },
        { type: "static", bodypart: 36, mat: { a: 0.194427490234375, b: 0, c: 0, d: 0.329345703125, tx: 2.8, ty: -29.45 } },
        { type: "anim", anim: 0, offset: 0, loop: true, mat: { a: -1, b: 0, c: 0, d: 1, tx: -4.55, ty: -22.65 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: 0.322235107421875, b: -0.090789794921875, c: 0.090789794921875, d: 0.322235107421875, tx: 6.2, ty: -19.95 } },
        { type: "body", mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.55, ty: -40.85 } },
        { type: "static", bodypart: 0, mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 4.2, ty: -38.7 } },
        { type: "static", bodypart: 2, mat: { a: 0.313751220703125, b: 0.1172332763671875, c: -0.1172332763671875, d: 0.313751220703125, tx: -4.05, ty: -20.1 } },
        { type: "dia", mat: { a: -0.4889373779296875, b: 0, c: 0, d: 0.9688720703125, tx: 1.4, ty: -28.85 } }
      ],
      [
        { type: "anim", anim: 2, offset: 0, loop: false, mat: { a: 0.999664306640625, b: -0.022705078125, c: 0.022705078125, d: 0.999664306640625, tx: -3.05, ty: -25.7 } },
        { type: "body", mat: { a: 0.33477783203125, b: 0.0128631591796875, c: -0.0128631591796875, d: 0.33477783203125, tx: 2.45, ty: -41.05 } },
        { type: "static", bodypart: 0, mat: { a: -0.33477783203125, b: -0.0128631591796875, c: -0.0128631591796875, d: 0.33477783203125, tx: -1.3, ty: -39.05 } },
        { type: "static", bodypart: 37, mat: { a: -0.194244384765625, b: -0.0074615478515625, c: -0.0112762451171875, d: 0.2929840087890625, tx: 0.55, ty: -28.7 } },
        { type: "anim", anim: 2, offset: 0, loop: false, mat: { a: -0.999664306640625, b: 0.022705078125, c: 0.022705078125, d: 0.999664306640625, tx: 6.7, ty: -25.1 } }
      ],
      [
        { type: "anim", anim: 2, offset: 0, loop: false, mat: { a: -0.999755859375, b: -0.01812744140625, c: -0.01812744140625, d: 0.999755859375, tx: 5.05, ty: -25.2 } },
        { type: "body", mat: { a: -0.334716796875, b: 0.014404296875, c: 0.014404296875, d: 0.334716796875, tx: -0.5, ty: -40.5 } },
        { type: "static", bodypart: 0, mat: { a: 0.334716796875, b: -0.014404296875, c: 0.014404296875, d: 0.334716796875, tx: 3.25, ty: -38.55 } },
        { type: "static", bodypart: 37, mat: { a: 0.1941986083984375, b: -0.0083465576171875, c: 0.012603759765625, d: 0.2929229736328125, tx: 1.45, ty: -28.2 } },
        { type: "anim", anim: 2, offset: 0, loop: false, mat: { a: 0.999755859375, b: 0.01812744140625, c: -0.01812744140625, d: 0.999755859375, tx: -4.65, ty: -24.6 } }
      ],
      [
        { type: "static", bodypart: 3, mat: { a: 0.02471923828125, b: -0.3337860107421875, c: -0.3337860107421875, d: -0.0247039794921875, tx: -3.5, ty: -20.2 } },
        { type: "body", mat: { a: 0.3344268798828125, b: 0.0204620361328125, c: -0.0204620361328125, d: 0.3344268798828125, tx: 3.4, ty: -40.75 } },
        { type: "static", bodypart: 38, mat: { a: -0.19403076171875, b: -0.011871337890625, c: -0.017913818359375, d: 0.29266357421875, tx: 1.2, ty: -28.45 } },
        { type: "static", bodypart: 39, mat: { a: -0.3344268798828125, b: -0.0204620361328125, c: -0.0204620361328125, d: 0.3344268798828125, tx: -0.4, ty: -38.85 } },
        { type: "static", bodypart: 3, mat: { a: 0.02471923828125, b: -0.3337860107421875, c: -0.3337860107421875, d: -0.0247039794921875, tx: 7.25, ty: -20.2 } }
      ],
      [
        { type: "static", bodypart: 3, mat: { a: -0.02471923828125, b: -0.3337860107421875, c: 0.3337860107421875, d: -0.0247039794921875, tx: 5.55, ty: -20.2 } },
        { type: "body", mat: { a: -0.3344268798828125, b: 0.0204620361328125, c: 0.0204620361328125, d: 0.3344268798828125, tx: -1.35, ty: -40.75 } },
        { type: "static", bodypart: 38, mat: { a: 0.19403076171875, b: -0.011871337890625, c: 0.017913818359375, d: 0.29266357421875, tx: 0.85, ty: -28.45 } },
        { type: "static", bodypart: 39, mat: { a: 0.33441162109375, b: -0.0204620361328125, c: 0.0204620361328125, d: 0.33441162109375, tx: 2.45, ty: -38.85 } },
        { type: "static", bodypart: 3, mat: { a: -0.02471923828125, b: -0.3337860107421875, c: 0.3337860107421875, d: -0.0247039794921875, tx: -5.2, ty: -20.2 } }
      ],
      [
        { type: "static", bodypart: 3, mat: { a: 0.247894287109375, b: -0.2249298095703125, c: -0.2249298095703125, d: -0.247894287109375, tx: -4.9, ty: -20.15 } },
        { type: "body", mat: { a: 0.334869384765625, b: 0.011962890625, c: -0.011962890625, d: 0.334869384765625, tx: 1.5, ty: -40.85 } },
        { type: "static", bodypart: 5, mat: { a: -0.19427490234375, b: -0.0069427490234375, c: -0.011749267578125, d: 0.3291015625, tx: -0.05, ty: -30.75 } },
        { type: "static", bodypart: 4, mat: { a: -0.334869384765625, b: -0.011962890625, c: -0.011962890625, d: 0.334869384765625, tx: -1.95, ty: -41.55 } },
        { type: "static", bodypart: 3, mat: { a: -0.1793365478515625, b: -0.380706787109375, c: 0.3028411865234375, d: -0.1426544189453125, tx: 5.35, ty: -20 } }
      ],
      [
        { type: "static", bodypart: 3, mat: { a: -0.247894287109375, b: -0.2249298095703125, c: 0.2249298095703125, d: -0.247894287109375, tx: 5.95, ty: -20.15 } },
        { type: "body", mat: { a: -0.334869384765625, b: 0.011962890625, c: 0.011962890625, d: 0.334869384765625, tx: -0.45, ty: -40.85 } },
        { type: "static", bodypart: 5, mat: { a: 0.19427490234375, b: -0.0069427490234375, c: 0.011749267578125, d: 0.3291015625, tx: 1.1, ty: -30.75 } },
        { type: "static", bodypart: 4, mat: { a: 0.334869384765625, b: -0.011962890625, c: 0.011962890625, d: 0.334869384765625, tx: 3, ty: -41.55 } },
        { type: "static", bodypart: 3, mat: { a: 0.1793365478515625, b: -0.380706787109375, c: -0.3028411865234375, d: -0.1426544189453125, tx: -4.3, ty: -20 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: -6.15, y: -20.1 } },
        { type: "body", mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.05, ty: -40.85 } },
        { type: "static", bodypart: 0, mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: -3.6, ty: -38.7 } },
        { type: "static", bodypart: 36, mat: { a: -0.194427490234375, b: 0, c: 0, d: 0.329345703125, tx: -1.4, ty: -28.55 } },
        { type: "armroot", id: 1, pos: { x: 5.4, y: -20.1 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 6.75, y: -20.1 } },
        { type: "body", mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.55, ty: -40.85 } },
        { type: "static", bodypart: 0, mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 4.2, ty: -38.7 } },
        { type: "static", bodypart: 36, mat: { a: 0.194427490234375, b: 0, c: 0, d: 0.329345703125, tx: 2, ty: -28.55 } },
        { type: "armroot", id: 1, pos: { x: -4.8, y: -20.1 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: -6.15, y: -20.1 } },
        { type: "armroot", id: 1, pos: { x: 7.2, y: -20.1 } },
        { type: "body", mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.2, ty: -40.85 } },
        { type: "static", bodypart: 0, mat: { a: -0.20111083984375, b: 0, c: 0, d: 0.3351287841796875, tx: -5.15, ty: -38.7 } },
        { type: "static", bodypart: 36, mat: { a: -0.1166839599609375, b: 0, c: 0, d: 0.329345703125, tx: -3.8, ty: -28.55 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 6.9, y: -20.1 } },
        { type: "armroot", id: 1, pos: { x: -6.3, y: -20.1 } },
        { type: "body", mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.1, ty: -40.85 } },
        { type: "static", bodypart: 0, mat: { a: 0.20111083984375, b: 0, c: 0, d: 0.3351287841796875, tx: 5.8, ty: -38.7 } },
        { type: "static", bodypart: 36, mat: { a: 0.1166839599609375, b: 0, c: 0, d: 0.329345703125, tx: 4.45, ty: -28.55 } }
      ]
    ]
  },
  {
    // Pencil
    torsomat: { a: 0.9736328125, b: 0, c: 0, d: 0.9736328125, tx: -0.2, ty: -8.75 },
    legx: [-2.45, 5.1],
    legy: [-11.25, -11.25],
    firemat: { a: -0.16912841796875, b: 0.0142822265625, c: 0.031341552734375, d: 0.6383819580078125, tx: -3.65, ty: -58.2 },
    charimgmat: { a: 0.10894775390625, b: -0.003753662109375, c: 0.003753662109375, d: 0.10894775390625, tx: -0.2, ty: -1.4 },
    burstmat: { a: 0.557373046875, b: 0, c: 0, d: 1.2081451416015625, tx: -2.65, ty: -42.2 },
    defaultExpr: 0,
    mouthType: 0,
    frames: [
      [
        { type: "anim", anim: 0, offset: 15, loop: true, mat: { a: 1, b: 0, c: 0, d: 1, tx: -4.55, ty: -20.4 } },
        { type: "body", mat: { a: 0.333160400390625, b: -0.035125732421875, c: 0.035125732421875, d: 0.333160400390625, tx: -2.5, ty: -39.2 } },
        { type: "static", bodypart: 0, mat: { a: -0.333160400390625, b: 0.035125732421875, c: 0.035125732421875, d: 0.333160400390625, tx: -7.1, ty: -36.05 } },
        { type: "static", bodypart: 36, mat: { a: -0.1932830810546875, b: 0.0203857421875, c: 0.034515380859375, d: 0.327423095703125, tx: -3.85, ty: -26.2 } },
        { type: "anim", anim: 0, offset: 0, loop: true, mat: { a: 1, b: 0, c: 0, d: 1, tx: 5.95, ty: -20.4 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: -0.322235107421875, b: -0.090789794921875, c: -0.090789794921875, d: 0.322235107421875, tx: -5.25, ty: -18.95 } },
        { type: "body", mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 1.4, ty: -39.85 } },
        { type: "static", bodypart: 0, mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: -3.25, ty: -37.2 } },
        { type: "static", bodypart: 2, mat: { a: -0.313751220703125, b: 0.1172332763671875, c: 0.1172332763671875, d: 0.313751220703125, tx: 6.5, ty: -19.1 } },
        { type: "dia", mat: { a: 0.555206298828125, b: 0, c: 0, d: 0.8481903076171875, tx: -0.25, ty: -27.2 } }
      ],
      [
        { type: "anim", anim: 0, offset: 15, loop: true, mat: { a: -1, b: 0, c: 0, d: 1, tx: 7.45, ty: -20.4 } },
        { type: "body", mat: { a: -0.333160400390625, b: -0.035125732421875, c: -0.035125732421875, d: 0.333160400390625, tx: 5.4, ty: -39.2 } },
        { type: "static", bodypart: 0, mat: { a: 0.333160400390625, b: 0.035125732421875, c: -0.035125732421875, d: 0.333160400390625, tx: 10, ty: -36.05 } },
        { type: "static", bodypart: 36, mat: { a: 0.1932830810546875, b: 0.0203857421875, c: -0.034515380859375, d: 0.327423095703125, tx: 6.75, ty: -26.2 } },
        { type: "anim", anim: 0, offset: 0, loop: true, mat: { a: -1, b: 0, c: 0, d: 1, tx: -3.05, ty: -20.4 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: 0.322235107421875, b: -0.090789794921875, c: 0.090789794921875, d: 0.322235107421875, tx: 7.45, ty: -18.95 } },
        { type: "body", mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.8, ty: -39.85 } },
        { type: "static", bodypart: 0, mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 4.2, ty: -38.7 } },
        { type: "static", bodypart: 2, mat: { a: 0.313751220703125, b: 0.1172332763671875, c: -0.1172332763671875, d: 0.313751220703125, tx: -4.3, ty: -19.1 } },
        { type: "dia", mat: { a: -0.555206298828125, b: 0, c: 0, d: 0.8481903076171875, tx: 2.45, ty: -27.2 } }
      ],
      [
        { type: "anim", anim: 2, offset: 0, loop: false, mat: { a: 0.9993896484375, b: -0.0311737060546875, c: 0.0311737060546875, d: 0.9993896484375, tx: -4.05, ty: -24.5 } },
        { type: "body", mat: { a: 0.334869384765625, b: 0.0100250244140625, c: -0.0100250244140625, d: 0.334869384765625, tx: 2.45, ty: -39.9 } },
        { type: "static", bodypart: 0, mat: { a: -0.334869384765625, b: -0.0100250244140625, c: -0.0100250244140625, d: 0.334869384765625, tx: -2.4, ty: -37.85 } },
        { type: "static", bodypart: 37, mat: { a: -0.19427490234375, b: -0.005828857421875, c: -0.0087738037109375, d: 0.293060302734375, tx: -0.5, ty: -27.5 } },
        { type: "anim", anim: 2, offset: 0, loop: false, mat: { a: -0.9993896484375, b: 0.0311737060546875, c: 0.0311737060546875, d: 0.9993896484375, tx: 5.7, ty: -24 } }
      ],
      [
        { type: "anim", anim: 2, offset: 0, loop: false, mat: { a: -0.9992523193359375, b: -0.0352020263671875, c: -0.0352020263671875, d: 0.9992523193359375, tx: 6.75, ty: -24.55 } },
        { type: "body", mat: { a: -0.33489990234375, b: 0.0086669921875, c: 0.0086669921875, d: 0.33489990234375, tx: 0.35, ty: -39.9 } },
        { type: "static", bodypart: 0, mat: { a: 0.33489990234375, b: -0.0086669921875, c: 0.0086669921875, d: 0.33489990234375, tx: 5.15, ty: -37.85 } },
        { type: "static", bodypart: 37, mat: { a: 0.1942901611328125, b: -0.0050201416015625, c: 0.007598876953125, d: 0.2930755615234375, tx: 3.2, ty: -27.55 } },
        { type: "anim", anim: 2, offset: 0, loop: false, mat: { a: 0.9992523193359375, b: 0.0352020263671875, c: -0.0352020263671875, d: 0.9992523193359375, tx: -3, ty: -24.05 } }
      ],
      [
        { type: "static", bodypart: 3, mat: { a: 0.02471923828125, b: -0.3337860107421875, c: -0.3337860107421875, d: -0.0247039794921875, tx: -4.45, ty: -20.75 } },
        { type: "body", mat: { a: 0.3344268798828125, b: 0.0204620361328125, c: -0.0204620361328125, d: 0.3344268798828125, tx: 3.4, ty: -39.75 } },
        { type: "static", bodypart: 1, mat: { a: -0.19403076171875, b: -0.011871337890625, c: -0.017913818359375, d: 0.29266357421875, tx: 0.2, ty: -27.2 } },
        { type: "static", bodypart: 0, mat: { a: -0.3344268798828125, b: -0.0204620361328125, c: -0.0204620361328125, d: 0.3344268798828125, tx: -1.15, ty: -37.85 } },
        { type: "static", bodypart: 3, mat: { a: 0.02471923828125, b: -0.3337860107421875, c: -0.3337860107421875, d: -0.0247039794921875, tx: 6.35, ty: -20.75 } }
      ],
      [
        { type: "static", bodypart: 3, mat: { a: -0.02471923828125, b: -0.3337860107421875, c: 0.3337860107421875, d: -0.0247039794921875, tx: 6.4, ty: -20.75 } },
        { type: "body", mat: { a: -0.3344268798828125, b: 0.0204620361328125, c: 0.0204620361328125, d: 0.3344268798828125, tx: -1.45, ty: -39.75 } },
        { type: "static", bodypart: 1, mat: { a: 0.19403076171875, b: -0.011871337890625, c: 0.017913818359375, d: 0.29266357421875, tx: 1.75, ty: -27.2 } },
        { type: "static", bodypart: 0, mat: { a: 0.3344268798828125, b: -0.0204620361328125, c: 0.0204620361328125, d: 0.3344268798828125, tx: 3.1, ty: -37.85 } },
        { type: "static", bodypart: 3, mat: { a: -0.02471923828125, b: -0.3337860107421875, c: 0.3337860107421875, d: -0.0247039794921875, tx: -4.4, ty: -20.75 } }
      ],
      [
        { type: "anim", anim: 3, offset: 0, loop: true, mat: { a: 0.2680206298828125, b: -0.1997222900390625, c: -0.1997222900390625, d: -0.2680206298828125, tx: -5.7, ty: -23.55 } },
        { type: "body", mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.95, ty: -39.85 } },
        { type: "static", bodypart: 5, mat: { a: -0.194427490234375, b: 0, c: 0, d: 0.329345703125, tx: -1.75, ty: -27.05 } },
        { type: "static", bodypart: 40, mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: -3.7, ty: -37.2 } },
        { type: "anim", anim: 3, offset: 0, loop: true, mat: { a: -0.2680206298828125, b: -0.1997222900390625, c: 0.1997222900390625, d: -0.2680206298828125, tx: 5.75, ty: -25.4 } }
      ],
      [
        { type: "anim", anim: 3, offset: 0, loop: true, bodypart: 3, mat: { a: -0.2680206298828125, b: -0.1997222900390625, c: 0.1997222900390625, d: -0.2680206298828125, tx: 6.8, ty: -23.55 } },
        { type: "body", mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.15, ty: -39.85 } },
        { type: "static", bodypart: 5, mat: { a: 0.194427490234375, b: 0, c: 0, d: 0.329345703125, tx: 2.85, ty: -27.05 } },
        { type: "static", bodypart: 40, mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 4.8, ty: -37.2 } },
        { type: "anim", anim: 3, offset: 0, loop: true, bodypart: 3, mat: { a: 0.2680206298828125, b: -0.1997222900390625, c: -0.1997222900390625, d: -0.2680206298828125, tx: -4.65, ty: -25.4 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: -6.4, y: -21.2 } },
        { type: "body", mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.8, ty: -40.1 } },
        { type: "static", bodypart: 0, mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: -3.85, ty: -37.95 } },
        { type: "static", bodypart: 36, mat: { a: -0.194427490234375, b: 0, c: 0, d: 0.329345703125, tx: -1.65, ty: -27.8 } },
        { type: "armroot", id: 1, pos: { x: 5.65, y: -21.2 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 8.55, y: -21.2 } },
        { type: "body", mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 1.35, ty: -40.1 } },
        { type: "static", bodypart: 0, mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 6, ty: -37.95 } },
        { type: "static", bodypart: 36, mat: { a: 0.194427490234375, b: 0, c: 0, d: 0.329345703125, tx: 3.8, ty: -27.8 } },
        { type: "armroot", id: 1, pos: { x: -3.5, y: -21.2 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: -6.4, y: -21.2 } },
        { type: "armroot", id: 1, pos: { x: 8, y: -21.2 } },
        { type: "body", mat: { a: 0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 0.8, ty: -40.1 } },
        { type: "static", bodypart: 0, mat: { a: -0.17022705078125, b: 0, c: 0, d: 0.3351287841796875, tx: -5.35, ty: -38.25 } },
        { type: "static", bodypart: 36, mat: { a: -0.0987548828125, b: 0, c: 0, d: 0.329345703125, tx: -4.25, ty: -28.1 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 8.55, y: -20.45 } },
        { type: "armroot", id: 1, pos: { x: -5.85, y: -20.45 } },
        { type: "body", mat: { a: -0.3351287841796875, b: 0, c: 0, d: 0.3351287841796875, tx: 1.35, ty: -40.1 } },
        { type: "static", bodypart: 0, mat: { a: 0.20745849609375, b: 0, c: 0, d: 0.3351287841796875, tx: 6.7, ty: -37.95 } },
        { type: "static", bodypart: 36, mat: { a: 0.120361328125, b: 0, c: 0, d: 0.329345703125, tx: 5.35, ty: -27.8 } }
      ]
    ]
  },
  {
    // Bubble
    torsomat: { a: 0.87811279296875, b: 0, c: 0, d: 0.87811279296875, tx: -0.7, ty: -3 },
    legx: [-5.1, 10.85],
    legy: [-11.25, -11.25],
    firemat: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 },
    charimgmat: { a: 0.126861572265625, b: 0, c: 0, d: 0.126861572265625, tx: -0.1, ty: -0.3 },
    burstmat: { a: 1.35589599609375, b: 0, c: 0, d: 1.2286834716796875, tx: 1.8, ty: -39.65 },
    defaultExpr: 0,
    mouthType: 0,
    frames: [
      [
        { type: "anim", anim: 0, offset: 15, loop: true, mat: { a: 1, b: 0, c: 0, d: 1, tx: -26.55, ty: -24.15 } },
        { type: "body", mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 2.9, ty: -42 } },
        { type: "static", bodypart: 36, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -15.75, ty: -28.25 } },
        { type: "static", bodypart: 0, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -9.25, ty: -44.2 } },
        { type: "static", bodypart: 0, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -24.95, ty: -43.95 } },
        { type: "anim", anim: 0, offset: 0, loop: true, mat: { a: 1, b: 0, c: 0, d: 1, tx: 20.95, ty: -26.15 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: -0.3739166259765625, b: -0.0296478271484375, c: -0.02886962890625, d: 0.3636322021484375, tx: -26.25, ty: -23.9 } },
        { type: "body", mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 2.35, ty: -42 } },
        { type: "dia", mat: { a: 1, b: 0, c: 0, d: 1, tx: -14.9, ty: -27.95 } },
        { type: "static", bodypart: 0, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -9.8, ty: -44.2 } },
        { type: "static", bodypart: 0, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -25.5, ty: -43.95 } },
        { type: "static", bodypart: 2, mat: { a: -0.3738250732421875, b: 0.0201416015625, c: 0.0196075439453125, d: 0.3635406494140625, tx: 23.75, ty: -23.85 } }
      ],
      [
        { type: "anim", anim: 0, offset: 15, loop: true, mat: { a: -1, b: 0, c: 0, d: 1, tx: 32.2, ty: -24.15 } },
        { type: "body", mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 2.75, ty: -42 } },
        { type: "static", bodypart: 36, mat: { a: 0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: 21.4, ty: -28.25 } },
        { type: "static", bodypart: 0, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 30.6, ty: -43.95 } },
        { type: "static", bodypart: 0, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 14.9, ty: -44.2 } },
        { type: "anim", anim: 0, offset: 0, loop: true, mat: { a: -1, b: 0, c: 0, d: 1, tx: -15.3, ty: -26.15 } }
      ],
      [
        { type: "static", bodypart: 2, mat: { a: 0.3739166259765625, b: -0.0296478271484375, c: 0.02886962890625, d: 0.3636322021484375, tx: 31.4, ty: -23.9 } },
        { type: "body", mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 2.8, ty: -42 } },
        { type: "dia", mat: { a: -1, b: 0, c: 0, d: 1, tx: 20.05, ty: -27.95 } },
        { type: "static", bodypart: 0, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 30.6, ty: -43.95 } },
        { type: "static", bodypart: 0, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 14.9, ty: -44.2 } },
        { type: "static", bodypart: 2, mat: { a: 0.3738250732421875, b: 0.0201416015625, c: -0.0196075439453125, d: 0.3635406494140625, tx: -18.6, ty: -23.85 } }
      ],
      [
        { type: "anim", anim: 1, offset: 0, loop: false, mat: { a: 1, b: 0, c: 0, d: 1, tx: -30.9, ty: -34.05 } },
        { type: "body", mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 1.9, ty: -42 } },
        { type: "static", bodypart: 36, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -16.75, ty: -28.25 } },
        { type: "static", bodypart: 0, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -25.95, ty: -43.95 } },
        { type: "static", bodypart: 0, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -10.25, ty: -44.2 } },
        { type: "anim", anim: 1, offset: 0, loop: false, mat: { a: -1, b: 0, c: 0, d: 1, tx: 18.65, ty: -34.6 } }
      ],
      [
        { type: "anim", anim: 1, offset: 0, loop: false, mat: { a: -1, b: 0, c: 0, d: 1, tx: 35.4, ty: -34.05 } },
        { type: "body", mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 2.6, ty: -42 } },
        { type: "static", bodypart: 36, mat: { a: 0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: 21.25, ty: -28.25 } },
        { type: "static", bodypart: 0, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 14.75, ty: -44.2 } },
        { type: "static", bodypart: 0, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 30.45, ty: -43.95 } },
        { type: "anim", anim: 1, offset: 0, loop: false, mat: { a: 1, b: 0, c: 0, d: 1, tx: -14.15, ty: -34.6 } }
      ],
      [
        { type: "static", bodypart: 3, mat: { a: 0.0090179443359375, b: -0.382843017578125, c: -0.3640899658203125, d: -0.0085601806640625, tx: -26.85, ty: -25.15 } },
        { type: "body", mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 1.9, ty: -42 } },
        { type: "static", bodypart: 36, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -16.75, ty: -28.25 } },
        { type: "static", bodypart: 0, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -25.95, ty: -43.95 } },
        { type: "static", bodypart: 0, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -10.25, ty: -44.2 } },
        { type: "static", bodypart: 3, mat: { a: 0.0090179443359375, b: -0.382843017578125, c: -0.3640899658203125, d: -0.0085601806640625, tx: 2.2, ty: -24.85 } }
      ],
      [
        { type: "static", bodypart: 3, mat: { a: -0.0090179443359375, b: -0.382843017578125, c: 0.3640899658203125, d: -0.0085601806640625, tx: 31.7, ty: -25.15 } },
        { type: "body", mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 2.95, ty: -42 } },
        { type: "static", bodypart: 36, mat: { a: 0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: 21.25, ty: -28.25 } },
        { type: "static", bodypart: 0, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 14.75, ty: -44.2 } },
        { type: "static", bodypart: 0, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 30.45, ty: -43.95 } },
        { type: "static", bodypart: 3, mat: { a: -0.0090179443359375, b: -0.382843017578125, c: 0.3640899658203125, d: -0.0085601806640625, tx: 2.65, ty: -23.8 } }
      ],
      [
        { type: "static", bodypart: 47, mat: { a: 0.606903076171875, b: 0, c: 0, d: 0.606903076171875, tx: 4.3, ty: -65.55 } }
      ],
      [
        { type: "static", bodypart: 47, mat: { a: 0.606903076171875, b: 0, c: 0, d: 0.606903076171875, tx: 4.3, ty: -65.55 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: -26.25, y: -22.9 } },
        { type: "body", mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 2.35, ty: -42 } },
        { type: "static", bodypart: 36, mat: { a: -0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: -16.3, ty: -28.25 } },
        { type: "static", bodypart: 0, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -25.5, ty: -43.95 } },
        { type: "static", bodypart: 0, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: -9.8, ty: -44.2 } },
        { type: "armroot", id: 1, pos: { x: 23.3, y: -22.9 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 29.35, y: -22.9 } },
        { type: "body", mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 2.35, ty: -42 } },
        { type: "static", bodypart: 36, mat: { a: 0.400299072265625, b: 0, c: 0, d: 0.400299072265625, tx: 21, ty: -28.25 } },
        { type: "static", bodypart: 0, mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 14.5, ty: -44.2 } },
        { type: "static", bodypart: 0, mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 30.2, ty: -43.95 } },
        { type: "armroot", id: 1, pos: { x: -20.2, y: -22.9 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: -27.95, y: -22.9 } },
        { type: "armroot", id: 1, pos: { x: 31.8, y: -22.9 } },
        { type: "body", mat: { a: 0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 2.35, ty: -42 } },
        { type: "static", bodypart: 36, mat: { a: -0.1955413818359375, b: 0, c: 0, d: 0.400299072265625, tx: -25.8, ty: -29.65 } },
        { type: "static", bodypart: 0, mat: { a: -0.193145751953125, b: 0, c: 0, d: 0.3648529052734375, tx: -30.55, ty: -43.05 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 31.05, y: -22.9 } },
        { type: "armroot", id: 1, pos: { x: -27, y: -22.9 } },
        { type: "body", mat: { a: -0.3648529052734375, b: 0, c: 0, d: 0.3648529052734375, tx: 2.35, ty: -42 } },
        { type: "static", bodypart: 36, mat: { a: 0.1955413818359375, b: 0, c: 0, d: 0.400299072265625, tx: 30.5, ty: -29.65 } },
        { type: "static", bodypart: 0, mat: { a: 0.193145751953125, b: 0, c: 0, d: 0.3648529052734375, tx: 35.25, ty: -43.05 } }
      ]
    ]
  },
  {
    // Lego Brick
    torsomat: { a: 0.2733306884765625, b: 0, c: 0, d: 0.273284912109375, tx: -26, ty: -49.75 },
    legx: [-7.9, 12.5],
    legy: [-12, -11.85],
    firemat: { a: -0.4046630859375, b: 0.0060882568359375, c: 0.006805419921875, d: 0.5772552490234375, tx: -1.15, ty: -51 },
    charimgmat: { a: 0.116455078125, b: 0, c: 0, d: 0.116455078125, tx: 0.4, ty: 20.05 },
    burstmat: { a: 1.35589599609375, b: 0, c: 0, d: 0.9438323974609375, tx: 2.55, ty: -22.5 },
    defaultExpr: 0,
    mouthType: 0,
    frames: [
      [
        { type: "body", mat: { a: 1, b: 0, c: 0, d: 1, tx: 95.1, ty: 139.35 } },
        { type: "static", bodypart: 48, mat: { a: 1, b: 0, c: 0, d: 1, tx: 93.2, ty: 25.95 } },
        { type: "static", bodypart: 49, mat: { a: -2.3869781494140625, b: 0, c: 0.0482177734375, d: 2.29827880859375, tx: 96.75, ty: 73.45 } }
      ],
      [
        { type: "body", mat: { a: 1, b: 0, c: 0, d: 1, tx: 95.1, ty: 139.35 } },
        { type: "dia", mat: { a: 4.6165771484375, b: 0, c: 0, d: 4.6165771484375, tx: 97.65, ty: 82.35 } },
        { type: "static", bodypart: 48, mat: { a: 1, b: 0, c: 0, d: 1, tx: 93.2, ty: 25.95 } }
      ],
      [
        { type: "body", mat: { a: -1, b: 0, c: 0, d: 1, tx: 95.1, ty: 139.35 } },
        { type: "static", bodypart: 48, mat: { a: -1, b: 0, c: 0, d: 1, tx: 93.2, ty: 25.95 } },
        { type: "static", bodypart: 49, mat: { a: 2.3869781494140625, b: 0, c: -0.0482177734375, d: 2.29827880859375, tx: 93.45, ty: 73.45 } }
      ],
      [
        { type: "body", mat: { a: 1, b: 0, c: 0, d: 1, tx: 95.1, ty: 139.35 } },
        { type: "dia", mat: { a: -4.6165771484375, b: 0, c: 0, d: 4.6165771484375, tx: 97.65, ty: 82.35 } },
        { type: "static", bodypart: 48, mat: { a: 1, b: 0, c: 0, d: 1, tx: 93.2, ty: 25.95 } }
      ],
      [
        { type: "body", mat: { a: 1, b: 0, c: 0, d: 1, tx: 95.1, ty: 139.35 } },
        { type: "static", bodypart: 48, mat: { a: 1, b: 0, c: 0, d: 1, tx: 93.2, ty: 25.95 } },
        { type: "static", bodypart: 50, mat: { a: -2.0886993408203125, b: 0, c: -0.0366058349609375, d: 1.745025634765625, tx: 97.05, ty: 76.75 } }
      ],
      [
        { type: "body", mat: { a: 1, b: 0, c: 0, d: 1, tx: 95.1, ty: 139.35 } },
        { type: "static", bodypart: 48, mat: { a: 1, b: 0, c: 0, d: 1, tx: 93.2, ty: 25.95 } },
        { type: "static", bodypart: 50, mat: { a: 2.0886993408203125, b: 0, c: 0.0366058349609375, d: 1.745025634765625, tx: 89.1, ty: 77.65 } }
      ],
      [],
      [],
      [
        { type: "body", mat: { a: 1, b: 0, c: 0, d: 1, tx: 95.1, ty: 139.35 } },
        { type: "static", bodypart: 40, mat: { a: 1.5439453125, b: 0, c: 0, d: 1.5439453125, tx: 51.85, ty: 40.95 } },
        { type: "static", bodypart: 40, mat: { a: -1.5439453125, b: 0, c: 0, d: 1.5439453125, tx: 134.55, ty: 40.95 } },
        { type: "static", bodypart: 5, mat: { a: -2.0886993408203125, b: 0, c: -0.0366058349609375, d: 1.745025634765625, tx: 93, ty: 77.2 } }
      ],
      [
        { type: "body", mat: { a: 1, b: 0, c: 0, d: 1, tx: 95.1, ty: 139.35 } },
        { type: "static", bodypart: 40, mat: { a: 1.5439453125, b: 0, c: 0, d: 1.5439453125, tx: 58.25, ty: 40.95 } },
        { type: "static", bodypart: 40, mat: { a: -1.5439453125, b: 0, c: 0, d: 1.5439453125, tx: 140.95, ty: 40.95 } },
        { type: "static", bodypart: 5, mat: { a: 2.0886993408203125, b: 0, c: 0.0366058349609375, d: 1.745025634765625, tx: 99.8, ty: 77.2 } }
      ],
      [],
      [],
      [],
      []
    ]
  },
  {
    // Waffle
    torsomat: { a: 0.2268524169921875, b: 0, c: 0, d: 0.22625732421875, tx: -23.45, ty: -42.7 },
    legx: [-10.15, 16],
    legy: [-12.25, -11.7],
    firemat: { a: -0.865478515625, b: 0.007171630859375, c: 0.014556884765625, d: 0.680572509765625, tx: 0, ty: -60.15 },
    charimgmat: { a: -0.06329345703125, b: 0, c: 0, d: 0.0632781982421875, tx: -0.6, ty: 18.65 },
    burstmat: { a: 1.55078125, b: 0, c: 0, d: 1.09588623046875, tx: 1.55, ty: -36.75 },
    defaultExpr: 0,
    mouthType: 1,
    frames: [
      [
        { type: "body", mat: { a: -1, b: 0, c: 0, d: 1, tx: 101.7, ty: 139.35 } },
        { type: "static", bodypart: 39, mat: { a: -1.33612060546875, b: 0, c: 0.0269927978515625, d: 1.2864837646484375, tx: 52.7, ty: -19.15 } },
        { type: "static", bodypart: 39, mat: { a: -1.33612060546875, b: 0, c: 0.0269927978515625, d: 1.2864837646484375, tx: 153.3, ty: -19.15 } },
        { type: "static", bodypart: 51, mat: { a: -1.81903076171875, b: 0, c: 0.0367431640625, d: 1.7514495849609375, tx: 99.65, ty: 52.8 } }
      ],
      [
        { type: "body", mat: { a: -1, b: 0, c: 0, d: 1, tx: 101.7, ty: 139.35 } },
        { type: "static", bodypart: 39, mat: { a: -1.33612060546875, b: 0, c: 0.0269927978515625, d: 1.2864837646484375, tx: 52.7, ty: -19.15 } },
        { type: "static", bodypart: 39, mat: { a: -1.33612060546875, b: 0, c: 0.0269927978515625, d: 1.2864837646484375, tx: 153.3, ty: -19.15 } },
        { type: "dia", mat: { a: 4.6165771484375, b: 0, c: 0, d: 4.6165771484375, tx: 104.55, ty: 58.9 } }
      ],
      [
        { type: "body", mat: { a: 1, b: 0, c: 0, d: 1, tx: 105.2, ty: 139.35 } },
        { type: "static", bodypart: 39, mat: { a: 1.33612060546875, b: 0, c: -0.0269927978515625, d: 1.2864837646484375, tx: 53.6, ty: -19.15 } },
        { type: "static", bodypart: 39, mat: { a: 1.33612060546875, b: 0, c: -0.0269927978515625, d: 1.2864837646484375, tx: 154.2, ty: -19.15 } },
        { type: "static", bodypart: 51, mat: { a: 1.81903076171875, b: 0, c: -0.0367431640625, d: 1.7514495849609375, tx: 107.25, ty: 52.8 } }
      ],
      [
        { type: "body", mat: { a: 1, b: 0, c: 0, d: 1, tx: 105.2, ty: 139.35 } },
        { type: "static", bodypart: 39, mat: { a: -1.33612060546875, b: 0, c: 0.0269927978515625, d: 1.2864837646484375, tx: 52.7, ty: -19.15 } },
        { type: "static", bodypart: 39, mat: { a: -1.33612060546875, b: 0, c: 0.0269927978515625, d: 1.2864837646484375, tx: 153.3, ty: -19.15 } },
        { type: "dia", mat: { a: -4.6165771484375, b: 0, c: 0, d: 4.6165771484375, tx: 104.55, ty: 58.9 } }
      ],
      [
        { type: "body", mat: { a: -1, b: 0, c: 0, d: 1, tx: 101.7, ty: 139.35 } },
        { type: "static", bodypart: 39, mat: { a: -1.33612060546875, b: 0, c: 0.0269927978515625, d: 1.2864837646484375, tx: 52.7, ty: -19.15 } },
        { type: "static", bodypart: 39, mat: { a: -1.33612060546875, b: 0, c: 0.0269927978515625, d: 1.2864837646484375, tx: 153.3, ty: -19.15 } },
        { type: "static", bodypart: 52, mat: { a: -1.81903076171875, b: 0, c: 0.0367431640625, d: 1.7514495849609375, tx: 99.65, ty: 52.8 } }
      ],
      [
        { type: "body", mat: { a: 1, b: 0, c: 0, d: 1, tx: 105.2, ty: 139.35 } },
        { type: "static", bodypart: 39, mat: { a: -1.33612060546875, b: 0, c: 0.0269927978515625, d: 1.2864837646484375, tx: 52.7, ty: -19.15 } },
        { type: "static", bodypart: 39, mat: { a: -1.33612060546875, b: 0, c: 0.0269927978515625, d: 1.2864837646484375, tx: 153.3, ty: -19.15 } },
        { type: "static", bodypart: 52, mat: { a: 1.81903076171875, b: 0, c: -0.0367431640625, d: 1.7514495849609375, tx: 106.45, ty: 52.8 } }
      ],
      [],
      [],
      [
        { type: "body", mat: { a: -1, b: 0, c: 0, d: 1, tx: 101.7, ty: 139.35 } },
        { type: "static", bodypart: 40, mat: { a: 1.5439453125, b: 0, c: 0, d: 1.5439453125, tx: 65, ty: -6.75 } },
        { type: "static", bodypart: 40, mat: { a: -1.5439453125, b: 0, c: 0, d: 1.5439453125, tx: 147.7, ty: -3.45 } },
        { type: "static", bodypart: 56, mat: { a: 1.81903076171875, b: 0, c: -0.0367431640625, d: 1.7514495849609375, tx: 106.45, ty: 52.8 } }
      ],
      [
        { type: "body", mat: { a: 1, b: 0, c: 0, d: 1, tx: 105.2, ty: 139.35 } },
        { type: "static", bodypart: 40, mat: { a: 1.5439453125, b: 0, c: 0, d: 1.5439453125, tx: 54.95, ty: -3.45 } },
        { type: "static", bodypart: 40, mat: { a: -1.5439453125, b: 0, c: 0, d: 1.5439453125, tx: 137.65, ty: -3.45 } },
        { type: "static", bodypart: 56, mat: { a: -1.81903076171875, b: 0, c: 0.0367431640625, d: 1.7514495849609375, tx: 96.2, ty: 52.8 } }
      ],
      [],
      [],
      [],
      []
    ]
  },
  {
    // Tune
    torsomat: { a: 0.87811279296875, b: 0, c: 0, d: 0.87811279296875, tx: -0.7, ty: -3 },
    legx: [-4.45, 7.7],
    legy: [-11.25, -11.25],
    firemat: { a: -0.34619140625, b: 0.0060882568359375, c: 0.0058135986328125, d: 0.5772552490234375, tx: 1.45, ty: -53.55 },
    charimgmat: { a: -0.112091064453125, b: 0, c: 0, d: 0.112091064453125, tx: 8.05, ty: -5.8 },
    burstmat: { a: 0.794342041015625, b: 0, c: 0, d: 0.952484130859375, tx: 1.55, ty: -29.75 },
    defaultExpr: 0,
    mouthType: 0,
    frames: [
      [
        { type: "static", bodypart: 57, mat: { a: -0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: 29.95, ty: -51.95 } }
      ],
      [
        { type: "anim", anim: 4, offset: 0, loop: true, mat: { a: 1, b: 0, c: 0, d: 1, tx: 2.5, ty: -2 } }
      ],
      [
        { type: "static", bodypart: 57, mat: { a: 0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: -25.35, ty: -51.95 } }
      ],
      [
        { type: "anim", anim: 4, offset: 0, loop: true, mat: { a: -1, b: 0, c: 0, d: 1, tx: 2.25, ty: -2 } }
      ],
      [
        { type: "static", bodypart: 57, mat: { a: -0.305023193359375, b: -0.0296630859375, c: -0.0296630859375, d: 0.305023193359375, tx: 32.55, ty: -49.1 } }
      ],
      [
        { type: "static", bodypart: 57, mat: { a: 0.3050384521484375, b: -0.0294647216796875, c: 0.0294647216796875, d: 0.3050384521484375, tx: -28, ty: -49.1 } }
      ],
      [
        { type: "static", bodypart: 58, mat: { a: -0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: 29.95, ty: -51.95 } }
      ],
      [
        { type: "static", bodypart: 58, mat: { a: 0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: -25.05, ty: -51.95 } }
      ],
      [
        { type: "static", bodypart: 59, mat: { a: -0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: 29.95, ty: -51.95 } }
      ],
      [
        { type: "static", bodypart: 59, mat: { a: 0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: -25.05, ty: -51.95 } }
      ],
      [
        { type: "static", bodypart: 60, mat: { a: -0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: 29.95, ty: -51.95 } },
        { type: "armroot", id: 0, pos: { x: -12, y: -14.25 } },
        { type: "armroot", id: 1, pos: { x: 14.6, y: -15.75 } }
      ],
      [
        { type: "static", bodypart: 60, mat: { a: 0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: -25.05, ty: -51.95 } },
        { type: "armroot", id: 0, pos: { x: -10.85, y: -15.75 } },
        { type: "armroot", id: 1, pos: { x: 15.75, y: -14.25 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: -3.6, y: -15.6 } },
        { type: "static", bodypart: 61, mat: { a: -0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: 29.95, ty: -51.95 } },
        { type: "armroot", id: 1, pos: { x: -15.6, y: -15.6 } }
      ],
      [
        { type: "armroot", id: 0, pos: { x: 6.95, y: -15.6 } },
        { type: "static", bodypart: 61, mat: { a: 0.3065643310546875, b: 0, c: 0, d: 0.3065643310546875, tx: -25.05, ty: -51.95 } },
        { type: "armroot", id: 1, pos: { x: 8.05, y: -15.6 } }
      ]
    ]
  },
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {
    burstmat: { a: 1.7895660400390625, b: 0, c: 0, d: 1.207855224609375, tx: 0.8, ty: -39.25 },
    charimgmat: { a: 0.3, b: 0, c: 0, d: 0.3, tx: 0, ty: 0 }
  },
  {
    burstmat: { a: 0.952056884765625, b: 0, c: 0, d: 1.207855224609375, tx: 0.15, ty: -39.65 },
    charimgmat: { a: 0.3, b: 0, c: 0, d: 0.3, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.34619140625, b: 0.0040283203125, c: 0.0058135986328125, d: 0.3830718994140625, tx: -1.25, ty: -27.6 },
    burstmat: { a: 1.0710906982421875, b: 0, c: 0, d: 0.906219482421875, tx: -0.65, ty: -22.85 },
    charimgmat: { a: 0.5, b: 0, c: 0, d: 0.5, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.408905029296875, b: 0.0047607421875, c: 0.006866455078125, d: 0.452484130859375, tx: -1.4, ty: -35.25 },
    burstmat: { a: 1.4060821533203125, b: 0, c: 0, d: 1.207855224609375, tx: -0.75, ty: -31.25 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.39605712890625, b: 0.0052490234375, c: 0.0020904541015625, d: 0.15771484375, tx: 0.25, ty: -9.1 },
    burstmat: { a: 1.1382598876953125, b: 0, c: 0, d: 0.3983306884765625, tx: 0.1, ty: -8.45 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.4046478271484375, b: 0.00537109375, c: 0.00616455078125, d: 0.467559814453125, tx: 0, ty: -36.95 },
    burstmat: { a: 1.1150665283203125, b: 0, c: 0, d: 0.85455322265625, tx: -0.1, ty: -28.65 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.4213104248046875, b: 0.0055694580078125, c: 0.003631591796875, d: 0.2767333984375, tx: 0, ty: -20.25 },
    burstmat: { a: 1.139404296875, b: 0, c: 0, d: 0.77362060546875, tx: 0.95, ty: -20.2 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.3904876708984375, b: 0.0051422119140625, c: 0.00531005859375, d: 0.406890869140625, tx: -0.25, ty: -30.05 },
    burstmat: { a: 1.079010009765625, b: 0, c: 0, d: 0.906219482421875, tx: 0.1, ty: -27.5 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.5459136962890625, b: 0.0071868896484375, c: 0.0072479248046875, d: 0.5560760498046875, tx: -0.3, ty: -42.4 },
    burstmat: { a: 1.5228729248046875, b: 0, c: 0, d: 1.328765869140625, tx: -0.35, ty: -40.85 },
    charimgmat: { a: 0.3, b: 0, c: 0, d: 0.3, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.371612548828125, b: 0.0048828125, c: 0.0054473876953125, d: 0.4189453125, tx: -0.15, ty: -31.25 },
    burstmat: { a: 1.0906829833984375, b: 0, c: 0, d: 0.9201812744140625, tx: 0.7, ty: -30 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.390960693359375, b: 0.005126953125, c: 0.0054473876953125, d: 0.4189453125, tx: 0.1, ty: -33.75 },
    burstmat: { a: 1.031402587890625, b: 0, c: 0, d: 0.855499267578125, tx: 0.95, ty: -30.85 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.2586822509765625, b: 0.003387451171875, c: 0.0032958984375, d: 0.253692626953125, tx: 0.1, ty: -20.9 },
    burstmat: { a: 0.7251434326171875, b: 0, c: 0, d: 0.5919189453125, tx: 0.15, ty: -19.4 },
    charimgmat: { a: 0.3, b: 0, c: 0, d: 0.3, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.1841278076171875, b: 0.002410888671875, c: 0.0059814453125, d: 0.46124267578125, tx: -0.05, ty: -36.8 },
    burstmat: { a: 0.6854095458984375, b: 0, c: 0, d: 1.010223388671875, tx: 0.55, ty: -33.6 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.720306396484375, b: 0.009429931640625, c: 0.0023193359375, d: 0.1834716796875, tx: -0.25, ty: -10.55 },
    burstmat: { a: 1.5430145263671875, b: 0, c: 0, d: 0.371612548828125, tx: -0.35, ty: -8.2 },
    charimgmat: { a: 0.3, b: 0, c: 0, d: 0.3, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.2956695556640625, b: 0.00384521484375, c: 0.004364013671875, d: 0.34716796875, tx: -0.25, ty: -27.4 },
    burstmat: { a: 0.8918304443359375, b: 0, c: 0, d: 0.7522430419921875, tx: 0.15, ty: -24.4 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.27447509765625, b: 0.0035400390625, c: 0.006561279296875, d: 0.5229644775390625, tx: -0.25, ty: -29.7 },
    burstmat: { a: 0.8918304443359375, b: 0, c: 0, d: 0.94287109375, tx: 0.15, ty: -18.1 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.3960723876953125, b: 0.0052490234375, c: 0.0020904541015625, d: 0.15771484375, tx: 0.25, ty: -9.1 },
    burstmat: { a: 1.13824462890625, b: 0, c: 0, d: 0.3983154296875, tx: 0.1, ty: -8.45 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.6592254638671875, b: 0.0086212158203125, c: 0.0023193359375, d: 0.18426513671875, tx: 0.75, ty: -10.5 },
    burstmat: { a: 1.5430145263671875, b: 0, c: 0, d: 0.371612548828125, tx: -0.35, ty: -6.95 },
    charimgmat: { a: 0.3, b: 0, c: 0, d: 0.3, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.23907470703125, b: 0.00311279296875, c: 0.0062713623046875, d: 0.49932861328125, tx: -0.4, ty: -38.95 },
    burstmat: { a: 0.784454345703125, b: 0, c: 0, d: 0.9769287109375, tx: 0.15, ty: -28.35 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.39166259765625, b: 0.005096435546875, c: 0.00311279296875, d: 0.249603271484375, tx: -0.3, ty: -18.85 },
    burstmat: { a: 1.0699005126953125, b: 0, c: 0, d: 0.577911376953125, tx: 0.15, ty: -16.85 },
    charimgmat: { a: 0.4, b: 0, c: 0, d: 0.4, tx: 0, ty: 0 }
  },
  {
    firemat: { a: -0.5117645263671875, b: 0.00665283203125, c: 0.0527801513671875, d: 4.22344970703125, tx: -3.45, ty: -356.65 },
    burstmat: { a: 1.5361328125, b: 0, c: 0, d: 7.588623046875, tx: 0, ty: -286.65 },
    charimgmat: { a: 0.1, b: 0, c: 0, d: 0.1, tx: 0, ty: 0 }
  }
];
let selectedBg = 0;
let recover = false;
let charsAtEnd = 0;
let char = new Array(1);
let currentLevel = -1;
let control = 0;
let cutScene = 0;
let charDepth = 0;
let cameraX = 0;
let cameraY = 0;
let menuScreen = -1;
let playingLevelpack = false;
let myLevel;
let myLevelChars;
let myLevelInfo;
let cardinal = [[0, -1], [0, 1], [-1, 0], [1, 0]];
let diagonal = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
let bgXScale = 0;
let bgYScale = 0;
let currentLevelDisplayName = "";
let tileShadows;
let tileBorders;
let charDepths = [];
let tileDepths;
let doorLightX = [
  [27.5],
  [15, 40],
  [10, 27.5, 45],
  [10, 21.75, 33.25, 45],
  [4, 16.25, 27.5, 38.75, 50],
  [4, 14, 23, 32, 41, 50]
];
let doorLightFade = [];
let doorLightFadeDire = [];
function mapRange(value, min1, max1, min2, max2) {
  return min2 + (value - min1) / (max1 - min1) * (max2 - min2);
}
let imgBgs = new Array(12);
let svgTiles = new Array(blockProperties.length);
let svgLevers = new Array(6);
let svgShadows = new Array(19);
let svgTileBorders = new Array(38);
let svgChars = new Array(charD.length);
let svgBodyParts = new Array(63);
let svgHPRCBubble = new Array(5);
let svgCSBubble;
let svgHPRCCrank;
let svgCoin;
let svgCoinGet = new Array(11);
let svgFire = new Array(18);
let svgBurst = new Array(13);
let svgAcidDrop = new Array(9);
let svgIceCubeMelt;
let svgCharsVB = new Array(charD.length);
let svgTilesVB = new Array(blockProperties.length);
let svgMenu0;
let svgMenu2;
let svgMenu6;
let svgMenu2border;
let svgMenu2borderimg;
let preMenuBG;
let svgTools = new Array(12);
function createImage(base64) {
  let img = new imageFunc();
  img.src = base64;
  return img;
}
function getVB(base64) {
  let svgString = atob(base64.split(",")[1]);
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : null;
  return viewBox.split(" ").map(Number);
}
async function loadingScreen(file) {
  ctx.fillStyle = "#999966";
  ctx.fillRect(0, 0, cwidth, cheight);
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "30px Helvetica";
  ctx.fillText("Loading...", cwidth / 2, cheight / 2);
  if (file.startsWith("loadedLevels=\r\n"))
    file = file.slice(17);
  levelsString = file;
  loadLevels();
  svgCSBubble = createImage(resourceData["ui/csbubble/dia.svg"]);
  svgHPRCCrank = createImage(resourceData["entities/e0035crank.svg"]);
  svgCoin = createImage(resourceData["wintoken.svg"]);
  svgIceCubeMelt = createImage(resourceData["effects/icecubemelt.svg"]);
  svgIceCubeMelt = createImage(resourceData["effects/icecubemelt.svg"]);
  for (let i = 0; i < imgBgs.length; i++) {
    imgBgs[i] = createImage(resourceData["bg/bg" + i.toString().padStart(4, "0") + ".png"]);
  }
  for (let i = 0; i < blockProperties.length; i++) {
    let id = i.toString().padStart(4, "0");
    if (blockProperties[i][16] == 1 || blockProperties[i][15] && blockProperties[i][16] == 0) {
      svgTiles[i] = createImage(resourceData["blocks/b" + id + ".svg"]);
      svgTilesVB[i] = getVB(svgTiles[i].src);
    } else if (blockProperties[i][16] > 1) {
      svgTiles[i] = new Array(blockProperties[i][16]);
      svgTilesVB[i] = new Array(blockProperties[i][16]);
      for (let j = 0; j < svgTiles[i].length; j++) {
        svgTiles[i][j] = createImage(
          resourceData["blocks/b" + id + "f" + j.toString().padStart(4, "0") + ".svg"]
        );
        svgTilesVB[i][j] = getVB(svgTiles[i][j].src);
      }
    }
  }
  for (let i = 0; i < svgLevers.length; i++) {
    svgLevers[i] = createImage(resourceData["blocks/b" + i.toString().padStart(2, "0") + "lever.svg"]);
  }
  for (let i = 0; i < svgShadows.length; i++) {
    svgShadows[i] = createImage(resourceData["shadows/s" + i.toString().padStart(4, "0") + ".svg"]);
  }
  for (let i = 0; i < svgTileBorders.length; i++) {
    svgTileBorders[i] = createImage(resourceData["borders/tb" + i.toString().padStart(4, "0") + ".svg"]);
  }
  for (let i = 0; i < charD.length; i++) {
    let id = i.toString().padStart(4, "0");
    if (charD[i][7] < 1)
      continue;
    else if (charD[i][7] == 1) {
      svgChars[i] = createImage(resourceData["entities/e" + id + ".svg"]);
      svgCharsVB[i] = getVB(svgChars[i].src);
    } else {
      svgChars[i] = new Array(charD[i][7]);
      svgCharsVB[i] = new Array(charD[i][7]);
      for (let j = 0; j < svgChars[i].length; j++) {
        svgChars[i][j] = createImage(
          resourceData["entities/e" + id + "f" + j.toString().padStart(4, "0") + ".svg"]
        );
        svgCharsVB[i][j] = getVB(svgChars[i][j].src);
      }
    }
  }
  for (let i = 0; i < svgBodyParts.length; i++) {
    svgBodyParts[i] = createImage(resourceData["bodyparts/bp" + i.toString().padStart(4, "0") + ".svg"]);
  }
  for (let i = 0; i < svgHPRCBubble.length; i++) {
    svgHPRCBubble[i] = createImage(
      resourceData["ui/hprcbubble/hprcbubble" + i.toString().padStart(4, "0") + ".svg"]
    );
  }
  for (let i = 0; i < svgCoinGet.length; i++) {
    svgCoinGet[i] = createImage(resourceData["effects/wtgetf" + i.toString().padStart(4, "0") + ".svg"]);
  }
  for (let i = 0; i < svgFire.length; i++) {
    svgFire[i] = createImage(resourceData["effects/fire" + i.toString().padStart(4, "0") + ".svg"]);
  }
  for (let i = 0; i < svgBurst.length; i++) {
    svgBurst[i] = createImage(resourceData["effects/burst" + i.toString().padStart(4, "0") + ".svg"]);
  }
  for (let i = 0; i < svgAcidDrop.length; i++) {
    svgAcidDrop[i] = createImage(resourceData["effects/aciddrop" + i.toString().padStart(4, "0") + ".svg"]);
  }
  svgMenu0 = createImage(resourceData["menu0.svg"]);
  svgMenu2 = createImage(resourceData["menu2.svg"]);
  svgMenu6 = createImage(resourceData["menu6.svg"]);
  svgMenu2border = createImage(resourceData["menu2border.svg"]);
  svgMenu2borderimg = createImage(resourceData["menu2borderimg.png"]);
  preMenuBG = createImage(resourceData["premenubg.png"]);
  for (let i = 0; i < svgTools.length; i++) {
    svgTools[i] = createImage(resourceData["lc/tool" + i.toString().padStart(4, "0") + ".svg"]);
  }
}
async function renderImage(ctxUsing, imageClass, file, createCanvasUsing) {
  ctx = ctxUsing;
  imageFunc = imageClass;
  createCanvas = createCanvasUsing;
  await loadingScreen(file);
  setup(createCanvas);
}
function resetLevel() {
  tileDepths = [[], [], [], []];
  if (playMode == 2) {
    charCount = myLevelChars[1].length;
    levelWidth = myLevel[1][0].length;
    levelHeight = myLevel[1].length;
    copyLevel(myLevel[1]);
    char = new Array(charCount);
    charCount2 = 0;
    for (let i = 0; i < charCount; i++) {
      let id = myLevelChars[1][i][0];
      char[i] = new Character(
        id,
        myLevelChars[1][i][1] * 30,
        myLevelChars[1][i][2] * 30,
        70 + i * 40,
        400 - i * 30,
        myLevelChars[1][i][3],
        charD[id][0],
        charD[id][1],
        charD[id][2],
        charD[id][2],
        charD[id][3],
        charD[id][4],
        charD[id][6],
        charD[id][8],
        id < 35 ? charModels[id].defaultExpr : 0
      );
      if (char[i].charState == 9) {
        char[i].expr = 1;
        char[i].dire = 2;
        char[i].frame = 1;
        char[i].legdire = 0;
        char[i].diaMouthFrame = 0;
      } else {
        char[i].expr = charModels[char[i].id].defaultExpr;
      }
      if (char[i].charState >= 9)
        charCount2++;
      if (char[i].charState == 3 || char[i].charState == 4) {
        char[i].speed = myLevelChars[1][i][4];
        char[i].motionString = generateMS(myLevelChars[1][i]);
      }
    }
    currentLevelDisplayName = myLevelInfo.name;
  } else if (playMode == 3) {
    charCount = myLevelChars[1].length;
    levelWidth = myLevel[1][0].length;
    levelHeight = myLevel[1].length;
    copyLevel(myLevel[1]);
    char = new Array(charCount);
    charCount2 = 0;
    for (let i = 0; i < charCount; i++) {
      let id = myLevelChars[1][i][0];
      char[i] = new Character(
        id,
        myLevelChars[1][i][1] * 30,
        myLevelChars[1][i][2] * 30,
        70 + i * 40,
        400 - i * 30,
        myLevelChars[1][i][3],
        charD[id][0],
        charD[id][1],
        charD[id][2],
        charD[id][2],
        charD[id][3],
        charD[id][4],
        charD[id][6],
        charD[id][8],
        id < 35 ? charModels[id].defaultExpr : 0
      );
      if (char[i].charState == 9) {
        char[i].expr = 1;
        char[i].dire = 2;
        char[i].frame = 1;
        char[i].legdire = 0;
        char[i].diaMouthFrame = 0;
      } else {
        char[i].expr = charModels[char[i].id].defaultExpr;
      }
      if (char[i].charState >= 9)
        charCount2++;
      if (char[i].charState == 3 || char[i].charState == 4) {
        char[i].speed = myLevelChars[1][i][4];
        char[i].motionString = generateMS(myLevelChars[1][i]);
      }
    }
    currentLevelDisplayName = myLevelInfo.name;
  } else {
    charCount = startLocations[currentLevel].length;
    levelWidth = levels[currentLevel][0].length;
    levelHeight = levels[currentLevel].length;
    // if (currentLevel === 0 && !playingLevelpack)
    //   levels[0][13][29] = levels[0][13][30] = levels[0][13][31] = quirksMode ? 16 : 1;
    copyLevel(levels[currentLevel]);
    charCount2 = 0;
    for (let i = 0; i < charCount; i++) {
      let id = startLocations[currentLevel][i][0];
      char[i] = new Character(
        id,
        startLocations[currentLevel][i][1] * 30 + startLocations[currentLevel][i][2] * 30 / 100,
        startLocations[currentLevel][i][3] * 30 + startLocations[currentLevel][i][4] * 30 / 100,
        70 + i * 40,
        400 - i * 30,
        startLocations[currentLevel][i][5],
        charD[id][0],
        charD[id][1],
        charD[id][2],
        charD[id][2],
        charD[id][3],
        charD[id][4],
        charD[id][6],
        charD[id][8],
        id < 35 ? charModels[id].defaultExpr : 0
      );
      if (char[i].charState == 9) {
        char[i].expr = 1;
        char[i].dire = 2;
        char[i].frame = 1;
        char[i].legdire = 0;
        char[i].diaMouthFrame = 0;
      } else {
        char[i].expr = charModels[char[i].id].defaultExpr;
      }
      if (char[i].charState >= 9)
        charCount2++;
      if (char[i].charState == 3 || char[i].charState == 4) {
        char[i].speed = startLocations[currentLevel][i][6][0] * 10 + startLocations[currentLevel][i][6][1];
        char[i].motionString = startLocations[currentLevel][i][6];
      }
    }
    if (currentLevel > 99) {
      currentLevelDisplayName = "B" + (currentLevel - 99).toString().padStart(2, "0") + ". " + levelName[currentLevel];
    } else {
      currentLevelDisplayName = (currentLevel + 1).toString().padStart(3, "0") + ". " + levelName[currentLevel];
    }
  }
  charDepths = new Array((charCount + 1) * 2).fill(-1);
  for (let i = 0; i < charCount; i++)
    charDepths[i * 2] = Math.floor(charCount - i - 1);
  charDepths[(charCount - 1) * 2] = -1;
  charDepths[charCount * 2] = 0;
  charDepth = levelWidth * levelHeight + charCount * 2;
  getTileDepths();
  calculateShadowsAndBorders();
  osc1.width = Math.floor(levelWidth * 30 * pixelRatio);
  osc1.height = Math.floor(levelHeight * 30 * pixelRatio);
  osctx1.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  osc2.width = Math.floor(levelWidth * 30 * pixelRatio);
  osc2.height = Math.floor(levelHeight * 30 * pixelRatio);
  osctx2.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  drawStaticTiles();
  recover = false;
  charsAtEnd = 0;
  control = 0;
  cutScene = 0;
  bgXScale = Math.max(((levelWidth - 32) * 10 + 960) / 9.6, 100);
  bgYScale = Math.max(((levelHeight - 18) * 10 + 540) / 5.4, 100);
  drawLevelBG();
  cameraX = Math.min(Math.max(char[0].x - 480, 0), levelWidth * 30 - 960);
  cameraY = Math.min(Math.max(char[0].y - 270, 0), levelHeight * 30 - 540);
  gotThisCoin = false;
  doorLightFade = new Array(charCount2).fill(0);
  doorLightFadeDire = new Array(charCount2).fill(0);
}
function copyLevel(thatLevel) {
  thisLevel = new Array(thatLevel.length);
  tileFrames = new Array(thatLevel.length);
  tileShadows = new Array(thatLevel.length);
  tileBorders = new Array(thatLevel.length);
  for (let y = 0; y < levelHeight; y++) {
    thisLevel[y] = new Array(thatLevel[y].length);
    tileFrames[y] = new Array(thatLevel[y].length);
    tileShadows[y] = new Array(thatLevel[y].length);
    tileBorders[y] = new Array(thatLevel[y].length);
    for (let x = 0; x < levelWidth; x++) {
      thisLevel[y][x] = thatLevel[y][x];
      let sw = Math.ceil(blockProperties[thisLevel[y][x]][11] / 6);
      tileFrames[y][x] = { cf: 0, playing: false, rotation: sw == 1 ? -60 : sw == 2 ? 60 : 0 };
      tileShadows[y][x] = [];
      tileBorders[y][x] = [];
    }
  }
}
function drawStaticTiles() {
  for (let j = 0; j < tileDepths[0].length; j++) {
    addTileMovieClip(tileDepths[0][j].x, tileDepths[0][j].y, osctx1);
  }
  for (let y = 0; y < levelHeight; y++) {
    for (let x = 0; x < levelWidth; x++) {
      for (let i = 0; i < tileShadows[y][x].length; i++) {
        osctx2.drawImage(svgShadows[tileShadows[y][x][i] - 1], x * 30, y * 30);
      }
      for (let i = 0; i < tileBorders[y][x].length; i++) {
        osctx2.drawImage(svgTileBorders[tileBorders[y][x][i] - 1], x * 30, y * 30);
      }
    }
  }
}
function drawLevelBG() {
  let bgScale = Math.max(bgXScale, bgYScale);
  osc4.width = Math.floor(bgScale / 100 * cwidth * pixelRatio);
  osc4.height = Math.floor(bgScale / 100 * cheight * pixelRatio);
  osctx4.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  osctx4.drawImage(
    imgBgs[playMode >= 2 ? selectedBg : bgs[currentLevel]],
    0,
    0,
    bgScale / 100 * cwidth,
    bgScale / 100 * cheight
  );
}
function drawLevel() {
  ctx.drawImage(osc1, 0, 0, osc1.width / pixelRatio, osc1.height / pixelRatio);
  for (let j = 0; j < tileDepths[1].length; j++) {
    addTileMovieClip(tileDepths[1][j].x, tileDepths[1][j].y, ctx);
  }
  ctx.drawImage(osc2, 0, 0, osc2.width / pixelRatio, osc2.height / pixelRatio);
  for (let j = 0; j < tileDepths[2].length; j++) {
    addTileMovieClip(tileDepths[2][j].x, tileDepths[2][j].y, ctx);
  }
  drawCharacters();
  for (let j = 0; j < tileDepths[3].length; j++) {
    addTileMovieClip(tileDepths[3][j].x, tileDepths[3][j].y, ctx);
  }
}
function drawCharacters() {
  for (let d = 0; d < (charCount + 1) * 2; d++) {
    let i = charDepths[d];
    if (i < 0)
      continue;
    let currCharID = char[i].id;
    if (char[i].charState > 1 && typeof svgChars[currCharID] !== "undefined") {
      if (char[i].burstFrame >= 0) {
        ctx.save();
        let burstImg = svgBurst[char[i].burstFrame];
        let burstmat = charModels[char[i].id].burstmat;
        ctx.transform(
          burstmat.a,
          burstmat.b,
          burstmat.c,
          burstmat.d,
          burstmat.tx + char[i].x,
          burstmat.ty + char[i].y
        );
        ctx.drawImage(burstImg, -burstImg.width / 2, -burstImg.height / 2);
        ctx.restore();
        char[i].burstFrame++;
        if (char[i].burstFrame > svgBurst.length - 1)
          char[i].burstFrame = -1;
      }
      ctx.save();
      if (currCharID > 34) {
        if (charD[currCharID][7] == 1) {
          drawPossiblyTintedImage(
            svgChars[currCharID],
            char[i].x + svgCharsVB[currCharID][0],
            char[i].y + svgCharsVB[currCharID][1],
            char[i].temp
          );
        } else {
          drawPossiblyTintedImage(
            svgChars[currCharID][0],
            char[i].x + svgCharsVB[currCharID][0][0],
            char[i].y + svgCharsVB[currCharID][0][1],
            char[i].temp
          );
        }
        if (currCharID == 50) {
          if (char[i].acidDropTimer[0] < 9)
            ctx.drawImage(svgAcidDrop[char[i].acidDropTimer[0]], char[i].x - 17.7, char[i].y - 1.5);
          char[i].acidDropTimer[0]++;
          if (char[i].acidDropTimer[0] > 28) {
            if (Math.random() < 0.8) {
              char[i].acidDropTimer[0] = 9;
            } else {
              char[i].acidDropTimer[0] = 0;
            }
          }
        } else if (currCharID == 51) {
          if (char[i].acidDropTimer[0] < 9)
            ctx.drawImage(
              svgAcidDrop[char[i].acidDropTimer[0]],
              char[i].x - 25.75,
              char[i].y + 1.6,
              svgAcidDrop[0].width * 0.7826,
              svgAcidDrop[0].height * 0.7826
            );
          if (char[i].acidDropTimer[1] < 9)
            ctx.drawImage(
              svgAcidDrop[char[i].acidDropTimer[1]],
              char[i].x + 18.3,
              char[i].y + 6.7,
              svgAcidDrop[0].width * 0.7826,
              svgAcidDrop[0].height * 0.7826
            );
          char[i].acidDropTimer[0]++;
          char[i].acidDropTimer[1]++;
          if (char[i].acidDropTimer[0] > 28) {
            if (Math.random() < 0.8) {
              char[i].acidDropTimer[0] = 9;
            } else {
              char[i].acidDropTimer[0] = 0;
            }
          }
          if (char[i].acidDropTimer[1] > 28) {
            if (Math.random() < 0.8) {
              char[i].acidDropTimer[1] = 9;
            } else {
              char[i].acidDropTimer[1] = 0;
            }
          }
        }
      } else {
        let model = charModels[char[i].id];
        if (!(char[i].id == 5 && Math.floor(char[i].frame / 2) == 4)) {
          let legdire = char[i].legdire > 0 ? 1 : -1;
          let legmat = [
            {
              a: 0.3648529052734375,
              b: 0,
              c: char[i].leg1skew * legdire,
              d: 0.3814697265625,
              tx: legdire > 0 ? -0.75 : 0.35,
              ty: -0.35
            },
            {
              a: 0.3648529052734375,
              b: 0,
              c: char[i].leg2skew * legdire,
              d: 0.3814697265625,
              tx: legdire > 0 ? -0.75 : 0.35,
              ty: -0.35
            }
          ];
          let f2 = [];
          let legf = legFrames[char[i].leg1frame];
          if (legf.type == "static") {
            f2 = [legf.bodypart, legf.bodypart];
          } else if (legf.type == "anim") {
            if (legf.usesMats) {
              f2 = [legf.bodypart, legf.bodypart];
              legmat = [
                legf.frames[Math.max(char[i].legAnimationFrame[0], 0) % legf.frames.length],
                legf.frames[Math.max(char[i].legAnimationFrame[1], 0) % legf.frames.length]
              ];
            } else {
              f2 = [
                legf.frames[Math.max(char[i].legAnimationFrame[0], 0) % legf.frames.length],
                legf.frames[Math.max(char[i].legAnimationFrame[1], 0) % legf.frames.length]
              ];
            }
          }
          ctx.save();
          ctx.transform(
            legdire * legmat[0].a,
            legmat[0].b,
            legdire * legmat[0].c,
            legmat[0].d,
            char[i].x + model.legx[0] + legmat[0].tx,
            char[i].y + model.legy[0] + legmat[0].ty
          );
          let leg1img = svgBodyParts[f2[0]];
          drawPossiblyTintedImage(leg1img, -leg1img.width / 2, -leg1img.height / 2, char[i].temp);
          ctx.restore();
          ctx.save();
          ctx.transform(
            legdire * legmat[1].a,
            legmat[1].b,
            legdire * legmat[1].c,
            legmat[1].d,
            char[i].x + model.legx[1] + legmat[1].tx,
            char[i].y + model.legy[1] + legmat[1].ty
          );
          let leg2img = svgBodyParts[f2[1]];
          drawPossiblyTintedImage(leg2img, -leg2img.width / 2, -leg2img.height / 2, char[i].temp);
          ctx.restore();
        }
        let modelFrame = model.frames[char[i].frame];
        ctx.save();
        let runbob = char[i].frame == 0 || char[i].frame == 2 ? bounceY(4 / charModels[char[i].id].torsomat.a, 13, char[i].poseTimer) : 0;
        ctx.transform(
          charModels[char[i].id].torsomat.a,
          charModels[char[i].id].torsomat.b,
          charModels[char[i].id].torsomat.c,
          charModels[char[i].id].torsomat.d,
          char[i].x + charModels[char[i].id].torsomat.tx,
          char[i].y + charModels[char[i].id].torsomat.ty
        );
        for (let j = 0; j < modelFrame.length; j++) {
          if (char[i].frame > 9 && modelFrame[j].type == "armroot") {
            let handOff = modelFrame[j].id == 0 ? 10 : 20;
            let handX = -charModels[char[i].id].torsomat.tx + (char[0].x - char[i].x) + handOff * Math.cos(Math.PI * 0 / 15 - 0.2);
            let handY = -charModels[char[i].id].torsomat.ty + (char[0].y - char[i].y) + handOff * Math.sin(Math.PI * 0 / 15 - 0.2);
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(modelFrame[j].pos.x, modelFrame[j].pos.y);
            ctx.lineTo(handX, handY);
            ctx.stroke();
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.arc(handX, handY, 2.5, 0, 2 * Math.PI, false);
            ctx.fill();
            continue;
          }
          let img = svgBodyParts[modelFrame[j].bodypart];
          if (modelFrame[j].type == "body")
            img = svgChars[char[i].id];
          ctx.save();
          ctx.transform(
            modelFrame[j].mat.a,
            modelFrame[j].mat.b,
            modelFrame[j].mat.c,
            modelFrame[j].mat.d,
            modelFrame[j].mat.tx,
            modelFrame[j].mat.ty + (modelFrame[j].type != "anim" ? runbob : 0)
          );
          if (modelFrame[j].type == "anim") {
            img = svgBodyParts[bodyPartAnimations[modelFrame[j].anim].bodypart];
            let bpanimframe = modelFrame[j].loop ? (char[i].poseTimer + modelFrame[j].offset) % bodyPartAnimations[modelFrame[j].anim].frames.length : Math.min(
              char[i].poseTimer + modelFrame[j].offset,
              bodyPartAnimations[modelFrame[j].anim].frames.length - 1
            );
            let mat = bodyPartAnimations[modelFrame[j].anim].frames[bpanimframe];
            ctx.transform(mat.a, mat.b, mat.c, mat.d, mat.tx, mat.ty);
          } else if (modelFrame[j].type == "dia") {
            let dmf = 0;
            if (cutScene == 1) {
              let expr = char[i].expr + charModels[char[i].id].mouthType * 2;
              dmf = diaMouths[expr].frameorder[char[i].diaMouthFrame];
              img = svgBodyParts[diaMouths[expr].frames[dmf].bodypart];
              if (char[i].diaMouthFrame < diaMouths[expr].frameorder.length - 1)
                char[i].diaMouthFrame++;
            } else {
              img = svgBodyParts[diaMouths[char[i].expr + charModels[char[i].id].mouthType * 2].frames[dmf].bodypart];
            }
            let mat = diaMouths[model.defaultExpr].frames[dmf].mat;
            ctx.transform(mat.a, mat.b, mat.c, mat.d, mat.tx, mat.ty);
          }
          drawPossiblyTintedImage(img, -img.width / 2, -img.height / 2, char[i].temp);
          ctx.restore();
        }
        ctx.restore();
        char[i].poseTimer++;
        ctx.restore();
      }
      ctx.restore();
    }
    if (char[i].temp >= 50 && char[i].id != 5) {
      ctx.save();
      let fireImg = svgFire[0 % svgFire.length];
      if (char[i].id == 2)
        fireImg = svgIceCubeMelt;
      else
        ctx.globalAlpha = 0.57;
      let firemat = charModels[char[i].id].firemat;
      ctx.transform(firemat.a, firemat.b, firemat.c, firemat.d, firemat.tx + char[i].x, firemat.ty + char[i].y);
      ctx.drawImage(fireImg, -fireImg.width / 2, -fireImg.height / 2);
      ctx.restore();
    }
  }
}
function bounceY(amt, time, t) {
  let base = Math.sin(mapRange(t % time, 0, time * 2, 0, Math.PI)) * time * 2;
  return (base > time ? time - base + time : base) * amt / time;
}
function getTintedCanvasImage(img, a, color) {
  osc3.width = img.width * pixelRatio;
  osc3.height = img.height * pixelRatio;
  osctx3.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  osctx3.save();
  osctx3.fillStyle = color;
  osctx3.globalAlpha = a;
  osctx3.fillRect(0, 0, osc3.width, osc3.height);
  osctx3.globalCompositeOperation = "destination-atop";
  osctx3.globalAlpha = 1;
  osctx3.drawImage(img, 0, 0);
  osctx3.restore();
  return osc3;
}
function drawPossiblyTintedImage(img, x, y, temp) {
  if (temp > 0 && temp < 50) {
    ctx.drawImage(
      getTintedCanvasImage(img, temp / 70, "rgb(255," + (100 - temp) + "," + (100 - temp) + ")"),
      x,
      y,
      img.width,
      img.height
    );
  } else {
    ctx.drawImage(img, x, y);
  }
}
function getTileDepths() {
  for (let i = 0; i < 6; i++) {
    switchable[i] = [];
  }
  for (let y = 0; y < levelHeight; y++) {
    for (let x = 0; x < levelWidth; x++) {
      if (thisLevel[y][x] >= 1) {
        if (blockProperties[thisLevel[y][x]][12] >= 1) {
          switchable[blockProperties[thisLevel[y][x]][12] - 1].push([x, y]);
        }
        if (blockProperties[thisLevel[y][x]][14]) {
          tileDepths[3].push({ x, y });
        } else if (blockProperties[thisLevel[y][x]][11] >= 1) {
          tileDepths[2].push({ x, y });
        } else if (blockProperties[thisLevel[y][x]][8]) {
          tileDepths[1].push({ x, y });
        } else {
          tileDepths[0].push({ x, y });
        }
        if (thisLevel[y][x] == 6) {
          locations[0] = x;
          locations[1] = y;
        }
        if (thisLevel[y][x] == 12) {
          locations[2] = x;
          locations[3] = y;
          locations[4] = 1e3;
          locations[5] = 0;
        }
      }
    }
  }
}
function addTileMovieClip(x, y, context) {
  let t = thisLevel[y][x];
  if (blockProperties[t][16] > 0) {
    if (blockProperties[t][16] == 1) {
      if (blockProperties[t][11] > 0 && typeof svgLevers[(blockProperties[t][11] - 1) % 6] !== "undefined") {
        context.save();
        context.translate(x * 30 + 15, y * 30 + 28);
        context.rotate(tileFrames[y][x].rotation * (Math.PI / 180));
        context.translate(-x * 30 - 15, -y * 30 - 28);
        context.drawImage(svgLevers[(blockProperties[t][11] - 1) % 6], x * 30, y * 30);
        context.restore();
      }
      context.drawImage(svgTiles[t], x * 30 + svgTilesVB[t][0], y * 30 + svgTilesVB[t][1]);
    } else if (blockProperties[t][16] > 1) {
      let frame = 0;
      if (blockProperties[t][17])
        frame = blockProperties[t][18][0 % blockProperties[t][18].length];
      else {
        frame = tileFrames[y][x].cf;
        if (tileFrames[y][x].playing)
          tileFrames[y][x].cf++;
        if (tileFrames[y][x].cf >= blockProperties[t][16] - 1) {
          tileFrames[y][x].playing = false;
          tileFrames[y][x].cf = 0;
        }
      }
      context.drawImage(svgTiles[t][frame], x * 30 + svgTilesVB[t][frame][0], y * 30 + svgTilesVB[t][frame][1]);
    }
  } else if (t == 6) {
    let bgid = playMode == 2 ? selectedBg : bgs[currentLevel];
    context.fillStyle = bgid == 9 || bgid == 10 ? "#999999" : "#505050";
    context.fillRect((x - 1) * 30, (y - 3) * 30, 60, 120);
    for (let i = 0; i < charCount2; i++) {
      context.fillStyle = "rgb(" + mapRange(doorLightFade[i], 0, 1, 40, 0) + "," + mapRange(doorLightFade[i], 0, 1, 40, 255) + "," + mapRange(doorLightFade[i], 0, 1, 40, 0) + ")";
      context.fillRect(
        (x - 1) * 30 + doorLightX[Math.floor(i / 6) == Math.floor((charCount2 - 1) / 6) ? (charCount2 - 1) % 6 : 5][i % 6],
        y * 30 - 80 + Math.floor(i / 6) * 10,
        5,
        5
      );
      if (doorLightFadeDire[i] != 0) {
        doorLightFade[i] = Math.max(Math.min(doorLightFade[i] + doorLightFadeDire[i] * 0.0625, 1), 0);
        if (doorLightFade[i] == 1 || doorLightFade[i] == 0)
          doorLightFadeDire[i] = 0;
      }
    }
  } else if (t == 12) {
    if (!gotThisCoin) {
      if (locations[4] < 200) {
        context.save();
        context.translate(x * 30 + 15, y * 30 + 15);
        let wtrot = Math.sin(0 * Math.PI / 20) * 0.5235987756;
        context.transform(Math.cos(wtrot), -Math.sin(wtrot), Math.sin(wtrot), Math.cos(wtrot), 0, 0);
        context.globalAlpha = Math.max(Math.min(coinAlpha / 100, 1), 0);
        context.drawImage(svgCoin, -15, -15, 30, 30);
        context.restore();
      }
    } else if (tileFrames[y][x].cf < svgCoinGet.length) {
      context.drawImage(svgCoinGet[tileFrames[y][x].cf], x * 30 - 21, y * 30 - 21);
      tileFrames[y][x].cf++;
    }
  }
}
function calculateShadowsAndBorders() {
  for (let y = 0; y < levelHeight; y++) {
    for (let x = 0; x < levelWidth; x++) {
      if (thisLevel[y][x] >= 1) {
        let t = thisLevel[y][x];
        if (t == 6) {
          for (let x2 = 0; x2 < 2 && x - x2 >= 0; x2++) {
            for (let y2 = 0; y2 < 4 && y - y2 >= 0; y2++) {
              setAmbientShadow(x - x2, y - y2);
            }
          }
        } else if (t >= 110 && t <= 129) {
          for (let x2 = 0; x2 < 3; x2++) {
            for (let y2 = 0; y2 < 2; y2++) {
              setAmbientShadow(x - x2, y - y2);
            }
          }
        } else if (blockProperties[thisLevel[y][x]][10]) {
          setAmbientShadow(x, y);
        }
        if (blockProperties[thisLevel[y][x]][13]) {
          setBorder(x, y, t);
        }
      }
    }
  }
}
function setAmbientShadow(x, y) {
  tileShadows[y][x] = [];
  if (outOfRange(x, y))
    return;
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (!outOfRange(x + cardinal[i][0], y + cardinal[i][1])) {
      let t = blockProperties[thisLevel[y + cardinal[i][1]][x + cardinal[i][0]]][12];
      if (blockProperties[thisLevel[y + cardinal[i][1]][x + cardinal[i][0]]][i] && (t == 0 || t == 6)) {
        count += Math.pow(2, 3 - i);
      }
    }
  }
  if (count > 0)
    tileShadows[y][x].push(count);
  for (let i = 0; i < 4; i++) {
    if (!outOfRange(x + diagonal[i][0], y + diagonal[i][1]) && !blockProperties[thisLevel[y][x + diagonal[i][0]]][opposite(i, 0)] && !blockProperties[thisLevel[y + diagonal[i][1]][x]][opposite(i, 1)] && blockProperties[thisLevel[y + diagonal[i][1]][x + diagonal[i][0]]][opposite(i, 0)] && blockProperties[thisLevel[y + diagonal[i][1]][x + diagonal[i][0]]][12] == 0 && blockProperties[thisLevel[y + diagonal[i][1]][x + diagonal[i][0]]][opposite(i, 1)] && blockProperties[thisLevel[y + diagonal[i][1]][x + diagonal[i][0]]][12] == 0) {
      tileShadows[y][x].push(16 + i);
    }
  }
}
function setBorder(x, y, s) {
  let borderset = 0;
  let metalBlocks = [98, 102, 105, 107];
  if (metalBlocks.includes(thisLevel[y][x]))
    borderset = 19;
  tileBorders[y][x] = [];
  if (outOfRange(x, y))
    return;
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (!outOfRange(x + cardinal[i][0], y + cardinal[i][1]) && thisLevel[y + cardinal[i][1]][x + cardinal[i][0]] != s) {
      count += Math.pow(2, 3 - i);
    }
  }
  if (count > 0)
    tileBorders[y][x].push(count + borderset);
  for (let i = 0; i < 4; i++) {
    if (!outOfRange(x + diagonal[i][0], y + diagonal[i][1]) && thisLevel[y][x + diagonal[i][0]] == s && thisLevel[y + diagonal[i][1]][x] == s && thisLevel[y + diagonal[i][1]][x + diagonal[i][0]] != s) {
      tileBorders[y][x].push(16 + i + borderset);
    }
  }
}
function opposite(i, xOrY) {
  if (xOrY == 0) {
    return 3.5 - Math.abs(i - 1.5);
  }
  if (xOrY == 1) {
    return Math.floor(i / 2);
  }
}
function outOfRange(x, y) {
  return x < 0 || y < 0 || x > levelWidth - 1 || y > levelHeight - 1;
}
function generateMS(info) {
  let out = [];
  out.push(Math.floor(info[4] / 10));
  out.push(info[4] % 10);
  let a = info[5];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[i][1]; j++) {
      out.push(a[i][0]);
    }
  }
  return out;
}
function setup(createCanvas2) {
  osc1 = createCanvas2(cwidth, cheight);
  osctx1 = osc1.getContext("2d");
  osc2 = createCanvas2(cwidth, cheight);
  osctx2 = osc2.getContext("2d");
  osc3 = createCanvas2(cwidth, cheight);
  osctx3 = osc3.getContext("2d");
  osc4 = createCanvas2(cwidth, cheight);
  osctx4 = osc4.getContext("2d");
  osctx4 = ctx;
  draw();
}
function draw() {
  ctx.clearRect(0, 0, 960, 540);
  currentLevel = levelToPreview;
  resetLevel();
  ctx.drawImage(
    osc4,
    0,
    0,
    osc4.width / pixelRatio,
    osc4.height / pixelRatio
  );
  drawLevel();
}
class Character {
  constructor(tid, tx, ty, tpx, tpy, tcharState) {
    this.id = tid;
    this.x = tx;
    this.y = ty;
    this.px = tx;
    this.deathTimer = 30;
    this.charState = tcharState;
    this.justChanged = 2;
    this.temp = 0;
    this.frame = 3;
    this.poseTimer = 0;
    this.leg1frame = 0;
    this.legdire = 1;
    this.leg1skew = 0;
    this.leg2skew = 0;
    this.legAnimationFrame = [0, 0];
    this.burstFrame = -1;
    this.diaMouthFrame = 0;
    this.expr = 0;
    this.acidDropTimer = [0, 0];
  }
  // applyForces(grav, control, waterUpMaxSpeed) {
  // 	let gravity = Math.sign(grav) * Math.sqrt(Math.abs(grav));
  //
  // 	if (!this.onob && this.submerged != 1) this.vy = Math.min(this.vy + gravity, 25);
  // 	if (this.onob || control) {
  // 		this.vx = (this.vx - this.fricGoal) * this.friction + this.fricGoal;
  // 	} else {
  // 		this.vx *= 1 - (1 - this.friction) * 0.12;
  // 	}
  //
  // 	if (Math.abs(this.vx) < 0.01) this.vx = 0;
  //
  // 	if (this.submerged == 1) {
  // 		this.vy = 0;
  // 		if (this.weight2 > 0.18) this.submerged = 2;
  // 	} else if (this.submerged >= 2) {
  // 		if (this.vx > 1.5) this.vx = 1.5;
  // 		if (this.vx < -1.5) this.vx = -1.5;
  //
  // 		if (this.vy > 1.8) this.vy = 1.8;
  // 		if (this.vy < - waterUpMaxSpeed) this.vy = - waterUpMaxSpeed;
  // 	}
  // }
  // charMove() {
  // 	this.y += this.vy;
  // 	this.x += this.vx;
  // }
  // moveHorizontal(power) {
  // 	if (power * this.fricGoal <= 0 && !this.onob) this.fricGoal = 0;
  // 	this.vx += power;
  // 	if (power < 0) this.dire = 1;
  // 	if (power > 0) this.dire = 3;
  // 	this.justChanged = 2;
  // }
  // stopMoving() {
  // 	if (this.dire == 1) this.dire = 2;
  // 	if (this.dire == 3) this.dire = 4;
  // }
  // jump(jumpPower) {
  // 	this.vy = jumpPower;
  // }
  // swimUp(jumpPower) {
  // 	this.vy -= this.weight2 + jumpPower;
  // }
  // setFrame(newFrame) {
  // 	if (newFrame != this.frame) {
  // 		if (!((this.frame == 5 && newFrame == 4) || (this.frame == 4 && newFrame == 5))) this.poseTimer = 0;
  // 		this.frame = newFrame;
  // 		if (cutScene == 3 && this.expr != this.dExpr) this.expr = this.dExpr;
  // 	}
  // }
}
export {
  renderImage
};
