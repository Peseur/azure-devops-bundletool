"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var task = require("azure-pipelines-task-lib/task");
var path = require("path");
var tool = require("azure-pipelines-tool-lib/tool");
var os = __importStar(require("os"));
var BUNDLETOOL_NAME = 'bundletool';
var BUNDLETOOL_ENV_PATH = 'bundletoolpath';
var GITHUB_API_URL = 'https://api.github.com/repos/google/bundletool/releases/latest';
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var arch, githubUsername, githubPersonalAccesToken, curl, args, curlGithubResult, res, versionTag, bundletoolJarUrl, bundletoolJarName, bundletoolPath, curlResult, workingDirectory, toolPath, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    arch = findArchitecture();
                    githubUsername = task.getInput('username', false);
                    githubPersonalAccesToken = task.getInput('personalAccessToken', false);
                    curl = task.which('curl', true);
                    args = ['-s', GITHUB_API_URL];
                    if (githubUsername && githubPersonalAccesToken) {
                        args.unshift('-u', githubUsername + ":" + githubPersonalAccesToken);
                    }
                    curlGithubResult = task.execSync(curl, args);
                    res = JSON.parse(curlGithubResult.stdout);
                    versionTag = res['tag_name'];
                    bundletoolJarUrl = res['assets'][0]['browser_download_url'];
                    bundletoolJarName = res['assets'][0]['name'];
                    bundletoolPath = tool.findLocalTool(BUNDLETOOL_NAME, versionTag, arch);
                    if (!!bundletoolPath) return [3 /*break*/, 2];
                    return [4 /*yield*/, downloading(bundletoolJarName, bundletoolJarUrl)];
                case 1:
                    curlResult = _a.sent();
                    if (curlResult.code !== 0) {
                        if (curlResult.error != null) {
                            task.error("" + curlResult.error);
                        }
                        task.error("An error occured when downloading bundletool from this url, please verify that the url exist by copy-paste it into your favorite navigator: " + bundletoolJarUrl);
                        process.exit(1);
                    }
                    workingDirectory = task.cwd();
                    toolPath = path.join(workingDirectory, bundletoolJarName);
                    tool.cacheDir(toolPath, BUNDLETOOL_NAME, versionTag, arch);
                    task.setVariable(BUNDLETOOL_ENV_PATH, toolPath);
                    return [3 /*break*/, 3];
                case 2:
                    task.setVariable(BUNDLETOOL_ENV_PATH, bundletoolPath);
                    _a.label = 3;
                case 3:
                    task.setResult(task.TaskResult.Succeeded, "Bundletool is ready to use.");
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    task.setResult(task.TaskResult.Failed, err_1.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function downloading(fileName, url) {
    return __awaiter(this, void 0, void 0, function () {
        var curl, args, curlResult;
        return __generator(this, function (_a) {
            curl = task.which('curl', true);
            args = ['--location', '--silent', '-o', fileName, url];
            curlResult = task.execSync(curl, args);
            return [2 /*return*/, curlResult];
        });
    });
}
function findArchitecture() {
    if (os.platform() === 'darwin') {
        return "macos";
    }
    else if (os.platform() === 'linux') {
        return "linux";
    }
    else {
        return "windows";
    }
}
run();
