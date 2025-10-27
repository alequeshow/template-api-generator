// Create a test user for the application
db = db.getSiblingDB('template_api_db');

const appPassword = process.env.MONGO_LOCAL_PASSWORD;

// Create a user for the application
db.createUser({
  user: 'appuser',
  pwd: appPassword,
  roles: [
    {
      role: 'readWrite',
      db: 'template_api_db'
    }
  ]
});

print('Database initialization completed successfully!');