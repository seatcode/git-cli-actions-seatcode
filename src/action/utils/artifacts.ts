import artifact from '@actions/artifact'
import {PathLike} from 'fs'
import fs from 'fs/promises'
import {join} from 'path'

/** @param {string} resultsPath */
export async function uploadArtifacts(
  resultsPath: PathLike,
  artifactName = 'lighthouse-results'
) {
  const artifactClient = artifact.create()
  const fileNames = await fs.readdir(resultsPath)
  if (typeof resultsPath === 'string') {
    const files = fileNames.map(fileName => join(resultsPath, fileName))
    return artifactClient.uploadArtifact(artifactName, files, resultsPath, {
      continueOnError: true
    })
  }
}
