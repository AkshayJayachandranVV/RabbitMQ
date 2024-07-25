const amqplib = require('amqplib')

const queueName = "task"  // ===> routing key

console.log(process.argv.slice(2).join(' ') ," testing the data")
const msg =  process.argv.slice(2).join(' ') || "Hello Friends" //user input


// DIRECT EXCHANGE

const sendMsg = async () => {
   
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()  //Pipeline to RabitMQ
    await channel.assertQueue(queueName, {durable: true})  //create queue   durable? -- its TRUE IF rabitMq restart IT will create a quueue
    channel.sendToQueue(queueName,Buffer.from(msg), {persistent: true}) //send msg to queue
    console.log("sent: " , msg)
    setTimeout(()=>{
        connection.close()
        process.exit()
    },500)
}

sendMsg()