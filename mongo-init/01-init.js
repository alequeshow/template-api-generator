// Create a test user for the application
db = db.getSiblingDB('template_api_db');

const appPassword = process.env.MONGO_LOCAL_PASSWORD;

if (!appPassword) {
  print('Error: Environment variable MONGO_LOCAL_PASSWORD is not set. Cannot create database user.');
  quit(1);
}
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