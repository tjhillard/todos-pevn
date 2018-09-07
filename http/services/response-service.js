/**
 * @description Abstraction layer for handling JSON responses
 */
class ResponseService {
  /**
   *
   * @param {any} data
   */
  collection(data, meta = {}) {
    return {
      data,
      meta: {
        count: data.length,
        page_number: meta.page_number || null,
      },
    };
  }

  /**
   *
   * @param {any} data
   */
  resource(data) {
    let resource; // <-- returns this as the data prop
    if (Array.isArray(data)) {
      resource = data[0];
    } else {
      resource = data;
    }
    return {
      data: resource,
    };
  }

  /**
   *  ERRORS
   */

  internal500(details = {}) {
    return {
      error: true,
      status: 500,
      name: 'InternalServerError',
      message: 'Something wrong happened. Please try again later.',
      details,
    };
  }

  /**
  *
  * @param {Request=} req
  * @param {any=} details
  */
  badRequest400(details, message) {
    return {
      error: true,
      status: 400,
      name: 'BadRequest',
      message: message || 'The request is invalid',
      details,
    };
  }

  /**
   *
   * @param {Request} req
   */
  notFound404(req) {
    return {
      error: true,
      status: 404,
      name: 'NotFound',
      message: 'Unable to find resource with provided parameters',
      details: {
        url: req.originalUrl,
        params: req.params,
      },
    };
  }
}

module.exports = new ResponseService();
