const sessionDb = db.getSiblingDB("insta_clone");
const connectionStatus = db.runCommand({ connectionStatus: 1 });
const authenticatedUsers = connectionStatus.authInfo.authenticatedUsers;

if (!authenticatedUsers.some(user => user.user === "feedViewer" && user.db === "insta_clone")) {
  throw new Error("The shell did not authenticate as feedViewer in insta_clone.");
}

print("Authenticated as feedViewer. Attempting to insert into posts...");
try {
  sessionDb.posts.insertOne({
    _id: "session8-readonly-permission-check",
    author: "feedViewer",
    caption: "This insert must be denied"
  });
  throw new Error("Unexpectedly inserted a document with the read role.");
} catch (error) {
  if (error.code !== 13) {
    throw error;
  }
  print(`Expected authorization error (code ${error.code}): ${error.message}`);
}