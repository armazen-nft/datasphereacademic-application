// ============================================
// MONGODB INITIALIZATION SCRIPT
// ============================================

db = db.getSiblingDB('moltbook_academic');

// Create collections
db.createCollection('users');
db.createCollection('articles');
db.createCollection('validations');

// Create indexes
db.users.createIndex({ "id": 1 }, { unique: true });
db.users.createIndex({ "reputation.score": -1 });
db.users.createIndex({ "type": 1, "reputation.level": 1 });

db.articles.createIndex({ "id": 1 }, { unique: true });
db.articles.createIndex({ "status": 1, "createdAt": -1 });
db.articles.createIndex({ "authorId": 1 });
db.articles.createIndex({ "keywords": 1 });
db.articles.createIndex({ "qualityScores.overall": -1 });

db.validations.createIndex({ "articleId": 1 });
db.validations.createIndex({ "validatorId": 1 });

// Insert initial admin users (if needed)
print('Database initialized successfully');
