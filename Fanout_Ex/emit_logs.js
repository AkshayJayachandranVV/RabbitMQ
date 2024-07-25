const amqplib = require('amqplib')

const exchangeName = "logs"  
const msg =  process.argv.slice(2).join(' ') || "Hello Logs"

// FANOUT EXCHANGE

const sendMsg = async () => {
   
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()  //Pipeline to RabitMQ
    await channel.assertExchange(exchangeName,'fanout', {durable:false})  //create queue   durable? -- rabitMq restart wont create a quueue
    channel.publish(exchangeName,'',Buffer.from(msg)) //publish msg to queue
    console.log("sent: " , msg)
    setTimeout(()=>{
        connection.close()
        process.exit()
    },500)
}

sendMsg()