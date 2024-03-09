import express, { type Request, type Response } from 'express'
import { join } from 'node:path'

import { type AppInfo } from './AppInfo'
import { type UpdateResponse } from './UpdateResponse'

const host = process.env.HOST ?? '0.0.0.0'
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

const app = express()

app.use(express.static(join(__dirname, 'assets')))

app.post('/updates/test', (req: Request, res: Response) => {
	const appInfo = req.body as AppInfo
	console.log('BOSH: main: appInfo:', appInfo)

	const url = `${req.protocol}://${req.get('host')}/assets/dist.zip`;

	const responseBody: UpdateResponse = {
		version: '0.0.2',
		url
	}

	res.status(200).send(responseBody)
})

app.post('/updates/uat', (req: Request, res: Response) => {
	const appInfo = req.body as AppInfo
	console.log('BOSH: main: appInfo:', appInfo)

	const responseBody: UpdateResponse = {
		version: '0.0.2',
		url: ''
	}

	if (appInfo.version_code === '0.0.1') {
		responseBody.message = 'UAT updates paused.'
	}

	res.status(200).send(responseBody)
})

app.post('/updates/stage', (req: Request, res: Response) => {
	const appInfo = req.body as AppInfo
	console.log('BOSH: main: appInfo:', appInfo)

	const responseBody: UpdateResponse = {
		version: '0.0.2',
		url: ''
	}

	res.status(200).send(responseBody)
})

app.post('/updates/prod', (req: Request, res: Response) => {
	const appInfo = req.body as AppInfo
	console.log('BOSH: main: appInfo:', appInfo)

	const responseBody: UpdateResponse = {
		version: '0.0.2',
		url: ''
	}

	res.status(200).send(responseBody)
})

app.listen(port, host, () => {
	console.log(`[ ready ] http://${host}:${port}`)
})
