const faker = require('faker')
const fecha = require('fecha')
const { Client } = require('pg')
const config = require('./config')

process.on('message', async (message) => {
  const client = new Client(config.postgres)
  const queries = []

  await client.connect()

  for (let i = 0; i < message.slice; i++) {
    queries.push(client.query(`
      INSERT INTO users (
        name,
        company,
        company_size,
        job_title,
        email,
        password,
        created_at,
        updated_at)
      VALUES (
        '${faker.name.findName().replace(/'/g, '\'\'')}',
        '${faker.company.companyName().replace(/'/g, '\'\'')}',
        ${faker.random.number()},
        '${faker.name.jobTitle()}',
        '${faker.internet.email()}',
        '${faker.internet.password()}',
        '${fecha.format(faker.date.past(), 'YYYY-MM-DD HH:mm:ss.SS')}',
        '${fecha.format(faker.date.recent(), 'YYYY-MM-DD HH:mm:ss.SS')}')
    `))
  }

  await Promise.all(queries)
  await client.end()

  process.exit()
})

