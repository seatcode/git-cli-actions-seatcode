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
exports.getManifest = exports.getAssertionResults = exports.getLinks = void 0;
const path_1 = require("path");
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = require("fs");
/** @typedef {{ name: string, expected: number, actual: number, values: number[], operator: string, passed: boolean,
                auditId: string, auditProperty: string, level: 'warn' | 'error', url: string, auditTitle: string, auditDocumentationLink: string }} LHCIAssertion */
/** @typedef {{ url: string, isRepresentativeRun: boolean, jsonPath: string, htmlPath: string, summary: {
                performance: number, accessibility: number, 'best-practices': number, seo: number, pwa: number} }} LHCIManifest */
/**
 * Reads links.json file as LHCI upload artifacts
 * and returns the content of that file.
 *
 * @param {string} resultsPath
 */
function getLinks(resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const linksPath = (0, path_1.join)(resultsPath, 'links.json');
        if (!(0, fs_1.existsSync)(linksPath))
            return null;
        return /** @type {Object<string,string>} */ (JSON.parse(yield promises_1.default.readFile(linksPath, 'utf8')));
    });
}
exports.getLinks = getLinks;
/**
 * Get assertions grouped by url and sorted with error first.
 *
 * @param {string} resultsPath
 */
function getAssertionResults(resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const assertionResultsPath = (0, path_1.join)(resultsPath, 'assertion-results.json');
        if (!(0, fs_1.existsSync)(assertionResultsPath))
            return null;
        return /** @type {LHCIAssertion[]} **/ (JSON.parse(yield promises_1.default.readFile(assertionResultsPath, 'utf8')));
    });
}
exports.getAssertionResults = getAssertionResults;
/**
 * Reads manifest.json file and returns the content of that file.
 *
 * @param {string} resultsPath
 */
function getManifest(resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const manifestPath = (0, path_1.join)(resultsPath, 'manifest.json');
        if (!(0, fs_1.existsSync)(manifestPath))
            return null;
        return /** @type {LHCIManifest[]} **/ (JSON.parse(yield promises_1.default.readFile(manifestPath, 'utf8')));
    });
}
exports.getManifest = getManifest;
