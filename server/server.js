const app = require("./src/app");
const { PORT } = require("./env.config");
const { getLocalIp } = require("./src/utils/getLocalIp");

const ip = getLocalIp();

app.listen(PORT, () => {
  console.log("🚀 Auth server running");
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://${ip}:${PORT}`);
});
