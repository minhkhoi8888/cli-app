const blessed = require("blessed");
const contrib = require("blessed-contrib");
const si = require("systeminformation");
const cliProgress = require("cli-progress");

// Tạo screen và grid layout
const screen = blessed.screen();
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

// Tạo 3 box cho CPU, GPU, RAM
const cpuBox = grid.set(0, 0, 6, 6, blessed.box, {
  label: "CPU Information",
  content: "Loading CPU data...",
  border: { type: "line" },
  style: { border: { fg: "cyan" }, fg: "white", bg: "black" },
});

const gpuBox = grid.set(0, 6, 6, 6, blessed.box, {
  label: "GPU Information",
  content: "Loading GPU data...",
  border: { type: "line" },
  style: { border: { fg: "green" }, fg: "white", bg: "black" },
});

const ramBox = grid.set(6, 0, 6, 6, blessed.box, {
  label: "RAM Information",
  content: "Loading RAM data...",
  border: { type: "line" },
  style: { border: { fg: "yellow" }, fg: "white", bg: "black" },
});

const networkBox = grid.set(6, 6, 6, 6, blessed.box, {
  label: "RAM Information",
  content: "Loading RAM data...",
  border: { type: "line" },
  style: { border: { fg: "yellow" }, fg: "white", bg: "black" },
});

const progressBar = new cliProgress.SingleBar(
  {
    format: "CPU Usage [{bar}] {percentage}%",
  },
  cliProgress.Presets.shades_classic
);

// Khởi tạo giá trị thanh tiến trình
progressBar.start(100, 0);

async function updateCPUUsage() {
  const load = await si.currentLoad(); // Lấy dữ liệu CPU
  const cpuUsage = load.currentload; // Lấy phần trăm CPU đang sử dụng

  // Cập nhật thanh tiến trình
  progressBar.update(cpuUsage);

  // Cập nhật màn hình
  screen.render();

  // Lặp lại cập nhật sau một khoảng thời gian
  setTimeout(updateCPUUsage, 1000);
}

updateCPUUsage();

// Function để cập nhật thông tin CPU
async function updateCpuInfo() {
  const cpuData = await si.cpu();
  const load = await si.currentLoad();
  cpuBox.setContent(`
    Manufacturer: ${cpuData.manufacturer}
    Brand: ${cpuData.brand}
    Speed: ${cpuData.speed} GHz
    Cores: ${cpuData.cores}
    Load: ${load.currentload?.toFixed(2)}%
  `);
  screen.render();
}

// Function để cập nhật thông tin GPU
async function updateGpuInfo() {
  const gpuData = await si.graphics();
  if (gpuData.controllers.length > 0) {
    const gpu = gpuData.controllers[0];
    gpuBox.setContent(`
      Model: ${gpu.model}
      VRAM: ${gpu.vram} MB
      Bus: ${gpu.bus}
      Temperature: ${gpu.temperatureGpu || "N/A"} °C
    `);
  } else {
    gpuBox.setContent("No GPU found");
  }
  screen.render();
}

// Function để cập nhật thông tin RAM
async function updateRamInfo() {
  const memData = await si.mem();
  ramBox.setContent(`
    Total RAM: ${(memData.total / 1024 ** 3).toFixed(2)} GB
    Free RAM: ${(memData.free / 1024 ** 3).toFixed(2)} GB
    Used RAM: ${(memData.used / 1024 ** 3).toFixed(2)} GB
    Active RAM: ${(memData.active / 1024 ** 3).toFixed(2)} GB
  `);
  screen.render();
}

// Cập nhật thông tin ban đầu
updateCpuInfo();
updateGpuInfo();
updateRamInfo();

// Cập nhật thông tin mỗi 5 giây
setInterval(updateCpuInfo, 5000);
setInterval(updateGpuInfo, 5000);
setInterval(updateRamInfo, 5000);

// Đăng ký phím 'q' để thoát
screen.key(["q", "C-c"], (ch, key) => process.exit(0));

// Hiển thị screen
screen.render();
