const { StatusConstant } = App.Constants;
export default class BaseInterface {
  _getDefaultOptions(url, method, data, async) {
    return {
      url: url,
      method: method,
      data: data,
      dataType: "",
      async: async,
      cache: false,
      traditional: true
      // xhrFields: {
      //     withCredentials: true
      // }
    };
  }
  /**
   * 匹配参数
   */
  _matchArguments(args) {
    let data = {},
      callback = false,
      contentType = "";
    if (args.length >= 2) {
      if (typeof args[1] === "object") {
        data = args[1];
        callback = args[2];
        if (args[3] && typeof args[3] === "string") {
          contentType = args[3];
        }
      } else if (typeof args[1] === "function") {
        callback = args[1];
        if (args[2] && typeof args[2] === "string") {
          contentType = args[2];
        }
      }
    }
    return [data, callback, contentType];
  }

  // 处理error_ajax_message请求
  _handleMessage(responseText) {
    try {
      const res = JSON.parse(responseText);
      return res.error.message;
    } catch (err) {
      return _ts_("message.ajax.server.exception");
    }
  }
  // 处理ajax请求
  @autowired
  _handleAjax(url, method, data, async, callback, contentType) {
    const result = {
      status: StatusConstant.AJAX_ERROR,
      data: {},
      message: ""
    };
    const options = this._getDefaultOptions(url, method, data, async);
    if (method === "post") {
      if (!contentType) {
        options.data = JSON.stringify(data);
        options.contentType = "application/json";
      } else {
        options.contentType = contentType;
      }
    }
    options.success = function(res) {
      result.status = StatusConstant.AJAX_SUCCESS;
      result.data = res;
      async && callback && callback(result);
    };
    options.error = function(xhr, status, error) {
      result.status = xhr.status;
      let message = this._handleMessage(xhr.responseText);
      let errorObj = {}
      switch (xhr.status) {
        case StatusConstant.AJAX_ERROR: // 请求未发起
          result.message = _ts_("message.ajax.server.error");
          break;
        case StatusConstant.AJAX_NOACCESS: // 403禁止访问(token过期)
          // window.UYUN_CORE.location.href = "/tenant/#/login_admin/";
          window.UYUN_CORE.toLogin();
          break;
        case StatusConstant.AJAX_SERVER_ERROR: // 500
          result.message = message;
          break;
        case StatusConstant.AJAX_BAD_GATEWAY: // 502
          result.message = message;
          break;
        case StatusConstant.AJAX_SERVICE_UNAVAILABLE: // 503
          result.message = message;
          break;
        case StatusConstant.AJAX_TIMEOUT_BAD_GATEWAY: // 504
          result.message = message;
          break;
        case StatusConstant.AJAX_BAD_REQUEST: //400
          result.message =
            (message && message) ||
            _ts_("message.ajax.server.parameters.exception");
          errorObj = JSON.parse(xhr.responseText);
          break;
        case StatusConstant.AJAX_NOT_FOUND: //404
          result.message = _ts_("message.ajax.server.unfound");
          break;
      }
      if (errorObj.error && errorObj.error.context && errorObj.error.context.context) {
        for (let key in errorObj.error.context.context) {
          !result.errorCode && (result.errorCode = [])
          result.errorCode.push(key);
        }
      }
      async && callback && callback(result);
    }.bind(this);
    Logger.debug(options.url, options.data);
    console.log('options===>',options)
    $.ajax(options);
    if (async) {
      return true;
    } else {
      return result;
    }
  }
  /**
   * 异步ajax
   */
  ajax(url, method, data, callback, contentType) {
    this._handleAjax(url, method, data, true, callback, contentType);
  }
  /**
   * 异步get
   * 除url为固定参数外，后面可跟随2个不定参数
   * 第二个参数可以是object和function
   * 如果有第三个参数，那么第三个参数必须是function，第二个参数是object
   */
  ajaxGet(url) {
    let [data, callback] = this._matchArguments(arguments);
    return this.ajax(url, "get", data, callback);
  }
  /**
   * 异步post
   */
  ajaxPost(url) {
    let [data, callback, contentType] = this._matchArguments(arguments);
    return this.ajax(url, "post", data, callback, contentType);
  }
  /**
   * 异步patch
   */
  // ajaxPatch(url) {
  //   let [data, callback] = this._matchArguments(arguments);
  //   return this.ajax(url, "patch", data, callback);
  // }
  // /**
  //  * 异步delete
  //  */
  // ajaxDelete(url) {
  //   let [data, callback] = this._matchArguments(arguments);
  //   return this.ajax(url, "delete", data, callback);
  // }
  /**
   * 同步Ajax
   */
  syncAjax(url, method, data) {
    return this._handleAjax(url, method, data, false);
  }
  /**
   * 同步get
   */
  syncAjaxGet(url, data) {
    data = (data && data) || {};
    return this.syncAjax(url, "get", data);
  }
  /**
   * 同步post
   */
  syncAjaxPost(url, data) {
    data = (data && data) || {};
    return this.syncAjax(url, "post", data);
  }
}