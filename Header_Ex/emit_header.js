const amqplib = require('amqplib')

const exchangeName = "header_logs"  
const args = process.argv.slice(2)
const msg =  args[1] || "Hello Logs"
const logType = args[0]   // ===> routing key

// HEADER EXCHANGE

const sendMsg = async () => {
   
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()  //Pipeline to RabitMQ
    await channel.assertExchange(exchangeName,'headers', {durable:false})  //create queue   durable? -- rabitMq restart wont create a quueue
    channel.publish(exchangeName, "",Buffer.from(msg),{headers:{account: 'new', method: 'google'}}) //publish msg to queue (Ignore Routing Key bcoz Header Ex)
    console.log("sent: " , msg)
    setTimeout(()=>{
        connection.close()
        process.exit()
    },500)
}

sendMsg()