import { fork } from 'child_process'
import pg from 'pg'
import os from 'os'

const rows = parseInt(process.argv[2])
const workers = parseInt(process.argv[3]) || os.cpus().length
const slice = Math.floor(rows / workers)
const remainder = rows % workers

const client = new pg.Client({ connectionString: process.env.PG_CONNECTION_STRING })

await client.connect()

await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR,
    company VARCHAR,
    company_size INT,
    job_title VARCHAR,
    email VARCHAR,
    password VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
  )
`)

await client.end()

for (let i = 0; i < workers; i++) {
  const child = fork('./worker.mjs')

  child.send({ id: i, slice: i < workers - 1 ? slice : (slice + remainder) })
}
