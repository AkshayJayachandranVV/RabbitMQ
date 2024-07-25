const amqplib = require('amqplib')

const exchangeName = "topic_logs"  
const args = process.argv.slice(2)
const msg =  args[1] || "Hello Logs"
const logType = args[0]   // ===> routing key

// TOPIC EXCHANGE

const sendMsg = async () => {
   
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()  //Pipeline to RabitMQ
    await channel.assertExchange(exchangeName,'topic', {durable:false})  //create queue   durable? -- rabitMq restart wont create a quueue
    channel.publish(exchangeName, logType,Buffer.from(msg)) //publish msg to queue
    console.log("sent: " , msg)
    setTimeout(()=>{
        connection.close()
        process.exit()
    },500)
}

sendMsg()