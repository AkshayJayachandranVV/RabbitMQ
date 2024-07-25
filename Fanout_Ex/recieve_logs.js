const amqplib = require('amqplib')

const exchangeName = "logs" 

// FANOUT EXCHANGE

const recieveMsg = async () => {
   
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()  //Pipeline to RabitMQ
    await channel.assertExchange(exchangeName,'fanout', {durable:false})  //create queue   durable? -- rabitMq restart wont create a quueue
    const q = await channel.assertQueue('', {exclusive: true})  // Once connection terminated queue Deleted not giving the name bcoz new new queueue create every time
    console.log(`waiting for messages in queue : ${q.queue} `)
    channel.bindQueue(q.queue ,exchangeName, '')
    channel.consume(q.queue, msg => {
        if(msg.content)  console.log("The message is :", msg.content.toString())
    }, {noAck:true})
}

recieveMsg()