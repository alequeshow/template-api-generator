// Create a test user for the application
db = db.getSiblingDB('template_api_db');

// Create a user for the application
db.createUser({
  user: 'appuser',
  pwd: 'apppassword123',
  roles: [
    {
      role: 'readWrite',
      db: 'template_api_db'
    }
  ]
});

print('Database initialization completed successfully!');