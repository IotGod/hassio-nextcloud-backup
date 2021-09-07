const fs = require("fs");
const hassioApiTools = require("./hassioApiTools");

const statusPath = "/data/status.json";

let baseStatus = {
    status: "idle",
    last_backup: null,
    next_backup: null,
};

function init() {
    if (!fs.existsSync(statusPath)) {
        fs.writeFileSync(statusPath, JSON.stringify(baseStatus));
    } else {
        let content = getStatus();
        if (content.status !== "idle") {
            content.status = "idle";
            content.message = null;
            setStatus(content);
        }
    }
}

function getStatus() {
    if (!fs.existsSync(statusPath)) {
        fs.writeFileSync(statusPath, JSON.stringify(baseStatus));
    }
    return JSON.parse(fs.readFileSync(statusPath).toString());
}

function setStatus(state) {
    if (fs.existsSync(statusPath)) {
        let old_state_str = fs.readFileSync(statusPath).toString();
        if(old_state_str !== JSON.stringify(state)){
            fs.writeFileSync(statusPath, JSON.stringify(state));
            hassioApiTools.publish_state(state);
        }
    }else{
        fs.writeFileSync(statusPath, JSON.stringify(state));
        hassioApiTools.publish_state(state);
    }
    

}

exports.init = init;
exports.getStatus = getStatus;
exports.setStatus = setStatus;
