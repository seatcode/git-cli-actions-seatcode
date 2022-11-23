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
Object.defineProperty(exports, "__esModule", { value: true });
exports.lightHouseMain = void 0;
require('./utils/support-lh-plugins'); // add automatic support for LH Plugins env
const core = require('@actions/core');
const { join } = require('path');
const childProcess = require('child_process');
const lhciCliPath = require.resolve('@lhci/cli/src/cli');
const { getInput, hasAssertConfig } = require('../config');
const { uploadArtifacts } = require('./utils/artifacts');
const { setAnnotations } = require('./utils/annotations');
const { setOutput } = require('./utils/output');
/**
 * Audit urls with Lighthouse CI in 3 stages:
 * 1. collect (using lhci collect or the custom PSI runner, store results as artifacts)
 * 2. assert (assert results using budgets or LHCI assertions)
 * 3. upload (upload results to LHCI Server, Temporary Public Storage)
 */
function lightHouseMain() {
    return __awaiter(this, void 0, void 0, function* () {
        core.startGroup('Action config');
        const resultsPath = join(process.cwd(), '.lighthouseci');
        const input = getInput();
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
        if (input.budgetPath || hasAssertConfig(input.configPath)) {
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
                yield uploadArtifacts(resultsPath, input.artifactName);
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
        yield setOutput(resultsPath);
        yield setAnnotations(resultsPath); // set failing error/warning annotations
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
