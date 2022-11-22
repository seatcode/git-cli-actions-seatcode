import * as core from '@actions/core'
import dayjs from 'dayjs'

import dayjsPluginUTC from 'dayjs/plugin/utc'
dayjs.extend(dayjsPluginUTC)

export async function time(): Promise<void> {
  const timezone = core.getInput('timeZone') // default: 0
  const formatStr = core.getInput('format') // default: ''
  const str = dayjs().utcOffset(timezone).format(formatStr)

  console.log('time zone: ', timezone)
  console.log('time format: ', formatStr)
  console.log('time formatStr: ', str)

  core.setOutput('time', str)
}
