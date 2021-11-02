const fetch = require('node-fetch')

const PIPE_VARS = require('./.pipe-vars.json')

const NOTIFIER_WEBHOOK = process.argv[2]
const BUILD_FINAL_STEP = process.argv[3] === 'final' ? true : false
const BUILD_SUCCESS = PIPE_VARS.BITBUCKET_EXIT_CODE === '0' ? true : false 

const buildNotify = async () => {
	try {
		// Send build notification only when:
		// 1. Build errors on any step
		// 2. Build is on a final step and succeeds

		// Exit if required NOTIFIER_WEBHOOK repository variable has been set in the user's bitbucket repo
		if (!NOTIFIER_WEBHOOK) {
			console.log('Error: Required repository variable `NOTIFIER_WEBHOOK` not set')
			return
		}

		// Exit if a non-final step succeeds
		if (!BUILD_FINAL_STEP && BUILD_SUCCESS) {
			return
		}

		// Construct teams message
		let teamsMessage = ''
		teamsMessage += messageHeader()
		teamsMessage += buildRepo()
		teamsMessage += buildBranch()
		teamsMessage += buildCommit()
		teamsMessage += buildPr()
		teamsMessage += buildPrTarget()
		teamsMessage += buildNumber()
		teamsMessage += buildStatus()
		teamsMessage += buildTime()
		teamsMessage += messageFooter()

		// Send notification and log success
		console.log('Sending build status notification for ' + PIPE_VARS.BITBUCKET_REPO_FULL_NAME + ' (#' + PIPE_VARS.BITBUCKET_BUILD_NUMBER + ')')
		const notifyResp = await fetch(NOTIFIER_WEBHOOK, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				'text': teamsMessage
			}),
		})

		if (notifyResp.statusText != 'OK') {
			console.log('Error: Webhook notification returned status ' + notifyResp.statusText)
		}
	} catch (err) {
		console.log(err)
	}
}

const messageHeader = () => {
	return '<table border="0">'
}

const buildRepo = () => {
	return '<tr style="border-bottom: 1px solid grey"><td align="right"><b>Repo:</b></td><td><a href="' + PIPE_VARS.BITBUCKET_GIT_HTTP_ORIGIN + '" style="text-decoration:underline">' + PIPE_VARS.BITBUCKET_REPO_FULL_NAME + '</a></td></tr>'
}

const buildBranch = () => {
	return '<tr style="border-bottom: 1px solid grey"><td align="right"><b>Branch:</b></td><td><a href="' + PIPE_VARS.BITBUCKET_GIT_HTTP_ORIGIN + '/branch/' + PIPE_VARS.BITBUCKET_BRANCH + '" style="text-decoration:underline">' + PIPE_VARS.BITBUCKET_BRANCH + '</a></td></tr>'
}

const buildPr = () => {
	if (!PIPE_VARS.BITBUCKET_PR_ID) {
		return ''
	}

	return '<tr style="border-bottom: 1px solid grey"><td align="right"><b>PR:</b></td><td><a href="' + PIPE_VARS.BITBUCKET_GIT_HTTP_ORIGIN + '/pull-requests/' + PIPE_VARS.BITBUCKET_PR_ID + '" style="text-decoration:underline">#' + PIPE_VARS.BITBUCKET_PR_ID + '</a></td></tr>'
}

const buildPrTarget = () => {
	if (!PIPE_VARS.BITBUCKET_PR_ID) {
		return ''
	}

	return '<tr style="border-bottom: 1px solid grey"><td align="right"><b>Target:</b></td><td><a href="' + PIPE_VARS.BITBUCKET_GIT_HTTP_ORIGIN + '/branch/' + PIPE_VARS.BITBUCKET_PR_DESTINATION_BRANCH + '" style="text-decoration:underline">' + PIPE_VARS.BITBUCKET_PR_DESTINATION_BRANCH + '</a></td></tr>'
}

const buildCommit = () => {
	return '<tr style="border-bottom: 1px solid grey"><td align="right"><b>Commit:</b></td><td><a href="' + PIPE_VARS.BITBUCKET_GIT_HTTP_ORIGIN + '/commits/' + PIPE_VARS.BITBUCKET_COMMIT + '" style="text-decoration:underline">' + PIPE_VARS.BITBUCKET_COMMIT.substring(0, 7) + '</a></td></tr>'
}

const buildNumber = () => {
	return '<tr style="border-bottom: 1px solid grey"><td align="right"><b>Build:</b></td><td><a href="' + PIPE_VARS.BITBUCKET_GIT_HTTP_ORIGIN + '/addon/pipelines/home#!/results/' + PIPE_VARS.BITBUCKET_BUILD_NUMBER + '"  style="text-decoration:underline">' + PIPE_VARS.BITBUCKET_BUILD_NUMBER + '</a></td></tr>'
}

const buildStatus = () => {
	// Return build failure
	if (!BUILD_SUCCESS) {
		const failedEmojiList = ['🙀','😱','😵']
		const failedEmoji = failedEmojiList[Math.floor(Math.random() * failedEmojiList.length)]
		return '<tr style="border-bottom: 1px solid grey"><td align="right"><b>Status:</b></td><td><span style="color:#d60000">BUILD FAILED ' + failedEmoji + '</span></td></tr>'
	}

	// Return build success
	const successEmojiList = ['🥇','🏆','🎖','🎉','🚀','🛫','🏋','💪','👏','💯']
	const successEmoji = successEmojiList[Math.floor(Math.random() * successEmojiList.length)]
	return '<tr style="border-bottom: 1px solid grey"><td align="right"><b>Status:</b></td><td><span style="color:#12a102">BUILD SUCCESS ' + successEmoji + '</span></td></tr>'
}

const buildTime = () => {
	const currentDateTime = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
	return '<tr><td align="right"><b>Time:</b></td><td width="320">' + currentDateTime + '</td></tr>'
}

const messageFooter = () => {
	return '</table>'
}

buildNotify()
