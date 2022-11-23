import {join} from 'path'
import fs from 'fs/promises'
import {existsSync} from 'fs'

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

export async function getLinks(resultsPath: any): Promise<any> {
  const linksPath = join(resultsPath, 'links.json')
  if (!existsSync(linksPath)) return null
  return /** @type {Object<string,string>} */ JSON.parse(
    await fs.readFile(linksPath, 'utf8')
  )
}

/**
 * Get assertions grouped by url and sorted with error first.
 *
 * @param {string} resultsPath
 */

export async function getAssertionResults(resultsPath: any): Promise<any> {
  const assertionResultsPath = join(resultsPath, 'assertion-results.json')
  if (!existsSync(assertionResultsPath)) return null
  return /** @type {LHCIAssertion[]} **/ JSON.parse(
    await fs.readFile(assertionResultsPath, 'utf8')
  )
}

/**
 * Reads manifest.json file and returns the content of that file.
 *
 * @param {string} resultsPath
 */

export async function getManifest(resultsPath: any): Promise<any> {
  const manifestPath = join(resultsPath, 'manifest.json')
  if (!existsSync(manifestPath)) return null
  return /** @type {LHCIManifest[]} **/ JSON.parse(
    await fs.readFile(manifestPath, 'utf8')
  )
}
