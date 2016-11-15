const Promise = require('bluebird')
const moment = require('moment')

var knex = null

function initializeDb() {
  if (!knex) {
    throw new Error('you must initialize the database before')
  }

  return knex.schema.createTableIfNotExists('broadcast_schedules', function (table) {
    table.string('id').primary()
    table.date('ts')
    table.boolean('user_timezone')
    table.string('text')
    table.string('type')
    table.boolean('outboxed')
    table.integer('total_count')
    table.integer('sent_count')
    table.timestamp('created_on')
  })
  .then(function() {
    return knex.schema.createTableIfNotExists('broadcast_outbox', function (table) {
      table.string('scheduleId').references('schedules.id')
      table.string('userId').references('users.id')
      table.primary(['scheduleId', 'userId'])
      table.timestamp('ts')
    })
  })
}

module.exports = {
  initializeDb
}