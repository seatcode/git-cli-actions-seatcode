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
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAssertConfig = exports.getInput = void 0;
const core = __importStar(require("@actions/core"));
const lighthouserc_1 = require("@lhci/utils/src/lighthouserc");
const lodash_1 = require("lodash");
const path_1 = require("path");
function getInput() {
    // fallback to upload.serverBaseUrl + upload.token for previous API support
    const serverBaseUrl = core.getInput('serverBaseUrl') || core.getInput('upload.serverBaseUrl');
    const serverToken = core.getInput('serverToken') || core.getInput('upload.token');
    // Make sure we don't have LHCI xor API token
    if (!!serverBaseUrl != !!serverToken) {
        // Fail and exit
        core.setFailed(`Need both a LHCI server url and an API token.`);
        process.exit(1);
    }
    const temporaryPublicStorage = core.getInput('temporaryPublicStorage') === 'true' ? true : false;
    if (serverBaseUrl && temporaryPublicStorage) {
        core.setFailed(`Both LHCI server and Temporary storage are set, choose one upload method.`);
        process.exit(1);
    }
    let staticDistDir = null;
    let urls = null;
    let numberOfRuns = null;
    // Inspect lighthouserc file for malformations
    const configPath = core.getInput('configPath') ? (0, path_1.resolve)(core.getInput('configPath')) : null;
    if (configPath) {
        const rcFileObj = (0, lighthouserc_1.loadRcFile)(configPath);
        if (!rcFileObj.ci) {
            // Fail and exit
            core.setFailed(`Config missing top level 'ci' property`);
            process.exit(1);
        }
        // Check if we have a static-dist-dir
        if (rcFileObj.ci.collect) {
            if (rcFileObj.ci.collect.url) {
                urls = rcFileObj.ci.collect.url;
            }
            if (rcFileObj.ci.collect.staticDistDir) {
                staticDistDir = rcFileObj.ci.collect.staticDistDir;
            }
            if (rcFileObj.ci.collect.numberOfRuns) {
                numberOfRuns = rcFileObj.ci.collect.numberOfRuns;
            }
        }
    }
    // Get and interpolate URLs
    urls = urls || interpolateProcessIntoUrls(getList('urls'));
    // Make sure we have either urls or a static-dist-dir
    if (!urls && !staticDistDir) {
        // Fail and exit
        core.setFailed(`Need either 'urls' in action parameters or a 'static_dist_dir' in lighthouserc file`);
        process.exit(1);
    }
    return {
        // collect
        urls,
        runs: core.getInput('runs') ? parseInt(core.getInput('runs'), 10) : numberOfRuns || 1,
        staticDistDir,
        // assert
        budgetPath: core.getInput('budgetPath') || '',
        configPath,
        // upload
        serverBaseUrl,
        serverToken,
        temporaryPublicStorage,
        uploadArtifacts: core.getInput('uploadArtifacts') === 'true' ? true : false,
        basicAuthUsername: core.getInput('basicAuthUsername') || 'lighthouse',
        basicAuthPassword: core.getInput('basicAuthPassword'),
        artifactName: core.getInput('artifactName'),
    };
}
exports.getInput = getInput;
/**
 * Check if the file under `configPath` has `assert` params set.
 *
 * @param {string | null} configPath
 */
function hasAssertConfig(configPath) {
    if (!configPath)
        return false;
    const rcFileObj = (0, lighthouserc_1.loadRcFile)(configPath);
    return Boolean((0, lodash_1.get)(rcFileObj, 'ci.assert'));
}
exports.hasAssertConfig = hasAssertConfig;
/**
 * Wrapper for core.getInput for a list input.
 *
 * @param {string} arg
 */
function getList(arg, separator = '\n') {
    const input = core.getInput(arg);
    if (!input)
        return [];
    return input.split(separator).map((url) => url.trim());
}
/**
 * Takes a set of URL strings and interpolates
 * any declared ENV vars into them
 *
 * @param {string[]} urls
 */
function interpolateProcessIntoUrls(urls) {
    return urls.map((url) => {
        if (!url.includes('$'))
            return url;
        Object.keys(process.env).forEach((key) => {
            if (url.includes(`${key}`)) {
                url = url.replace(`$${key}`, `${process.env[key]}`);
            }
        });
        return url;
    });
}
