var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var alexaCookie = require("alexa-cookie2");
var fs = require("fs");
var path = require("path");
var envPath = path.join(process.cwd(), ".env");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            console.log("\nStarting Alexa Cookie Collection Service...");
            console.log("------------------------------------------");
            console.log("1. This will start a temporary proxy server on your machine.");
            console.log("2. Open the URL below in your browser.");
            console.log("3. Log in to your Amazon account.");
            console.log("4. Once finished, this script will automatically capture the cookies.\n");
            options = {
                amazonPage: "amazon.com",
                proxyOnly: true,
                proxyOwnIp: "localhost",
                proxyPort: 3456,
                setupProxy: true,
                baseAmazonPage: 'amazon.com',
                acceptLanguage: 'en-US',
                amazonPageProxyLanguage: "en_US",
            };
            alexaCookie.generateAlexaCookie("", "", options, function (err, result) {
                if (err) {
                    if (err.message && err.message.includes("Please open http")) {
                        // This is just the instruction to the user, not a real error
                        return;
                    }
                    console.error("\nError generating cookie:", err);
                    process.exit(1);
                }
                if (result && result.localCookie) {
                    console.log("\n✅ Success! Cookie collected.");
                    // Extract ubid-main and at-main from the cookie string
                    var cookies = result.localCookie.split(";").reduce(function (acc, curr) {
                        var _a = curr.trim().split("="), key = _a[0], value = _a[1];
                        if (key && value) {
                            acc[key] = value;
                        }
                        return acc;
                    }, {});
                    var ubidMain = cookies["ubid-main"];
                    var atMain = cookies["at-main"];
                    if (ubidMain && atMain) {
                        updateEnv(ubidMain, atMain);
                        console.log("✅ Updated .env file with new credentials.");
                        console.log("\nUBID_MAIN: ".concat(ubidMain.substring(0, 5), "..."));
                        console.log("AT_MAIN: ".concat(atMain.substring(0, 10), "..."));
                    }
                    else {
                        console.error("\n❌ Could not find ubid-main or at-main in the collected cookie.");
                        console.log("Raw result keys:", Object.keys(result));
                        console.log("Cookie keys found:", Object.keys(cookies));
                    }
                    alexaCookie.stopProxyServer();
                    process.exit(0);
                }
            });
            console.log("\uD83D\uDC49 Please open http://localhost:3456 in your browser to log in.");
            return [2 /*return*/];
        });
    });
}
function updateEnv(ubidMain, atMain) {
    var envContent = "";
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf-8");
    }
    var lines = envContent.split("\n");
    var ubidFound = false;
    var atFound = false;
    var newLines = lines.map(function (line) {
        if (line.startsWith("UBID_MAIN=")) {
            ubidFound = true;
            return "UBID_MAIN=\"".concat(ubidMain, "\"");
        }
        if (line.startsWith("AT_MAIN=")) {
            atFound = true;
            return "AT_MAIN=\"".concat(atMain, "\"");
        }
        return line;
    });
    if (!ubidFound) {
        newLines.push("UBID_MAIN=\"".concat(ubidMain, "\""));
    }
    if (!atFound) {
        newLines.push("AT_MAIN=\"".concat(atMain, "\""));
    }
    fs.writeFileSync(envPath, newLines.join("\n"), "utf-8");
}
main().catch(function (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
});
