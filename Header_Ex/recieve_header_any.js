const amqplib = require('amqplib')

const exchangeName = "header_logs"

// HEADER EXCHANGE

const recieveMsg = async () => {
   
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()  //Pipeline to RabitMQ
    await channel.assertExchange(exchangeName,'headers', {durable:false})  //create queue   durable? -- rabitMq restart wont create a quueue
    const q = await channel.assertQueue('', {exclusive: true})  // Once connection terminated queue Deleted not giving the name bcoz new new queueue create every time
    console.log(`waiting for messages in queue : ${q.queue} `)
    channel.bindQueue(q.queue ,exchangeName, '',{'account': 'new' , 'method': 'facebook', 'x-match': 'any'}) //Avoid Routing Key, Passing Headers(x-match gives condition eg:any,all)
    channel.consume(q.queue, msg => {
        if(msg.content)  console.log(`Routing key: ${JSON.stringify(msg.properties.headers)} , Message: ${msg.content.toString()}`)
    }, {noAck:true})
}

recieveMsg()