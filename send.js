const amqplib = require('amqplib')

const queueName = "hello"  // ===> routing key
const msg = "Hello Friends "

// DIRECT EXCHANGE

const sendMsg = async () => {
   
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()  //Pipeline to RabitMQ
    await channel.assertQueue(queueName, {durable:false})  //create queue   durable? -- rabitMq restart wont create a quueue
    channel.sendToQueue(queueName,Buffer.from(msg)) //send msg to queue
    console.log("sent: " , msg)
    setTimeout(()=>{
        connection.close()
        process.exit()
    },500)
}

sendMsg()