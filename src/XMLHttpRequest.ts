import {
  InvalidStateDOMException,
  SyntaxErrDOMException,
  SecurityErrDOMException,
} from './DOMException';
import * as Methods from './methods';
import { URL } from 'url';
import * as Headers from './headers';
import { spawnSync } from 'child_process';
import request, { Response, CoreOptions } from 'request';
import newReducer from './redux';
import { createStore, Store, applyMiddleware } from 'redux';
import { DOMEvent, XMLHttpRequestProgressEvent } from './DOMEvent';
import { createEpicMiddleware } from 'redux-observable';
import * as fromActions from './actions';
import { rootEpic } from './epics';
import {
  onListenersSelector,
  flagsSelector,
  sendFlagSelector,
  errorFlagSelector,
} from './selectors';

interface Settings {
  url: string;
  method: Methods.AllowedMethod;
  async: boolean;
  username: string | null;
  password: string | null;
}

type RootState = ReturnType<ReturnType<typeof newReducer>>;

class NodeXMLHttpRequest {
  private request: request.Request | undefined;

  private _response: request.Response | undefined;

  private settings: Settings;

  private headers: Record<string, string>;

  private readonly headersCase: Record<string, string>;

  private _status: number;

  private _responseXML: Document | null;

  private _responseText: string;

  private _statusText: string;

  private _responseType: XMLHttpRequestResponseType;

  private _timeout: number;

  private store: Store<RootState, fromActions.Actions>;

  private _readyState = (state: RootState) => state.readyState;

  public readonly UNSENT = 0;

  public readonly OPENED = 1;

  public readonly HEADERS_RECEIVED = 2;

  public readonly LOADING = 3;

  public readonly DONE = 4;

  public readonly upload: XMLHttpRequestUpload;

  public onabort:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;

  public onerror:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;

  public onload:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;

  public onloadend:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;

  public onloadstart:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;

  public onprogress:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;

  public ontimeout:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;

  public withCredentials: boolean;

  constructor() {
    this.headers = {};
    this.headersCase = {};
    this.upload = null as any; // TODO
    this.settings = {
      url: '',
      method: 'GET',
      async: true,
      username: null,
      password: null,
    };
    this._responseText = '';
    this._responseType = '';
    this._responseXML = null;
    this._status = 0;
    this._timeout = 0;
    this._statusText = '';
    this.withCredentials = false;

    const epicMiddleware = createEpicMiddleware();
    this.store = createStore(newReducer(), applyMiddleware(epicMiddleware));

    epicMiddleware.run(rootEpic as any);
  }

  public get response(): any {
    return this._response;
  }

  public get onreadystatechange():
    | ((this: XMLHttpRequest, ev: DOMEvent) => any)
    | null {
    return onListenersSelector(this.store.getState()).readystatechange;
  }

