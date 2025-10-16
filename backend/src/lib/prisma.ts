/**
 * ============================================
 * CONFIGURAÇÃO DO PRISMA CLIENT
 * ============================================
 * 
 * Prisma é o ORM (Object-Relational Mapping) que a gente usa
 * pra conversar com o banco de dados sem escrever SQL puro.
 * 
 * Em vez de escrever:
 *   SELECT * FROM users WHERE id = 1
 * 
 * A gente escreve:
 *   prisma.user.findUnique({ where: { id: 1 } })
 * 
 * Muito mais fácil né? 😎
 * 
 * ============================================
 * POR QUE ESSE CÓDIGO MEIO ESTRANHO?
 * ============================================
 * 
 * No desenvolvimento, quando você salva um arquivo, o servidor reinicia.
 * Se criássemos um novo PrismaClient toda vez, ia ter várias conexões
 * abertas com o banco ao mesmo tempo = problema!
 * 
 * Então, a gente guarda o cliente numa variável global.
 * Se já existir, reutiliza. Se não, cria um novo.
 * 
 * É tipo um Singleton Pattern (padrão de projeto que você vê na faculdade!)
 */

import { PrismaClient } from '@prisma/client';

// Cria um tipo pro globalThis incluir o prisma
// (TypeScript pede isso pra saber que existe uma propriedade prisma)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Se já tiver um prisma criado, usa ele. Se não, cria um novo.
// O operador ?? é tipo: "se for null/undefined, use o que tá depois"
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Em desenvolvimento, salva o cliente na variável global
// pra não criar vários clientes quando o servidor reiniciar
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * ============================================
 * COMO USAR ESSE ARQUIVO?
 * ============================================
 * 
 * Em qualquer arquivo, importe assim:
 *   import { prisma } from './lib/prisma.js';
 * 
 * Aí pode usar pra fazer queries:
 *   const users = await prisma.user.findMany();
 *   const user = await prisma.user.create({ data: { name: 'Pedro' } });
 */
