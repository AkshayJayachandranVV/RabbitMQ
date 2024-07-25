const amqplib = require('amqplib')
const { v4: uuidvv4} = require('uuid')

// REMOTE PROCEDURE CALL

const args =  process.argv.slice(2)

if(args.length==0){
    console.log("Usage: rpc_client.js num")
    process.exit(1)
}

const num = parseInt(args[0])
const uuid =  uuidvv4()

const getFib = async () => {
   
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()  //Pipeline to RabitMQ
    const q = await channel.assertQueue('', {exclusive: true})  //create queue   exclusive ? ==> once program ends it delete the Queue
 
    console.log(' [x] Requesting fib(%d)',num)

    channel.sendToQueue('rpc_queue',Buffer.from(num.toString()),{
        replyTo: q.queue,
        correlationId: uuid
    }) //send num to queue

   channel.consume(q.queue, msg => {
    if(msg.properties.correlationId == uuid){
        console.log(' [.] Got %s' ,msg.content.toString())
        setTimeout(()=>{
            connection.close()
            process.exit()
        },500)
    }
   },{noAck: true})
}

getFib()