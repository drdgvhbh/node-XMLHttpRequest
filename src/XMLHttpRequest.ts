import { parse } from 'url';
import { spawn } from 'child_process';
import http from 'http';
import https from 'https';
import {
  readFile,
  readFileSync,
  writeFileSync,
  existsSync,
  unlinkSync,
} from 'fs';

const forbiddenRequestHeaders = [
  'accept-charset',
  'accept-encoding',
  'access-control-request-headers',
  'access-control-request-method',
  'connection',
  'content-length',
  'content-transfer-encoding',
  'cookie',
  'cookie2',
  'date',
  'expect',
  'host',
  'keep-alive',
  'origin',
  'referer',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'via',
];

const forbiddenRequestMethods = ['TRACE', 'TRACK', 'CONNECT'];

const defaultHeaders = {
  'User-Agent': 'node-XMLHttpRequest',
  Accept: '*/*',
};

const isAllowedHttpMethod = (method: string): boolean => {
  return Boolean(method) && forbiddenRequestMethods.indexOf(method) === -1;
};

export class XMLHttpRequest {
  private request: http.ClientRequest | undefined | null;

  private response: http.IncomingMessage | undefined | null;

  private settings: Record<string, any>;

  private disableHeaderCheck: boolean;

  private headers: Record<string, string>;

  private readonly headersCase: Record<string, string>;

  private sendFlag: boolean;

  private errorFlag: boolean;

  private _status: number;

  private _readyState: number;

  private _responseXML: Document | null;

  private _responseText: string;

  private _statusText: string;

  private _responseType: XMLHttpRequestResponseType;

  private readonly listeners: Record<string, Function[]>;

  public readonly UNSENT = 0;

  public readonly OPENED = 1;

  public readonly HEADERS_RECEIVED = 2;

  public readonly LOADING = 3;

  public readonly DONE = 4;

  public onreadystatechange: ((this: XMLHttpRequest, ev: Event) => any) | null;

  public withCredentials: boolean;

  constructor() {
    this.sendFlag = false;
    this.errorFlag = false;
    this._readyState = this.UNSENT;
    this.headers = {};
    this.headersCase = {};
    this.listeners = {};
    this.settings = {};
    this.disableHeaderCheck = false;
    this._responseText = '';
    this._responseType = '';
    this._responseXML = null;
    this.onreadystatechange = null;
    this._status = 0;
    this._statusText = '';
    this.withCredentials = false;
  }

  public get statusText(): string {
    return this._statusText;
  }

  public get responseXML(): Document | null {
    return this._responseXML;
  }

  public get responseText(): string {
    return this._responseText;
  }

  public get readyState(): number {
    return this._readyState;
  }

  public get status(): number {
    return this._status;
  }

  public get responseType(): XMLHttpRequestResponseType {
    return this._responseType;
  }

  public set responseType(type: XMLHttpRequestResponseType) {
    if (type !== 'document') {
      // do something
    }
    this._responseType = type;
  }

