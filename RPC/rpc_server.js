const amqplib = require('amqplib')

const queueName = "rpc_queue"  // ===> routing key

function fibinocci(n){
    if(n==0 || n==1){
        return n;
    }else{
        return fibinocci(n - 1) + fibinocci(n - 2)
    }
}


// REMOTE PROCEDURE CALL

const processTask = async () => {
   
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()  //Pipeline to RabitMQ
    await channel.assertQueue(queueName, {durable:false})  //create queue   durable? -- rabitMq restart wont create a quueue
    channel.prefetch(1)
    console.log("[x] Waiting for RPC requests")
    channel.consume(queueName, msg => {
        const n = parseInt(msg.content.toString())
        console.log(" [.] fib(%d)", n)

        const fibNum = fibinocci(n)

        channel.sendToQueue(msg.properties.replyTo, Buffer.from(fibNum.toString()),{
            correlationId: msg.properties.correlationId
        })

        channel.ack(msg)

    }, {noAck:false})
}

processTask()