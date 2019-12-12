export class DOMEvent {
  readonly AT_TARGET: number;
  readonly BUBBLING_PHASE: number;
  readonly CAPTURING_PHASE: number;
  readonly NONE: number;

  readonly bubbles: boolean;
  cancelBubble: boolean;
  readonly cancelable: boolean;
  readonly composed: boolean;
  readonly currentTarget: EventTarget | null;
  readonly defaultPrevented: boolean;
  readonly eventPhase: number;
  readonly isTrusted: boolean;
  returnValue: boolean;
  readonly srcElement: EventTarget | null;
  readonly target: EventTarget | null;
  readonly timeStamp: number;

  constructor(
    public readonly type: string,
    public readonly eventInitDict?: EventInit,
  ) {
    this.AT_TARGET = 2;
    this.BUBBLING_PHASE = 3;
    this.CAPTURING_PHASE = 1;
    this.NONE = 0;
    this.bubbles = false;
    this.cancelBubble = false;
    this.cancelable = false;
    this.composed = false;
    this.currentTarget = null;
    this.defaultPrevented = false;
    this.eventPhase = 0;
    this.isTrusted = false;
    this.returnValue = false;
    this.srcElement = null;
    this.target = null;
    this.timeStamp = 0;
    this.type = '';
  }

  composedPath(): EventTarget[] {
    return [];
  }

  initEvent(_type: string, _bubbles?: boolean, _cancelable?: boolean): void {
    return;
  }

  public preventDefault() {
    return;
  }

  public stopImmediatePropagation() {
    return;
  }

  public stopPropagation() {
    return;
  }
}

export class XMLHttpRequestProgressEvent extends DOMEvent {
  readonly lengthComputable: boolean;
  readonly loaded: number;
  readonly target: XMLHttpRequestEventTarget | null;
  readonly total: number;

  constructor(type: string, eventInitDict?: EventInit) {
    super(type, eventInitDict);
    this.total = 0;
    this.target = null;
    this.loaded = 0;
    this.lengthComputable = false;
  }
}