  /**
   * Sends the request to the server.
   *
   * @param string data Optional data to send as request body.
   */
  public send(data?: string | null) {
    if (this.readyState !== this.OPENED) {
      throw new Error(
        'INVALID_STATE_ERR: connection must be opened before send() is called',
      );
    }
    if (this.sendFlag) {
      throw new Error('INVALID_STATE_ERR: send has already been called');
    }
    let ssl = false,
      local = false;
    const url = parse(this.settings.url);
    let host;
    // Determine the server
    switch (url.protocol) {
      case 'https:':
        ssl = true;
        break;
      // SSL & non-SSL both need host, no break here.
      case 'http:':
        host = url.hostname;
        break;
      case 'file:':
        local = true;
        break;
      case undefined:
      case null:
      case '':
        host = 'localhost';
        break;
      default:
        throw new Error('Protocol not supported.');
    }
    // Load files off the local filesystem (file://)
    if (local) {
      if (this.settings.method !== 'GET') {
        throw new Error('XMLHttpRequest: Only GET method is supported');
      }
      if (this.settings.async) {
        readFile(url.pathname || '', 'utf8', (error, data) => {
          if (error) {
            this.handleError(error);
          } else {
            this._status = 200;
            this._responseText = data;
            this.setState(this.DONE);
          }
        });
      } else {
        try {
          this._responseText = readFileSync(url.pathname || '', 'utf8');
          this._status = 200;
          this.setState(this.DONE);
        } catch (e) {
          this.handleError(e);
        }
      }
      return;
    }
    // Default to port 80. If accessing localhost on another port be sure
    // to use http://localhost:port/path
    const port = url.port || (ssl ? 443 : 80);
    // Add query string if one is used
    const uri = url.pathname + (url.search ? url.search : '');
    // Set the defaults if they haven't been set
    for (const name in defaultHeaders) {
      if (!this.headersCase[name.toLowerCase()]) {
        this.headers[name] = defaultHeaders[name];
      }
    }
    // Set the Host header or the server may reject the request
    this.headers.Host = host;
    // IPv6 addresses must be escaped with brackets
    if (
      url.host && url.host.length > 0 ? url.host[0] : '' === ('[' as string)
    ) {
      this.headers.Host = '[' + this.headers.Host + ']';
    }
    if (!((ssl && port === 443) || port === 80)) {
      this.headers.Host += ':' + url.port;
    }
    // Set Basic Auth if necessary
    if (this.settings.user) {
      if (typeof this.settings.password === 'undefined') {
        this.settings.password = '';
      }
      const authBuf = new Buffer(
        this.settings.user + ':' + this.settings.password,
      );
      this.headers.Authorization = 'Basic ' + authBuf.toString('base64');
    }
    // Set content length header
    if (this.settings.method === 'GET' || this.settings.method === 'HEAD') {
      data = null;
    } else if (data) {
      this.headers['Content-Length'] = Buffer.isBuffer(data)
        ? data.length.toString()
        : Buffer.byteLength(data).toString();
      if (!this.getRequestHeader('Content-Type')) {
        this.headers['Content-Type'] = 'text/plain;charset=UTF-8';
      }
    } else if (this.settings.method === 'POST') {
      // For a post with no data set Content-Length: 0.
      // This is required by buggy servers that don't meet the specs.
      this.headers['Content-Length'] = '0';
    }
    const options = {
      host: host,
      port: port,
      path: uri,
      method: this.settings.method,
      headers: this.headers,
      agent: false,
      withCredentials: this.withCredentials,
    };
    // Reset error flag
    this.errorFlag = false;
    // Handle async requests
    if (this.settings.async) {
      // Use the proper protocol
      const doRequest = ssl ? https.request : http.request;
      // Request is being sent, set send flag
      this.sendFlag = true;
      // As per spec, this is called here for historical reasons.
      this.dispatchEvent('readystatechange');

      const errorHandler = (error) => {
        this.handleError(error);
      };
      // Handler for the response
      const responseHandler = (resp) => {
        // Set response var to the response we got back
        // This is so it remains accessable outside this scope
        this.response = resp;
        // Check for redirect
        // @TODO Prevent looped redirects
        if (
          resp.statusCode === 301 ||
          resp.statusCode === 302 ||
          resp.statusCode === 303 ||
          resp.statusCode === 307
        ) {
          // Change URL to the redirect location
          this.settings.url = resp.headers.location;
          const url = parse(this.settings.url);
          // Set host var in case it's used later
          host = url.hostname;
          // Options for the new request
          const newOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.path,
            method: resp.statusCode === 303 ? 'GET' : this.settings.method,
            headers: this.headers,
            withCredentials: this.withCredentials,
          };
          // Issue the new request
          this.request = doRequest(newOptions, responseHandler).on(
            'error',
            errorHandler,
          );
          this.request.end();
          // @TODO Check if an XHR event needs to be fired here
          return;
        }
        resp.setEncoding('utf8');
        this.setState(this.HEADERS_RECEIVED);
        this._status = resp.statusCode;
        resp.on('data', (chunk) => {
          // Make sure there's some data
          if (chunk) {
            this._responseText += chunk;
          }
          // Don't emit state changes if the connection has been aborted.
          if (this.sendFlag) {
            this.setState(this.LOADING);
          }
        });
        resp.on('end', () => {
          if (this.sendFlag) {
            // Discard the end event if the connection has been aborted
            this.setState(this.DONE);
            this.sendFlag = false;
          }
        });
        resp.on('error', (error) => {
          this.handleError(error);
        });
      };
      // Create the request
      this.request = doRequest(options, responseHandler).on(
        'error',
        errorHandler,
      );
      // Node 0.4 and later won't accept empty data. Make sure it's needed.
      if (data) {
        this.request.write(data);
      }
      this.request.end();
      this.dispatchEvent('loadstart');
    } else {
      // Synchronous
      // Create a temporary file for communication with the other Node process
      const contentFile = '.node-xmlhttprequest-content-' + process.pid;
      const syncFile = '.node-xmlhttprequest-sync-' + process.pid;
      writeFileSync(syncFile, '', 'utf8');
      // The async request the other Node process executes
      const execString =
        "var http = require('http'), https = require('https'), fs = require('fs');" +
        'var doRequest = http' +
        (ssl ? 's' : '') +
        '.request;' +
        'var options = ' +
        JSON.stringify(options) +
        ';' +
        "var responseText = '';" +
        'var req = doRequest(options, function(response) {' +
        "response.setEncoding('utf8');" +
        "response.on('data', function(chunk) {" +
        '  responseText += chunk;' +
        '});' +
        "response.on('end', function() {" +
        "fs.writeFileSync('" +
        contentFile +
        "', JSON.stringify({err: null, data: {statusCode: response.statusCode, headers: response.headers, text: responseText}}), 'utf8');" +
        "fs.unlinkSync('" +
        syncFile +
        "');" +
        '});' +
        "response.on('error', function(error) {" +
        "fs.writeFileSync('" +
        contentFile +
        "', JSON.stringify({err: error}), 'utf8');" +
        "fs.unlinkSync('" +
        syncFile +
        "');" +
        '});' +
        "}).on('error', function(error) {" +
        "fs.writeFileSync('" +
        contentFile +
        "', JSON.stringify({err: error}), 'utf8');" +
        "fs.unlinkSync('" +
        syncFile +
        "');" +
        '});' +
        (data
          ? "req.write('" +
            JSON.stringify(data)
              .slice(1, -1)
              .replace(/'/g, "\\'") +
            "');"
          : '') +
        'req.end();';
      // Start the other Node Process, executing this string
      const syncProc = spawn(process.argv[0], ['-e', execString]);
      while (existsSync(syncFile)) {
        // Wait while the sync file is empty
      }
      const resp = JSON.parse(readFileSync(contentFile, 'utf8'));
      // Kill the child process once the file has data
      syncProc.stdin.end();
      // Remove the temporary file
      unlinkSync(contentFile);
      if (resp.err) {
        this.handleError(resp.err);
      } else {
        this.response = resp.data;
        this._status = resp.data.statusCode;
        this._responseText = resp.data.text;
        this.setState(this.DONE);
      }
    }
  }

