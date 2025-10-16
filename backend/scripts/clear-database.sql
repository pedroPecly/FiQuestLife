-- ============================================
-- SCRIPT DE LIMPEZA DO BANCO DE DADOS
-- ============================================
-- 
-- Este script limpa todos os dados da tabela users
-- Use com cuidado! Isso vai deletar TODOS os usuários
-- 
-- Como executar:
-- 1. Copie o comando abaixo
-- 2. Execute no Prisma Studio ou em algum cliente PostgreSQL

TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- O que esse comando faz:
-- - TRUNCATE TABLE users: Remove todos os dados da tabela users
-- - RESTART IDENTITY: Reseta o contador de IDs (se tiver auto-increment)
-- - CASCADE: Remove também dados relacionados em outras tabelas

-- Depois de executar, a tabela ficará vazia e pronta para novos dados!
