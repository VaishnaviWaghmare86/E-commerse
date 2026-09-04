const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    user: 'postgres',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Connect to the default database to issue the CREATE command
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server.');
    
    // Check if the database already exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'kids_ecommerce'");
    
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE kids_ecommerce;');
      console.log('Database "kids_ecommerce" created successfully!');
    } else {
      console.log('Database "kids_ecommerce" already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err.message);
  } finally {
    await client.end();
  }
}

createDatabase();
