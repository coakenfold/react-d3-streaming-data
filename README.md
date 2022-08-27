# Real-time D3 Charting of Sine Coordinate Data

## To Install

Within `./backend`:

- Create ".env": copy `env-template` and rename to `.env`
- Install dependencies: `npm i`
- Start dev server: `npm run buildStart`

Within `./frontend`:

- Create ".env": copy `env-template` and rename to `.env`
- Install dependencies: `npm i`
- Start dev server: `npm run start`

If you used the `.env` defaults, the backend will be at [http://localhost:8000](http://localhost:8000) and the frontend at [http://localhost:3000](http://localhost:3000)

## Of note

- [BE] When the server is running it logs the sine data. Websockets provide the realtime updates. The logs are accessed at GET '/'.
