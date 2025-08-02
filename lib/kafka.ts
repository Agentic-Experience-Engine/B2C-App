import { Kafka, Partitioners } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'b2c-app-amazon-clone',
  brokers: ['localhost:29092'],
})

export const produceEvent = async (topic: string, message: object) => {
  const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  })
  try {
    await producer.connect()
    await producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(message) }],
    })
  } catch (error) {
    console.error('Error sending kafka event:', error)
  } finally {
    await producer.disconnect()
    console.log('Producer is now disconnected')
  }
}
export default kafka
