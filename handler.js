const stripe = require('stripe')(process.env.STRIPE_SECRET)

module.exports.webhook = async event => {
  const body = JSON.parse(event.body)

  try {
    const event = await stripe.events.retrieve(body.id)

    if (event.type === 'source.chargeable') {


      const src = await stripe.sources.retrieve(
        body.data.object.id);

      if(src.status === 'chargeable') {
        await stripe.charges.create({
          amount: body.data.object.amount,
          currency: 'cad',
          source: body.data.object.id
        })
      }

     
    } else {
      console.log({event, body})
    }
  } catch (error) {
      console.error(error)
      return { statusCode: 400, 
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,'Access-Control-Allow-Origin': '*' // Or use wildard * for testing
        },
      body: JSON.stringify(
        {
          message: error,
        }
      )
    }
  }
  return { statusCode: 200, 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body) 
  }
}