var blessed = require("blessed");
const screen = blessed.screen();
const si = require("systeminformation");
const cliProgress = require("cli-progress");
const { main } = require("./cli");

const box1 = blessed.box({
  top: "0%",
  left: "0%",
  width: "50%",
  height: "50%",
  content: "Box 1",
  border: {
    type: "line",
  },
  style: {
    border: { fg: "white" },
    fg: "white",
    // bg: "blue",
  },
});

const box2 = blessed.box({
  top: "0%",
  left: "50%",
  width: "50%",
  height: "50%",
  content: "Box 2",
  border: {
    type: "line",
  },
  style: {
    border: { fg: "white" },
    fg: "white",
    bg: "green",
  },
});

const box3 = blessed.box({
  top: "50%",
  left: "0%",
  width: "50%",
  height: "50%",
  content: "Box 3",
  border: {
    type: "line",
  },
  style: {
    border: { fg: "white" },
    fg: "white",
    bg: "red",
  },
});

const box4 = blessed.box({
  top: "50%",
  left: "50%",
  width: "50%",
  height: "50%",
  content: "Box 4",
  border: {
    type: "line",
  },
  style: {
    border: { fg: "white" },
    fg: "white",
    bg: "yellow",
  },
});

// Thêm box vào màn hình
screen.append(box1);
screen.append(box2);
screen.append(box3);
screen.append(box4);
const progressBar = blessed.progressbar({
  parent: box1,
  border: "line",
  style: {
    bar: {
      bg: "white",
    },
    border: {
      fg: "white",
    },
  },
  pch: "•",
  width: "80%",
  height: 3,
  top: 2, // vị trí từ trên xuống
  left: "center", // căn giữa box1
  filled: 0, // giá trị khởi tạo
});

// Cập nhật thông tin CPU liên tục
setInterval(async () => {
  const load = await si.currentLoad();
  const cpuUsage = Math.round(load.currentLoad);

  // Cập nhật giá trị thanh tiến trình
  progressBar.setProgress(cpuUsage);
  screen.render();
}, 1000);

// Render màn hình
screen.render();
// Thoát chương trình khi nhấn `q`
screen.key(["q", "C-c"], function (ch, key) {
  return process.exit(0);
});
