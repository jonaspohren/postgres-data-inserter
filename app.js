const { fork } = require('child_process')
const { Client } = require('pg')
const os = require('os')
const config = require('./config')

;(async () => {
  let client
  const rows = parseInt(process.argv[2])
  const cpus = os.cpus().length
  const processes = cpus > rows ? rows : cpus
  const slice = Math.floor(rows / processes)
  const remainder = rows % processes

  client = new Client({ ...config.postgres, database: 'postgres' })

  await client.connect()
  await client.query(`CREATE DATABASE ${config.postgres.database}`).catch(err => err)
  await client.end()

  client = new Client(config.postgres)

  await client.connect()
  await client.query(`
    CREATE TABLE users (
      id BIGSERIAL NOT NULL PRIMARY KEY,
      name VARCHAR,
      company VARCHAR,
      company_size INT,
      job_title VARCHAR,
      email VARCHAR,
      password VARCHAR,
      created_at TIMESTAMP,
      updated_at TIMESTAMP)
  `).catch(err => err)
  await client.end()

  for (let i = 0; i < processes; i++) {
    const child = fork('./worker.js')

    child.send({ slice: i < processes - 1 ? slice : (slice + remainder) })
  }
})()
