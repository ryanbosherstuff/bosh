import bodyParser from 'body-parser'
import express, { type Request, type Response } from 'express'

import { type AppInfo } from './AppInfo'
import { type UpdateResponse } from './UpdateResponse'

const host = process.env.HOST ?? '0.0.0.0'
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

const app = express()
app.use(bodyParser.json());

const baseURL = 'http://github.com/ryanbosherstuff/bosh/raw/main/updates/'

app.post('/updates/test', (req: Request, res: Response) => {
  const appInfo = req.body as AppInfo
  console.log('BOSH: main: appInfo:', appInfo)

  // Test incremental updates
  if (appInfo.version_code !== '0.0.2') {
    res.status(200).send({
      version: '0.0.2',
      url: baseURL + 'test-0.0.2.zip'
    })
  } else {
    res.status(200).send({
      version: '0.0.3',
      url: baseURL + 'test-0.0.3.zip'
    })
  }
})

app.post('/updates/uat', (req: Request, res: Response) => {
  const appInfo = req.body as AppInfo
  console.log('BOSH: main: appInfo:', appInfo)

  const responseBody: UpdateResponse = {
    version: '0.0.2',
    url: baseURL + 'uat.zip'
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
    url: baseURL + 'stage.zip'
  }

  res.status(200).send(responseBody)
})

app.post('/updates/prod', (req: Request, res: Response) => {
  const appInfo = req.body as AppInfo
  console.log('BOSH: main: appInfo:', appInfo)

  const responseBody: UpdateResponse = {
    version: '0.0.2',
    url: baseURL + 'prod.zip'
  }

  res.status(200).send(responseBody)
})

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`)
})
