const cliProgress = require("cli-progress");

function main() {
  // Tạo một thanh tiến trình sử dụng cli-progress
  const progressBar = new cliProgress.SingleBar(
    { format: "CPU Usage |{bar}| {percentage}%" },
    cliProgress.Presets.shades_classic
  );

  progressBar.start(100, 0);
}

module.exports = { main };
