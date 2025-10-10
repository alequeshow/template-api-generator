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

// Create initial collections if needed
db.createCollection('Status');

// Insert some sample data
// db.Status.insertMany([
//   {
//     _id: ObjectId(),
//     Value: "Running",
//     Description: "Application is running successfully",
//     TimeStamp: new Date()
//   },
//   {
//     _id: ObjectId(),
//     Value: "Healthy",
//     Description: "Database connection is healthy",
//     TimeStamp: new Date()
//   }
// ]);

print('Database initialization completed successfully!');