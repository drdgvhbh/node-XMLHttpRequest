export abstract class DOMException extends Error {
  public abstract readonly code: number;

  public readonly message: string;

  public readonly name: string;

  public readonly INDEX_SIZE_ERR = 1;
  public readonly DOMSTRING_SIZE_ERR = 2;
  public readonly HIERARCHY_REQUEST_ERR = 3;
  public readonly WRONG_DOCUMENT_ERR = 4;
  public readonly INVALID_CHARACTER_ERR = 5;
  public readonly NO_DATA_ALLOWED_ERR = 6;
  public readonly NO_MODIFICATION_ALLOWED_ERR = 7;
  public readonly NOT_FOUND_ERR = 8;
  public readonly NOT_SUPPORTED_ERR = 9;
  public readonly INUSE_ATTRIBUTE_ERR = 10;
  public readonly INVALID_STATE_ERR = 11;
  public readonly SYNTAX_ERR = 12;
  public readonly INVALID_MODIFICATION_ERR = 13;
  public readonly NAMESPACE_ERR = 14;
  public readonly INVALID_ACCESS_ERR = 15;
  public readonly VALIDATION_ERR = 16;
  public readonly TYPE_MISMATCH_ERR = 17;
  public readonly SECURITY_ERR = 18;
  public readonly NETWORK_ERR = 19;
  public readonly ABORT_ERR = 20;
  public readonly URL_MISMATCH_ERR = 21;
  public readonly QUOTA_EXCEEDED_ERR = 22;
  public readonly TIMEOUT_ERR = 23;
  public readonly INVALID_NODE_TYPE_ERR = 24;
  public readonly DATA_CLONE_ERR = 25;

  constructor(message = '', name = 'Error') {
    super(message);
    this.message = message;
    this.name = name;
    Error.captureStackTrace(this);
  }
}

export class IndexSizeDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INDEX_SIZE_ERR;
  }
}

export class StringSizeDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.DOMSTRING_SIZE_ERR;
  }
}

export class HierarchyRequestDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.HIERARCHY_REQUEST_ERR;
  }
}

export class WrongDocumentDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.WRONG_DOCUMENT_ERR;
  }
}

export class InvalidCharacterDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INVALID_CHARACTER_ERR;
  }
}

export class NoDataAllowedDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.NO_DATA_ALLOWED_ERR;
  }
}

export class NoDataModificationAllowedDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.NO_MODIFICATION_ALLOWED_ERR;
  }
}

export class NotFoundDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.NOT_FOUND_ERR;
  }
}

export class NotSupportedDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.NOT_SUPPORTED_ERR;
  }
}

export class InUseAttributeDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INUSE_ATTRIBUTE_ERR;
  }
}

export class InvalidStateDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INVALID_STATE_ERR;
  }
}

export class SyntaxErrDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.SYNTAX_ERR;
  }
}

export class InvalidModificationDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INVALID_MODIFICATION_ERR;
  }
}

export class NamespaceErrDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.NAMESPACE_ERR;
  }
}

export class InvalidAccessDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INVALID_ACCESS_ERR;
  }
}

export class ValidationErrDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.VALIDATION_ERR;
  }
}

export class TypeMismatchDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.TYPE_MISMATCH_ERR;
  }
}

export class SecurityErrDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.SECURITY_ERR;
  }
}

export class NetworkErrDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.NETWORK_ERR;
  }
}

export class AbortErrDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.ABORT_ERR;
  }
}

export class UrlMismatchDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.URL_MISMATCH_ERR;
  }
}

export class QuotaExceededDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.QUOTA_EXCEEDED_ERR;
  }
}

export class TimeoutDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.TIMEOUT_ERR;
  }
}

export class InvalidNodeTypeDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INVALID_NODE_TYPE_ERR;
  }
}

export class DataCloneNodeTypeDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.DATA_CLONE_ERR;
  }
}
