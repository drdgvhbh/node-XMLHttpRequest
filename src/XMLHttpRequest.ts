import { parse } from 'url';
import http from 'http';
import https from 'https';
import { readFile, readFileSync } from 'fs';
import {
  InvalidStateDOMException,
  SyntaxErrDOMException,
  SecurityErrDOMException,
} from './DOMException';
import * as Methods from './methods';
import { URL } from 'url';
import * as Headers from './headers';
import { spawnSync } from 'child_process';
import { Response, CoreOptions } from 'request';

const defaultHeaders = {
  'User-Agent': 'node-XMLHttpRequest',
  Accept: '*/*',
};

interface Settings {
  url: string;
  method: string;
  async: boolean;
  user: string | null;
  password: string | null;
}

export class XMLHttpRequest {
  private request: http.ClientRequest | undefined | null;

  private response: http.IncomingMessage | undefined | null;

  private settings: Settings;

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

  private _timeout: number;

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
    this.settings = {
      url: '',
      method: 'GET',
      async: true,
      user: null,
      password: null,
    };
    this._responseText = '';
    this._responseType = '';
    this._responseXML = null;
    this.onreadystatechange = null;
    this._status = 0;
    this._timeout = 0;
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
    if (type === 'document') {
      return;
    }
    if (this._readyState === this.LOADING || this._readyState === this.DONE) {
      throw new InvalidStateDOMException(
        `the state is must not be loading or done`,
      );
    }
    this._responseType = type;
  }

  public get responseURL(): string {
    if (!this.response) {
      return '';
    }
    return this.response.url || '';
  }

  public get timeout(): number {
    return this._timeout;
  }

  public set timeout(t: number) {
    this._timeout = t;
  }

  public open(
    method: string,
    url: string,
    async = true,
    user: string | null = null,
    password: string | null = null,
  ): void {
    if (!Methods.isValid(method)) {
      throw new SyntaxErrDOMException('method is not a valid method');
    }
    if (Methods.isForbidden(method)) {
      throw new SecurityErrDOMException('method is forbidden');
    }

    try {
      this.settings = {
        method: Methods.normalize(method),
        url: new URL(url).toString(),
        async,
        user: user,
        password: password,
      };
    } catch (err) {
      throw new SyntaxErrDOMException('invalid url');
    }

    this.abort();
    this.errorFlag = false;

    this.setState(this.OPENED);
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
    let host = '';
    // Determine the server
    switch (url.protocol) {
      case 'https:':
        ssl = true;
        host = url.hostname || '';
        break;
      case 'http:':
        host = url.hostname || '';
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
          host = url.hostname || '';
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
            this.sendFlag = false;
            this.setState(this.DONE);
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
      const url = new URL(this.settings.url);
      const requestParams: CoreOptions = {
        headers: this.headers,
        body: data,
      };
      const result = spawnSync(process.execPath, [
        require.resolve('./worker'),
        url.toString(),
        JSON.stringify(requestParams),
      ]);
      if (result.status === 0) {
        const resp: Response = JSON.parse(result.stdout.toString().trim());
        this.response = resp as any;
        this._status = resp.statusCode;
        this._responseText = resp.body;
        this.setState(this.DONE);
      } else {
        this._status = 0;
        this._statusText = '';
        this._responseText = result.stderr.toString();
        this.errorFlag = true;
        this.setState(this.DONE);
        this.dispatchEvent('error');
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
      throw new InvalidStateDOMException('state is not opened');
    }

    /*     if (!this.isAllowedHttpHeader(header)) {
      throw new Error('Refused to set unsafe header "' + header + '"');
    } */
    if (this.sendFlag) {
      throw new Error('INVALID_STATE_ERR: send flag is true');
    }
    if (Headers.isForbidden(header)) {
      return;
    }
    header = this.headersCase[header.toLowerCase()] || header;
    this.headersCase[header.toLowerCase()] = header;
    this.headers[header] = this.headers[header]
      ? this.headers[header] + ', ' + value
      : value;
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
