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

    // Log para debug
    console.log(`Confirmando email para: ${email}`);
    
    // Retorna sucesso (a confirmação real seria feita via API do Netlify)
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Email confirmation request received',
        email: email,
        note: 'Check your email for confirmation link'
      })
    };
    
  } catch (error) {
    console.error('Erro ao processar confirmação de email:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
