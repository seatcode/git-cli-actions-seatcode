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
exports.setAnnotations = void 0;
const lodash_1 = require("lodash");
const core = __importStar(require("@actions/core"));
const lhci_helpers_1 = require("./lhci-helpers");
/**
 * Set annotations for each failed URL.
 *

3 results for https://exterkamp.codes/

❌ `maskable-icon` failure for `minScore` assertion (Manifest doesn't have a maskable icon: https://web.dev/maskable-icon-audit/)
Expected >= 0.9, but found 0

⚠️ `render-blocking-resources` warning for `maxLength` assertion (Eliminate render-blocking resources: https://web.dev/render-blocking-resources)
Expected <= 0, but found 1

⚠️ `uses-long-cache-ttl` warning for `maxLength` assertion (Uses efficient cache policy on static assets: https://web.dev/uses-long-cache-ttl)
Expected <= 0, but found 1
 
 * @param {string} resultsPath
 */
function setAnnotations(resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const links = yield (0, lhci_helpers_1.getLinks)(resultsPath);
        const assertionResults = yield (0, lhci_helpers_1.getAssertionResults)(resultsPath);
        if (!assertionResults)
            return;
        const assertionResultsByUrl = (0, lodash_1.mapValues)((0, lodash_1.groupBy)(assertionResults, 'url'), (assertions) => {
            return (0, lodash_1.orderBy)(assertions, (a) => (a.level === 'error' ? 0 : 1) + a.auditId);
        });
        Object.entries(assertionResultsByUrl).forEach(([url, assertions]) => {
            const link = (links || {})[url];
            const assertionsText = assertions.map((a) => {
                const emoji = a.level === 'error' ? '❌' : '⚠️';
                return (`${emoji} \`${a.auditId}${a.auditProperty ? '.' + a.auditProperty : ''}\` ` +
                    `${a.level === 'error' ? 'failure' : 'warning'} for \`${a.name}\` assertion` +
                    `${a.auditTitle ? ` (${a.auditTitle}: ${a.auditDocumentationLink} )` : ''}\n` +
                    `Expected ${a.operator} ${a.expected}, but found ${a.actual}`);
            });
            const text = `${assertions.length} result${assertions.length === 1 ? '' : 's'} for ${url}\n` +
                `${link ? `Report: ${link}\n` : ''}\n` +
                assertionsText.join('\n\n');
            const hasFailed = assertions.some((a) => a.level === 'error');
            if (hasFailed) {
                core.setFailed(text);
            }
            else {
                core.warning(text);
            }
        });
    });
}
exports.setAnnotations = setAnnotations;
