# Postgres Data Inserter

```
docker build -t postgres-data-inserter .
docker run -e PG_CONNECTION_STRING='postgresql://USER:PASSWORD@HOST:PORT/DATABASE' postgres-data-inserter <NUMBER_OF_ROWS_TO_INSERT> <NUMBER_OF_WORKERS>
```