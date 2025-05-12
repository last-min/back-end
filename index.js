const express = require("express");
const userRoute = require("./Routes/userRoute");
const connectDb = require("./configuration/DB");
const cors = require("cors"); 
const dotenv = require("dotenv");
const prodcuteRoute = require("./Routes/productRoute");
const purchaseRoute = require("./Routes/purchasesRoute");
const walletRoute = require("./Routes/walletRoute");
const os = require("os");

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDb();

app.use(cors()); 

app.use(express.json());

app.use("/api", userRoute, prodcuteRoute, purchaseRoute);
app.use("/api/wallet", walletRoute);

// Function to get the local IP address
function getLocalIp() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    for (const iface of networkInterfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const ip = getLocalIp();

app.listen(port, (error) => {
  if (error) {
    console.log("Server Failed");
  } else {
    console.log(`Server is running on http://${ip}:${port}`);
  }
});
