   # Blobber 2

   ```bash
   yarn install
   yarn dev
   ```

   Runs both client and server. Requires postgres server set up with:
   - port: 5432
   - user: blobber 
   - database: blobber
   
   ## Database setup
   Use `scripts/database.sh` to manage a Postgres 10.4 database with Docker. Simply run it before running the app. See the file for detailed instructions. 