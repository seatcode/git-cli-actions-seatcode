import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import {time} from '../src/action/time'
import {labels} from '../src/action/labels'

test('check - time action', async () => {
  await time()
})

test('check - time strings', async () => {
  await labels()
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['string'] = 'This is A TeSt'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
