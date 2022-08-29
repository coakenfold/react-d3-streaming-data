# Real-time D3 Charting of Sine Coordinate Data

Frontend: [http://sinedata-frontend.herokuapp.com/](http://sinedata-frontend.herokuapp.com/)

Backend: [http://sinedata-backend.herokuapp.com/](http://sinedata-backend.herokuapp.com/)

## To run locally

Within `./backend`:

- Create ".env": copy `env-template` and rename to `.env`
- Install dependencies: `npm i`
- Start dev server: `npm run buildStart`

Within `./frontend`:

- Create ".env": copy `env-template` and rename to `.env`
- Install dependencies: `npm i`
- Start dev server: `npm run start`

If you used the `.env` defaults, the backend will be at [http://localhost:8000](http://localhost:8000) and the frontend at [http://localhost:3000](http://localhost:3000)

## Notes

### Frontend

- Using `Redux` to save data from the backend
- Using `D3` to draw the sine data in the graph. Graph is responsive
- Using `@tanstack/react-table` to render the table. Table is responsive
- Using `Jest` to test `react` & `redux`
- Has a retry mechanism for fetching graph & table data. Notifies user of status & error. **NOTE:** I deployed the app using Heroku so it's useful for cold starts

### Backend

- While the server is running it logs the sine data to the filesystem. The logs can be accessed via a `GET` to `/`
- Websockets provides realtime updates for the graph
