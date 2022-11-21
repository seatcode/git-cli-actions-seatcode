const core = require('@actions/core');
const github = require('@actions/github');

const dayjs = require('dayjs');
const dayjsPluginUTC = require('dayjs/plugin/utc')

dayjs.extend(dayjsPluginUTC)

async function main() {
	try {
		if (core.getInput('format') !== '') {
			manageTime();
		}
		if(core.getInput('string') !== ''){
			manageString();
		}
		


	} catch (error) {
		core.setFailed(error.message);
	}
}

main();



function manageTime(){
		const timezone = core.getInput('timeZone');// default: 0
		const formatStr = core.getInput('format');// default: ''
		console.log('time zone: ', timezone)
		console.log('time format: ', formatStr)
		const str = dayjs().utcOffset(timezone).format(formatStr)
		console.log("time formatStr: ", str)

		core.setOutput("time", str);
}

function manageString(){
		const inputStr = core.getInput('string');
		console.log(`Manipulating string: ${inputStr}`);

		const lowercase = inputStr.toLowerCase();
		console.log(`lowercase: ${lowercase}`);
		core.setOutput("lowercase", lowercase);

		const uppercase = inputStr.toUpperCase();
		console.log(`uppercase: ${uppercase}`);
		core.setOutput("uppercase", uppercase);

		const capitalized = inputStr.charAt(0).toUpperCase() + inputStr.slice(1).toLowerCase();
		console.log(`capitalized: ${capitalized}`);
		core.setOutput("capitalized", capitalized);
}