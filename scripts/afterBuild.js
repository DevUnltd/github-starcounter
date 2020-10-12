const fs = require('fs-extra');

function copyDist() {
    fs.copySync('./build/index.js', './docs/dist.js');
}

copyDist();