# Real-time D3 Charting of Sine Coordinate Data

## To Install

Within `./backend`:

- Create ".env": copy `env-template` and rename to `.env`
- Install dependencies: `npm i`
- Generate self-signed certificates (this worked on a mac): `openssl req -nodes -new -x509 -keyout server.key -out server.cert`
- Start dev server: `npm run dev`

> NOTE: Chrome might not accept the self signed certificate. You can allow self-signed certs on localhost by setting `allow-insecure-localhost` to `enabled`. Visit: `chrome://flags/#allow-insecure-localhost`

Within `./frontend`:

- Create ".env": copy `env-template` and rename to `.env`
- Install dependencies: `npm i`
- Start dev server: `npm run start`

> NOTE: If you edit the server settings in `./backend/.env` make sure to keep `./frontend/.env` in sync. There is a dependency between the two files.

If you used the defaults, the backend will be at [https://localhost:8000](https://localhost:8000) and the frontend at [https://localhost:3000](https://localhost:3000)

## Of note

- [BE] When the server is running it logs the sine data. Websockets provide the realtime updates. The logs are accessed at GET '/'.
