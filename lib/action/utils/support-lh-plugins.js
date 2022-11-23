"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/treosh/lighthouse-ci-action/pull/19
//
// Append the node_modules of the github workspace and the node_modules of this action
// to NODE_PATH. This supports lighthouse plugins - all the workspace needs to do is
// `npm install` the plugin. The copy of lighthouse within this action will be used.
const path_1 = require("path");
const nodePathDelim = ':'; //linux, ubuntu
const nodePathParts = [
    ...(process.env.NODE_PATH || '').split(nodePathDelim),
    (0, path_1.join)(__dirname, '../../node_modules'),
    process.env.GITHUB_WORKSPACE ? (0, path_1.join)(process.env.GITHUB_WORKSPACE, '/node_modules') : null,
].filter(Boolean);
process.env.NODE_PATH = nodePathParts.join(nodePathDelim);
