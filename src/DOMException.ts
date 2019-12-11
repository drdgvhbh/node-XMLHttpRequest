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
    Error.captureStackTrace(this, DOMException);
  }
}

export class IndexSizeDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INDEX_SIZE_ERR;
    Error.captureStackTrace(this, IndexSizeDOMException);
  }
}

export class StringSizeDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.DOMSTRING_SIZE_ERR;
    Error.captureStackTrace(this, StringSizeDOMException);
  }
}

export class HierarchyRequestDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.HIERARCHY_REQUEST_ERR;
    Error.captureStackTrace(this, HierarchyRequestDOMException);
  }
}

export class WrongDocumentDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.WRONG_DOCUMENT_ERR;
    Error.captureStackTrace(this, WrongDocumentDOMException);
  }
}

export class InvalidCharacterDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INVALID_CHARACTER_ERR;
    Error.captureStackTrace(this, InvalidCharacterDOMException);
  }
}

export class NoDataAllowedDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.NO_DATA_ALLOWED_ERR;
    Error.captureStackTrace(this, NoDataAllowedDOMException);
  }
}

export class NoDataModificationAllowedDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.NO_MODIFICATION_ALLOWED_ERR;
    Error.captureStackTrace(this, NoDataModificationAllowedDOMException);
  }
}

export class NotFoundDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.NOT_FOUND_ERR;
    Error.captureStackTrace(this, NotFoundDOMException);
  }
}

export class NotSupportedDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.NOT_SUPPORTED_ERR;
    Error.captureStackTrace(this, NotSupportedDOMException);
  }
}

export class InUseAttributeDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INUSE_ATTRIBUTE_ERR;
    Error.captureStackTrace(this, InUseAttributeDOMException);
  }
}

export class InvalidStateDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INVALID_STATE_ERR;
    Error.captureStackTrace(this, InvalidStateDOMException);
  }
}

export class SyntaxErrDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.SYNTAX_ERR;
    Error.captureStackTrace(this, SyntaxErrDOMException);
  }
}

export class InvalidModificationDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INVALID_MODIFICATION_ERR;
    Error.captureStackTrace(this, InvalidModificationDOMException);
  }
}

export class NamespaceErrDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.NAMESPACE_ERR;
    Error.captureStackTrace(this, NamespaceErrDOMException);
  }
}

export class InvalidAccessDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INVALID_ACCESS_ERR;
    Error.captureStackTrace(this, InvalidAccessDOMException);
  }
}

export class ValidationErrDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.VALIDATION_ERR;
    Error.captureStackTrace(this, ValidationErrDOMException);
  }
}

export class TypeMismatchDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.TYPE_MISMATCH_ERR;
    Error.captureStackTrace(this, TypeMismatchDOMException);
  }
}

export class SecurityErrDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.SECURITY_ERR;
    Error.captureStackTrace(this, SecurityErrDOMException);
  }
}

export class NetworkErrDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.NETWORK_ERR;
    Error.captureStackTrace(this, NetworkErrDOMException);
  }
}

export class AbortErrDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.ABORT_ERR;
    Error.captureStackTrace(this, AbortErrDOMException);
  }
}

export class UrlMismatchDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.URL_MISMATCH_ERR;
    Error.captureStackTrace(this, UrlMismatchDOMException);
  }
}

export class QuotaExceededDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.QUOTA_EXCEEDED_ERR;
    Error.captureStackTrace(this, QuotaExceededDOMException);
  }
}

export class TimeoutDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.TIMEOUT_ERR;
    Error.captureStackTrace(this, TimeoutDOMException);
  }
}

export class InvalidNodeTypeDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.INVALID_NODE_TYPE_ERR;
    Error.captureStackTrace(this, InvalidNodeTypeDOMException);
  }
}

export class DataCloneNodeTypeDOMException extends DOMException {
  public code: number;

  constructor(message = '', name = 'Error') {
    super(message, name);
    this.code = this.DATA_CLONE_ERR;
    Error.captureStackTrace(this, DataCloneNodeTypeDOMException);
  }
}