  public set onreadystatechange(
    cb: ((this: XMLHttpRequest, ev: DOMEvent) => any) | null,
  ) {
    this.store.dispatch(
      fromActions.Actions.setCallbackHandler({ type: 'readystatechange', cb }),
    );
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
    return this._readyState(this.store.getState());
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
    if (this.readyState === this.LOADING || this.readyState === this.DONE) {
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

  public overrideMimeType(_mime: string): void {
    throw new Error('not implemented');
  }

  public open(
    method: string,
    url: string,
    async = true,
    username: string | null = null,
    password: string | null = null,
  ): void {
    const normalizedMethod = Methods.normalize(method);
    if (!Methods.isValid(normalizedMethod)) {
      throw new SyntaxErrDOMException('method is not a valid method');
    }
    if (Methods.isForbidden(normalizedMethod)) {
      throw new SecurityErrDOMException('method is forbidden');
    }

    try {
      this.settings = {
        method: normalizedMethod,
        url: new URL(url).toString(),
        async,
        username: username,
        password: password,
      };
    } catch (err) {
      throw new SyntaxErrDOMException('invalid url');
    }

    this.abort();
    this.store.dispatch(
      fromActions.Actions.setFlag({ type: 'error', value: false }),
    );
    this.setState(this.OPENED);
  }

  public send(data?: Document | BodyInit | null) {
    if (this.readyState !== this.OPENED) {
      throw new InvalidStateDOMException('state is not opened');
    }
    if (flagsSelector(this.store.getState()).send) {
      throw new InvalidStateDOMException(
        'cannot send when already in sending state',
      );
    }
    const { method, username, password } = this.settings;
    const body = method === 'GET' || method === 'HEAD' ? null : data;
    const url = new URL(this.settings.url);
    const requestParams: CoreOptions = {
      headers: this.headers,
      method,
      body,
      auth:
        username && password
          ? {
              username: username,
              password: password,
            }
          : undefined,
      followRedirect: true,
    };

    this.store.dispatch(
      fromActions.Actions.setFlag({ type: 'error', value: false }),
    );
    if (this.settings.async) {
      this.store.dispatch(
        fromActions.Actions.setFlag({ type: 'send', value: true }),
      );
      let responseText = '';
      this.request = request(url.toString(), requestParams)
        .on('data', (data) => {
          if (this.readyState === this.HEADERS_RECEIVED) {
            this.setState(this.LOADING);
          } else {
            this.store.dispatch(
              fromActions.Actions.dispatchEvent({
                type: 'readystatechange',
                req: this,
              }),
            );
          }
          responseText += data;
        })
        .on('response', (resp) => {
          this._response = resp;
          this.setState(this.HEADERS_RECEIVED);
        })
        .on('complete', (resp) => {
          this._status = resp.statusCode;
          this._responseText = responseText;
          this.store.dispatch(
            fromActions.Actions.setFlag({ type: 'send', value: false }),
          );
          this.setState(this.DONE);
        })
        .on('error', (err) => {
          this._status = 0;
          this._statusText = '';
          this._responseText = err.message;
          this.store.dispatch(
            fromActions.Actions.setFlag({ type: 'error', value: true }),
          );
          this.store.dispatch(
            fromActions.Actions.setFlag({ type: 'send', value: false }),
          );

          this.setState(this.DONE);
          this.dispatchEvent(new XMLHttpRequestProgressEvent('error'));
        });

      this.dispatchEvent(new XMLHttpRequestProgressEvent('loadstart'));
    } else {
      const result = spawnSync(process.execPath, [
        require.resolve('./worker'),
        url.toString(),
        JSON.stringify(requestParams),
      ]);
      if (result.status === 0) {
        const resp: Response = JSON.parse(result.stdout.toString().trim());
        this._response = resp;
        this._status = resp.statusCode;
        this._responseText = resp.body;
        this.setState(this.DONE);
      } else {
        this._status = 0;
        this._statusText = '';
        this._responseText = result.stderr.toString();
        this.store.dispatch(
          fromActions.Actions.setFlag({ type: 'error', value: true }),
        );
        this.setState(this.DONE);
        this.dispatchEvent(new XMLHttpRequestProgressEvent('error'));
      }
    }
  }

  public getRequestHeader(name: string) {
    if (typeof name === 'string' && this.headersCase[name.toLowerCase()]) {
      return this.headers[this.headersCase[name.toLowerCase()]];
    }
    return '';
  }

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
      !flagsSelector(this.store.getState()).error
    ) {
      return this.response.headers[header.toLowerCase()];
    }
    return null;
  }

  public abort(): void {
    if (this.request) {
      this.request.abort();
    }
    this.headers = {};
    this._status = 0;
    this._responseText = '';
    this._responseXML = null;
    this.store.dispatch(
      fromActions.Actions.setFlag({ type: 'error', value: true }),
    );
    if (
      this.readyState !== this.UNSENT &&
      (this.readyState !== this.OPENED || this.sendFlag) &&
      this.readyState !== this.DONE
    ) {
      this.store.dispatch(
        fromActions.Actions.setFlag({ type: 'send', value: false }),
      );
      this.setState(this.DONE);
    }
    this.setState(this.UNSENT);

    this.dispatchEvent(new XMLHttpRequestProgressEvent('abort'));
  }

  public addEventListener<K extends keyof XMLHttpRequestEventMap>(
    type: K,
    listener: (this: any, ev: XMLHttpRequestEventMap[K]) => any,
    _options?: boolean | AddEventListenerOptions,
  ): void {
    this.store.dispatch(
      fromActions.Actions.addListener({ type, listener }) as any,
    );
  }

  public removeEventListener<K extends keyof XMLHttpRequestEventMap>(
    type: K,
    listener: (this: NodeXMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any,
    _options?: boolean | EventListenerOptions,
  ): void {
    this.store.dispatch(
      fromActions.Actions.removeListener({ type, listener }) as any,
    );
  }

  public dispatchEvent(event: Event): boolean {
    if (
      event.type !== 'readystatechange' &&
      event.type !== 'abort' &&
      event.type !== 'error' &&
      event.type !== 'load' &&
      event.type !== 'loadend' &&
      event.type !== 'loadstart' &&
      event.type !== 'progress' &&
      event.type !== 'timeout'
    ) {
      return true;
    }
    this.store.dispatch(
      fromActions.Actions.dispatchEvent({
        type: event.type,
        req: this,
      }),
    );
    return true;
  }

  private get errorFlag(): boolean {
    return errorFlagSelector(this.store.getState());
  }

  private get sendFlag(): boolean {
    return sendFlagSelector(this.store.getState());
  }

  public setRequestHeader(header: string, value: string): void {
    if (this.readyState !== this.OPENED) {
      throw new InvalidStateDOMException('state is not opened');
    }

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

  private setState(state: 0 | 1 | 2 | 3 | 4): void {
    this.store.dispatch(fromActions.Actions.setState({ state, req: this }));
  }
}

export { NodeXMLHttpRequest as XMLHttpRequest };
