/**
 * Utilitário de logging centralizado.
 *
 * Em desenvolvimento (__DEV__ = true): exibe todos os logs normalmente.
 * Em produção (__DEV__ = false): todas as chamadas são no-op.
 *
 * O babel-plugin-transform-remove-console também remove os console.*
 * diretos no bundle de produção, mas este logger é útil quando você
 * quer controle explícito ou quer manter algum nível de log em prod.
 */

const noop = () => {};

const logger = __DEV__
  ? {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console),
      debug: console.debug.bind(console),
    }
  : {
      log: noop,
      warn: noop,
      error: noop,
      info: noop,
      debug: noop,
    };

export default logger;
