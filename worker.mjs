import faker from 'faker'
import fecha from 'fecha'
import pg from 'pg'

process.on('message', async (message) => {
  const client = new pg.Client({ connectionString: process.env.PG_CONNECTION_STRING })
  const slice = message.slice
  const workerId = message.id
  const batchSize = slice < 100 ? slice : 100
  let queries = []
  let values = []

  await client.connect()

  for (let i = 0; i < slice; i++) {
    values.push(`
      '${faker.name.findName().replace(/'/g, '\'\'')}',
      '${faker.company.companyName().replace(/'/g, '\'\'')}',
      ${faker.random.number()},
      '${faker.name.jobTitle()}',
      '${faker.internet.email()}',
      '${faker.internet.password()}',
      '${fecha.format(faker.date.past(), 'YYYY-MM-DD HH:mm:ss.SS')}',
      '${fecha.format(faker.date.recent(), 'YYYY-MM-DD HH:mm:ss.SS')}'
    `)

    if ((i + 1) % batchSize === 0 || i === slice - 1) {
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
        VALUES ${values.map((value) => `(${value})`).join(',')}
      `))

      values = []

      if (queries.length >= 25 || i === slice - 1) {
        await Promise.all(queries)

        queries = []
      }
    }
  }

  await client.end()

  process.exit()
})

