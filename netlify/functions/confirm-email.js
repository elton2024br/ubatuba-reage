const { getAuth } = require('@netlify/identity-widget');

exports.handler = async (event, context) => {
  // Verifica se é uma requisição POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body);
    
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Aqui você pode implementar a lógica para confirmar o email
    // Por enquanto, vamos retornar sucesso
    console.log(`Confirmando email para: ${email}`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Email confirmed successfully',
        email: email
      })
    };
    
  } catch (error) {
    console.error('Erro ao confirmar email:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
