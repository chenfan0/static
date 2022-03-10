"use strict";

/**
 * Module dependencies.
 */

const debug = require("debug")("koa-static");
const { resolve } = require("path");
const assert = require("assert");
const sents = require("koa-sents");
const history = require("koa-history-api-fallback");

/**
 * Expose `serve()`.
 */

module.exports = serve;

/**
 * Serve static files from `root`.
 *
 * @param {String} root
 * @param {Object} [opts]
 * @return {Function}
 * @api public
 */

function serve(root, opts) {
  opts = Object.assign(Object.create(null), opts);
  opts.history = opts.history === true ? {} : void 0;

  assert(root, "root directory is required to serve files");

  // options
  debug('static "%s" %j', root, opts);
  opts.root = resolve(root);
  if (opts.index !== false) opts.index = opts.index || "index.html";

  if (!opts.defer) {
    return async function serve(ctx, next) {
      if (opts.history !== undefined) {
        await history(opts.history)(ctx, next);
      }
      let done = false;

      if (ctx.method === "HEAD" || ctx.method === "GET") {
        try {
          done = await sents(ctx, ctx.path, opts);
        } catch (err) {
          if (err.status !== 404) {
            throw err;
          }
        }
      }

      if (!done) {
        await next();
      }
    };
  }

  return async function serve(ctx, next) {
    if (opts.history !== undefined) {
      await history(opts.history)(ctx, next);
    }
    await next();

    if (ctx.method !== "HEAD" && ctx.method !== "GET") return;
    // response is already handled
    if (ctx.body != null || ctx.status !== 404) return; // eslint-disable-line

    try {
      await sents(ctx, ctx.path, opts);
    } catch (err) {
      if (err.status !== 404) {
        throw err;
      }
    }
  };
}

