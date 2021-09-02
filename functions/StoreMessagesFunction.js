const util = require('util')
const AWS = require('aws-sdk')

const ddb = new AWS.DynamoDB.DocumentClient()

const TableName = process.env.TABLE_MESSAGESLOGTABLE

module.exports.handler = async (event, context) => {
  console.log(`Handling message`, util.inspect(event, { depth: 5 }))

  const tasks = event.Records.map(record => {
    const body = JSON.parse(record.body)
    return ddb.put({
      TableName,
      Item: {
        'pk': new Date().toISOString(),
        'topicArn': body.TopicArn,
        'message': body.Message
      }
    }).promise()
  })

  await Promise.all(tasks)
}