const sessionDb = db.getSiblingDB("insta_clone");

function ensureCollection(name) {
  if (!sessionDb.getCollectionNames().includes(name)) {
    sessionDb.createCollection(name);
  }
}

function ensureUser(userName, password, role) {
  if (sessionDb.getUser(userName)) {
    sessionDb.updateUser(userName, {
      pwd: password,
      roles: [{ role, db: "insta_clone" }]
    });
    print(`Updated existing user '${userName}' with the requested role.`);
  } else {
    sessionDb.createUser({
      user: userName,
      pwd: password,
      roles: [{ role, db: "insta_clone" }]
    });
    print(`Created user '${userName}' with role '${role}'.`);
  }
}

ensureCollection("posts");
ensureCollection("comments");

if (sessionDb.posts.countDocuments() === 0) {
  sessionDb.posts.insertOne({
    author: "maya",
    caption: "First day on Insta Clone",
    likes: 12
  });
}

if (sessionDb.comments.countDocuments() === 0) {
  sessionDb.comments.insertOne({
    postAuthor: "maya",
    author: "dev",
    text: "Welcome!"
  });
}

print("Using database: insta_clone");
ensureUser("storyAdmin", "S8-Story-Admin", "dbAdmin");
ensureUser("feedViewer", "S8-Feed-Viewer", "read");

print("Users in insta_clone:");
sessionDb.getUsers().users.forEach(user => printjson(user));

print("Role meanings:");
print("read permits reading database data without changing it.");
print("dbAdmin permits database administration, such as managing collections and indexes, but not reading or writing application documents.");
print("The built-in read role applies to the whole database. This exercise creates only posts and comments as application collections.");