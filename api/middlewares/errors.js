//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file middlewares/errors.js 
// 
//  @description Middlewares for application that handle errors
//  from controllers
//  ---------------------------------------------------------

'use strict'

/**
 * @file middlewares/errors.js 
 * @description returns a 404 (Not Found) error response
 */
exports.NotFound = (req, res, next) => {
  const notFound = new Error("Not Found");
  notFound.status = 404;
  next(notFound);
}

/**
 * @file middlewares/errors.js 
 * @description returns a the server error message. If no error
 * message is provided, returns 500 error response
 */
exports.ServerError = (err, req, res, next) => {
  const errorStatus = err.status || 500;
  res.status(errorStatus).json({
    error: err.message
  });
  next();
}