  public getRequestHeader(name: string) {
    if (typeof name === 'string' && this.headersCase[name.toLowerCase()]) {
      return this.headers[this.headersCase[name.toLowerCase()]];
    }
    return '';
  }

  /**
   * Gets all the response headers.
   *
   * @return string A string with all response headers separated by CR+LF
   */
  public getAllResponseHeaders() {
    if (this.readyState < this.HEADERS_RECEIVED || this.errorFlag) {
      return '';
    }
    let result = '';
    const headers = this.response ? this.response.headers : {};
    for (const i in headers) {
      // Cookie headers are excluded
      if (i !== 'set-cookie' && i !== 'set-cookie2') {
        result += i + ': ' + headers[i] + '\r\n';
      }
    }
    return result.substr(0, result.length - 2);
  }

  public getResponseHeader(header: string) {
    if (
      typeof header === 'string' &&
      this.readyState > this.OPENED &&
      this.response &&
      this.response.headers &&
      this.response.headers[header.toLowerCase()] &&
      !this.errorFlag
    ) {
      return this.response.headers[header.toLowerCase()];
    }
    return null;
  }

  public handleError(error): void {
    this._status = 0;
    this._statusText = error;
    this._responseText = error.stack;
    this.errorFlag = true;
    this.setState(this.DONE);
    this.dispatchEvent('error');
  }

