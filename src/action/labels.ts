import * as core from '@actions/core'

export async function labels(): Promise<void> {
  const inputStr = core.getInput('string')
  doLogic(inputStr)
}

function doLogic(inputStr: string): void {
  console.log(`Manipulating string: ${inputStr}`)
  const lowercase = inputStr.toLowerCase()
  console.log(`lowercase: ${lowercase}`)
  core.setOutput('lowercase', lowercase)
  const uppercase = inputStr.toUpperCase()
  console.log(`uppercase: ${uppercase}`)
  core.setOutput('uppercase', uppercase)
  const capitalized =
    inputStr.charAt(0).toUpperCase() + inputStr.slice(1).toLowerCase()
  console.log(`capitalized: ${capitalized}`)
  core.setOutput('capitalized', capitalized)
}
