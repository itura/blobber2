# Blobber 2

```bash
yarn install
yarn dev
```
   
Builds the server into `dist` and client into `public`, then runs the server. It will serve the client app out of public.

Requires postgres server set up with:
- port: 5432
- user: blobber 
- database: blobber

## Database setup
Use `scripts/database.sh` to manage a Postgres 10.4 database with Docker. Simply run it before running the app. See the file for detailed instructions. 