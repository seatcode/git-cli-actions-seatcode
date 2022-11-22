import * as core from '@actions/core'
import dayjs from 'dayjs'

export async function time(): Promise<void> {
  const timezone = core.getInput('timeZone') // default: 0
  const formatStr = core.getInput('format') // default: ''
  const str = dayjs(new Date(), formatStr, timezone).utcOffset()
  /**
   *   console.log('time zone: ', timezone)
   *   console.log('time format: ', formatStr)
   *   console.log('time formatStr: ', str)
   */
  core.setOutput('time', str)
}
