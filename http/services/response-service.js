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

  /**
  *
  * @param {Request=} req
  * @param {any=} details
  */
  badRequest400(details, message) {
    return {
      error: true,
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
      message: 'Unable to find resource with provided parameters',
      details: {
        url: req.originalUrl,
        params: req.params,
      },
    };
  }
}

module.exports = new ResponseService();
