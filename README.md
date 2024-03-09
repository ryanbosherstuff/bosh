# This readme is bad, I'm sorry

## Steps to demo:

Install deps

```sh
pnpm i
```

Serve the update server locally

```sh
pnpm serve:server
```

Build and open the native project
```sh
pnpm build:app && pnpm sync:app:android && pnpm open:app:android
```

Run the app from android studio
