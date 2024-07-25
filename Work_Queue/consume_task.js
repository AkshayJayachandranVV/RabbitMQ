const amqplib = require('amqplib')

const queueName = "task"  // ===> routing key

// DIRECT EXCHANGE

const consumeMsg = async () => {
   
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()  //Pipeline to RabitMQ
    await channel.assertQueue(queueName, {durable: true})  //create queue   durable? -- rabitMq restart wont create a quueue
    channel.prefetch(1)  // wait until a service gives ACK that it finishes the task
    console.log(`waiting for messages in queue : ${queueName} `)
    channel.consume(queueName, msg => {
        const secs= msg.content.toString().split('.').length - 1
        console.log(" [X] Received : ",msg.content.toString())
        setTimeout(() => {
            console.log("Resizing images is done")
            channel.ack(msg)
        },secs*1000)
    }, {noAck:true})
}

consumeMsg()