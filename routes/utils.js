'use strict'

// Helper function that wrappers an express js handler
// And resolves its promise calling next.
// @param {fn} fn function wrapper.
// @returns {fn} function with promise resolve.
const wrap = fn => (req, res, next) => fn(req, res, next).catch(next)

module.exports = { wrap }
