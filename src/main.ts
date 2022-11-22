import * as core from '@actions/core'
import {time} from './action/time'
import {labels} from './action/labels'

async function run(): Promise<void> {
  try {
    if (core.getInput('format') !== '') {
      await time()
    }
    if (core.getInput('string') !== '') {
      await labels()
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
