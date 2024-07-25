const amqplib = require('amqplib')

const queueName = "hello"  // ===> routing key

// DIRECT EXCHANGE

const recieveMsg = async () => {
   
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()  //Pipeline to RabitMQ
    await channel.assertQueue(queueName, {durable:false})  //create queue   durable? -- rabitMq restart wont create a quueue
    console.log(`waiting for messages in queue : ${queueName} `)
    channel.consume(queueName, msg => {
        console.log(" [X] Received : ",msg.content.toString())
    }, {noAck:true})
}

recieveMsg()