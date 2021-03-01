const express = require('express');
const app = express();
var fs=require("fs");
var routePath="./routes/";
// dynamically load routes from /routes
fs.readdirSync(routePath).forEach(function(file) {
    const route=routePath+file;
    require(route)(app);
    console.log("[Route] /"+file)
});

app.listen(3000)
console.log("App is listening on http://localhost:3000");