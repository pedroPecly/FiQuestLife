/**
 * ============================================
 * MIDDLEWARE DE TRATAMENTO DE ERROS
 * ============================================
 * 
 * Middlewares são códigos que rodam "no meio" do processo.
 * Este aqui é especial: ele captura QUALQUER erro que acontecer
 * na API e transforma em uma resposta JSON bonitinha.
 * 
 * Sem isso, quando desse erro, a API crasharia ou retornaria HTML feio.
 * 
 * Exemplo: Se você tentar acessar uma propriedade de um objeto null,
 * em vez de quebrar tudo, esse middleware pega o erro e retorna JSON.
 */

import type { Context } from 'hono';

export const errorMiddleware = (err: Error, c: Context) => {
  // Mostra o erro no terminal (pra gente debugar)
  console.error('Error:', err);

  // Retorna uma resposta JSON pro cliente
  // Status 500 = Internal Server Error (erro do servidor)
  return c.json(
    {
      error: err.message || 'Internal Server Error',  // Mensagem do erro
      timestamp: new Date().toISOString(),             // Quando aconteceu
    },
    500  // Código HTTP de erro
  );
};
