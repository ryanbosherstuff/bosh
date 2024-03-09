import bodyParser from 'body-parser'
import express, { type Request, type Response } from 'express'

import { type AppInfo } from './AppInfo'
import { type UpdateResponse } from './UpdateResponse'

const host = process.env.HOST ?? '0.0.0.0'
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

const app = express()
app.use(bodyParser.json())

// This works, but nothing else does.
const demoCapGoAppURL = 'https://github.com/Cap-go/demo-app/releases/download/0.0.3-v4/dist.zip'

app.post('/updates/test', (req: Request, res: Response) => {
  const appInfo = req.body as AppInfo

  console.log('BOSH: main: appInfo:', appInfo)

  // Test incremental updates. We have already updated to 0.0.2 to send 0.0.3
  if (appInfo.version_name === '0.0.2') {
    console.log('BOSH: main: appInfo.version_name:', appInfo.version_name)
    res.status(200).send({
      version: '0.0.3',
      url: 'http://github.com/ryanbosherstuff/bosh/releases/download/0.0.3/test-0.0.3.zip'
      // url: baseURL + 'test-0.0.3.zip'
    })

    return
  } else {
    console.log('BOSH: main: sending 0.0.2 update!')
    res.status(200).send({
      version: '0.0.2',
      url: demoCapGoAppURL,
      // url: 'http://github.com/ryanbosherstuff/bosh/releases/download/0.0.2/nz.co.bosher.app_0.0.2.zip'
      // url: baseURL + 'test-0.0.2.zip'
    })

    return
  }
})

app.post('/updates/uat', (req: Request, res: Response) => {
  const appInfo = req.body as AppInfo
  console.log('BOSH: main: appInfo:', appInfo)

  const responseBody: UpdateResponse = {
    version: '',
    url: '',
    message: 'TODO'
  }

  res.status(400).send(responseBody)
})

app.post('/updates/stage', (req: Request, res: Response) => {
  const appInfo = req.body as AppInfo
  console.log('BOSH: main: appInfo:', appInfo)

  const responseBody: UpdateResponse = {
    version: '',
    url: '',
    message: 'TODO'
  }

  res.status(400).send(responseBody)
})

app.post('/updates/prod', (req: Request, res: Response) => {
  const appInfo = req.body as AppInfo
  console.log('BOSH: main: appInfo:', appInfo)

  const responseBody: UpdateResponse = {
    version: '',
    url: '',
    message: 'TODO'
  }

  res.status(400).send(responseBody)
})

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`)
})
