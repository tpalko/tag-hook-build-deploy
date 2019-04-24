const nodeCouchDb = require('node-couchdb');

const db = {
  client: new nodeCouchDb({
      host: 'couchdb_frank',
      protocol: 'http',
      port: 5984
    }),
  databases: {
    hooks_db: { name: "github_hooks" },
    config_db: { name: "deployment_configurations", view: "_design/deploys/_view/deploy_by_name" }
  }
}

module.exports = db