  public abort(): void {
    if (this.request) {
      this.request.abort();
      this.request = null;
    }
    this.headers = defaultHeaders;
    this._status = 0;
    this._responseText = '';
    this._responseXML = null;
    this.errorFlag = true;
    if (
      this.readyState !== this.UNSENT &&
      (this.readyState !== this.OPENED || this.sendFlag) &&
      this.readyState !== this.DONE
    ) {
      this.sendFlag = false;
      this.setState(this.DONE);
    }
    this._readyState = this.UNSENT;
    this.dispatchEvent('abort');
  }

  public addEventListener(event: string, callback: Function): void {
    if (!(event in this.listeners)) {
      this.listeners[event] = [];
    }
    // Currently allows duplicate callbacks. Should it?
    this.listeners[event].push(callback);
  }

  public removeEventListener(event: string, callback: Function): void {
    if (event in this.listeners) {
      // Filter will return a new array with the callback removed
      this.listeners[event] = this.listeners[event].filter(function(ev) {
        return ev !== callback;
      });
    }
  }

  public dispatchEvent(event: string): void {
    if (typeof this['on' + event] === 'function') {
      this['on' + event]();
    }
    if (event in this.listeners) {
      for (let i = 0, len = this.listeners[event].length; i < len; i++) {
        this.listeners[event][i].call(this);
      }
    }
  }

  public setRequestHeader(header: string, value: string): void {
    if (this.readyState !== this.OPENED) {
      throw new Error(
        'INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN',
      );
    }

    if (!this.isAllowedHttpHeader(header)) {
      throw new Error('Refused to set unsafe header "' + header + '"');
    }
    if (this.sendFlag) {
      throw new Error('INVALID_STATE_ERR: send flag is true');
    }
    header = this.headersCase[header.toLowerCase()] || header;
    this.headersCase[header.toLowerCase()] = header;
    this.headers[header] = this.headers[header]
      ? this.headers[header] + ', ' + value
      : value;
  }

  /**
   * Disables or enables isAllowedHttpHeader() check the request. Enabled by default.
   * This does not conform to the W3C spec.
   *
   * @public
   * @param {boolean} state Enable or disable header checking.
   */
  public setDisableHeaderCheck(state: boolean): void {
    this.disableHeaderCheck = state;
  }

  public open(
    method: string,
    url: string,
    async?: boolean,
    user?: string,
    password?: string,
  ): void {
    this.abort();
    this.errorFlag = false;

    if (!isAllowedHttpMethod(method)) {
      throw new Error('SecurityError: Request method not allowed');
    }
    this.settings = {
      method: method,
      url: url.toString(),
      async: typeof async !== 'boolean' ? true : async,
      user: user || null,
      password: password || null,
    };
    this.setState(this.OPENED);
  }

  private isAllowedHttpHeader(header: string): boolean {
    return (
      this.disableHeaderCheck ||
      (Boolean(header) &&
        forbiddenRequestHeaders.indexOf(header.toLowerCase()) === -1)
    );
  }

  private setState(state: number): void {
    if (state == this.LOADING || this.readyState !== state) {
      this._readyState = state;
      if (
        this.settings.async ||
        this.readyState < this.OPENED ||
        this.readyState === this.DONE
      ) {
        this.dispatchEvent('readystatechange');
      }
      if (this.readyState === this.DONE && !this.errorFlag) {
        this.dispatchEvent('load');
        // @TODO figure out InspectorInstrumentation::didLoadXHR(cookie)
        this.dispatchEvent('loadend');
      }
    }
  }
}
