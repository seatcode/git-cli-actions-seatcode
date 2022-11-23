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
Object.defineProperty(exports, "__esModule", { value: true });
exports.lightHouseMain = void 0;
require('./utils/support-lh-plugins');
const core = __importStar(require("@actions/core"));
const path_1 = require("path");
const childProcess = require('child_process');
const lhciCliPath = require.resolve('@lhci/cli/src/cli');
const config_1 = require("./config");
const artifacts_1 = require("./utils/artifacts");
const annotations_1 = require("./utils/annotations");
const output_1 = require("./utils/output");
/**
 * Audit urls with Lighthouse CI in 3 stages:
 * 1. collect (using lhci collect or the custom PSI runner, store results as artifacts)
 * 2. assert (assert results using budgets or LHCI assertions)
 * 3. upload (upload results to LHCI Server, Temporary Public Storage)
 */
function lightHouseMain() {
    return __awaiter(this, void 0, void 0, function* () {
        core.startGroup('Action config');
        const resultsPath = (0, path_1.join)(process.cwd(), '.lighthouseci');
        const input = (0, config_1.getInput)();
        core.info(`Input args: ${JSON.stringify(input, null, '  ')}`);
        core.endGroup(); // Action config
        /******************************* 1. COLLECT ***********************************/
        core.startGroup(`Collecting`);
        const collectArgs = [`--numberOfRuns=${input.runs}`];
        if (input.staticDistDir) {
            collectArgs.push(`--static-dist-dir=${input.staticDistDir}`);
        }
        else if (input.urls) {
            for (const url of input.urls) {
                collectArgs.push(`--url=${url}`);
            }
        }
        // else LHCI will panic with a non-zero exit code...
        if (input.configPath)
            collectArgs.push(`--config=${input.configPath}`);
        // @ts-ignore
        const collectStatus = runChildCommand('collect', collectArgs);
        if (collectStatus !== 0)
            throw new Error(`LHCI 'collect' has encountered a problem.`);
        core.endGroup(); // Collecting
        /******************************* 2. ASSERT ************************************/
        if (input.budgetPath || (0, config_1.hasAssertConfig)(input.configPath)) {
            core.startGroup(`Asserting`);
            const assertArgs = [];
            if (input.budgetPath) {
                assertArgs.push(`--budgetsFile=${input.budgetPath}`);
            }
            else {
                assertArgs.push(`--config=${input.configPath}`);
            }
            // run lhci with problem matcher
            // https://github.com/actions/toolkit/blob/master/docs/commands.md#problem-matchers
            // @ts-ignore
            runChildCommand('assert', assertArgs);
            core.endGroup(); // Asserting
        }
        /******************************* 3. UPLOAD ************************************/
        core.startGroup(`Uploading`);
        if (input.serverToken ||
            input.temporaryPublicStorage ||
            input.uploadArtifacts) {
            // upload artifacts as soon as collected
            if (input.uploadArtifacts) {
                yield (0, artifacts_1.uploadArtifacts)(resultsPath, input.artifactName);
            }
            if (input.serverToken || input.temporaryPublicStorage) {
                const uploadParams = [];
                if (input.serverToken) {
                    uploadParams.push('--target=lhci', `--serverBaseUrl=${input.serverBaseUrl}`, `--token=${input.serverToken}`, '--ignoreDuplicateBuildFailure' // ignore failure on the same commit rerun
                    );
                }
                else if (input.temporaryPublicStorage) {
                    uploadParams.push('--target=temporary-public-storage');
                }
                if (input.basicAuthPassword) {
                    uploadParams.push(`--basicAuth.username=${input.basicAuthUsername}`, `--basicAuth.password=${input.basicAuthPassword}`);
                }
                if (input.configPath)
                    uploadParams.push(`--config=${input.configPath}`);
                // @ts-ignore
                const uploadStatus = runChildCommand('upload', uploadParams);
                if (uploadStatus !== 0)
                    throw new Error(`LHCI 'upload' failed to upload to LHCI server.`);
            }
        }
        // run again for filesystem target
        // @ts-ignore
        // @ts-ignore
        const uploadStatus = runChildCommand('upload', ['--target=filesystem', `--outputDir=${resultsPath}`]);
        if (uploadStatus !== 0)
            throw new Error(`LHCI 'upload' failed to upload to fylesystem.`);
        core.endGroup(); // Uploading
        yield (0, output_1.setOutput)(resultsPath);
        yield (0, annotations_1.setAnnotations)(resultsPath); // set failing error/warning annotations
    });
}
exports.lightHouseMain = lightHouseMain;
/**
 * Run a child command synchronously.
 *
 * @param {'collect'|'assert'|'upload'} command
 * @param {string[]} [args]
 * @return {number}
 */
function runChildCommand(command, args = []) {
    const combinedArgs = [lhciCliPath, command, ...args];
    const { status = -1 } = childProcess.spawnSync(process.argv[0], combinedArgs, {
        stdio: 'inherit'
    });
    return status || 0;
}
