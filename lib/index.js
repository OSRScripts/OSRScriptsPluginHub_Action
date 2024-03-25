"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pluginJsonPath = core.getInput('pluginJson', { required: true });
            const pluginName = core.getInput('pluginName', { required: true });
            const pluginJarPath = core.getInput('pluginJar', { required: true });
            const pluginClassPath = core.getInput('pluginClassPath', { required: true });
            const pluginFolder = core.getInput('pluginFolder', { required: true });
            const pluginDescription = core.getInput('pluginDescription', { required: false });
            let pluginsFile = fs_1.default.readFileSync(pluginJsonPath, 'utf8');
            let pluginsData = JSON.parse(pluginsFile);
            if (!Array.isArray(pluginsData)) {
                pluginsData = [];
            }
            let jarFile = fs_1.default.readFileSync(pluginJarPath, 'binary');
            const sha256Hash = crypto_1.default.createHash('sha256').update(jarFile).digest('hex');
            const fileSizeInBytes = fs_1.default.statSync(jarFile).size;
            const pluginJson = {
                internalName: pluginFolder,
                hash: sha256Hash,
                size: fileSizeInBytes,
                plugins: [
                    pluginClassPath
                ],
                displayName: pluginName,
                description: pluginDescription ? pluginDescription : "",
                provider: pluginFolder
            };
            const filteredData = pluginsData.filter((item) => item.internalName !== pluginFolder);
            filteredData.push(pluginJson);
            pluginsData = JSON.stringify(filteredData, null, 2);
            fs_1.default.writeFileSync(pluginsFile, pluginsData, 'utf8');
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();
