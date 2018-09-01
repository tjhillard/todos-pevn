/* eslint class-methods-use-this: 'off' */

class ResponseService {
  collection(data) {
    return {
      success: true,
      data,
    };
  }

  resource(data) {
    let resource; // <-- returns this as the data prop
    if (Array.isArray(data)) {
      resource = data[0];
    } else {
      resource = data;
    }
    return {
      success: true,
      data: resource,
    };
  }

  /**
   *  ERRORS
   */
  badRequest400(req, details) {
    return {
      success: false,
      message: 'Bad request',
      details,
    };
  }

  notFound404(req) {
    console.log(req);
    return {
      success: false,
      message: 'Unable to find resource with provided parameters',
      details: {
        url: req.originalUrl,
        params: req.params,
      },
    };
  }
}

module.exports = new ResponseService();
