import * as core from '@actions/core'
import {time} from './action/time'
import {labels} from './action/labels'
import {lightHouseMain} from './action/lighthouse'

async function run(): Promise<void> {
  try {
    await lightHouseMain()

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
