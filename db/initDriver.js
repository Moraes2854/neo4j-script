const neo4j = require('neo4j-driver');

let driver;

async function initDriver(uri, username, password) {
  driver = neo4j.driver(
    uri,
    neo4j.auth.basic(
      username,
      password
    )
  )

  await driver.verifyConnectivity()

  return driver
}

function getDriver() {
  return driver
}

async function closeDriver() {
  if (driver) {
    await driver.close()
  }
}

module.exports = { initDriver, getDriver, closeDriver };