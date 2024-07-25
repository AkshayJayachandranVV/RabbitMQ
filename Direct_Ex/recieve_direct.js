const amqplib = require('amqplib')

const args = process.argv.slice(2)

if(args.length == 0){
    console.log("Usage recieve_logs_direct.js [info] [warning] [error]")
    process.exit(1)
}


const exchangeName = "direct_logs" 

// DIRECT EXCHANGE

const recieveMsg = async () => {
   
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()  //Pipeline to RabitMQ
    await channel.assertExchange(exchangeName,'direct', {durable:false})  // first checks EXCHANGE EXIST OR NOT , create queue   durable? -- rabitMq restart wont create a quueue
    const q = await channel.assertQueue('', {exclusive: true})  // Once connection terminated queue Deleted not giving the name bcoz new new queueue create every time
    console.log(`waiting for messages in queue : ${q.queue} `) 
    args.forEach(function(seveirty){   // ==>severity is the Routing Key
        channel.bindQueue(q.queue, exchangeName, seveirty)  //the last parameter is Binding key ====== Routing key
    })
    channel.consume(q.queue, msg => {
        if(msg.content)  console.log(`Routing key : ${msg.fields.routingKey}, Mesaage: ${msg.content.toString()}`)
    }, {noAck:true})  
}

recieveMsg()