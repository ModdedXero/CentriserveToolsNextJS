require("dotenv").config();

const http = require("http");
const repSchedule = require("./report_schedule");

http.createServer().listen(2512, () => {
    console.log("Report Server Started!");
});

repSchedule.Initialize();