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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadArtifacts = void 0;
const artifact_1 = __importDefault(require("@actions/artifact"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = require("path");
/** @param {string} resultsPath */
function uploadArtifacts(resultsPath, artifactName = 'lighthouse-results') {
    return __awaiter(this, void 0, void 0, function* () {
        const artifactClient = artifact_1.default.create();
        const fileNames = yield promises_1.default.readdir(resultsPath);
        if (typeof resultsPath === 'string') {
            const files = fileNames.map(fileName => (0, path_1.join)(resultsPath, fileName));
            return artifactClient.uploadArtifact(artifactName, files, resultsPath, {
                continueOnError: true
            });
        }
    });
}
exports.uploadArtifacts = uploadArtifacts;
