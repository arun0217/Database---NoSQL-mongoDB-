const adminDb = db.getSiblingDB("admin");
let administratorLogin = false;
try {
  administratorLogin = adminDb.auth("session8Admin", "S8-Session8-Admin");
} catch (error) {
  if (error.code !== 18) {
    throw error;
  }
}

if (administratorLogin) {
  print("The session8 administrator already exists.");
} else {
  adminDb.createUser({
    user: "session8Admin",
    pwd: "S8-Session8-Admin",
    roles: [
      { role: "userAdminAnyDatabase", db: "admin" },
      { role: "readWriteAnyDatabase", db: "admin" }
    ]
  });
  print("Created the session8 administrator for this local exercise.");
}