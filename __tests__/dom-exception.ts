import {
  IndexSizeDOMException,
  StringSizeDOMException,
  HierarchyRequestDOMException,
  WrongDocumentDOMException,
  InvalidCharacterDOMException,
  NoDataAllowedDOMException,
  NoDataModificationAllowedDOMException,
  NotFoundDOMException,
  NotSupportedDOMException,
  InUseAttributeDOMException,
  InvalidStateDOMException,
  SyntaxErrDOMException,
  InvalidModificationDOMException,
  NamespaceErrDOMException,
  InvalidAccessDOMException,
  ValidationErrDOMException,
  TypeMismatchDOMException,
  SecurityErrDOMException,
  NetworkErrDOMException,
  AbortErrDOMException,
  UrlMismatchDOMException,
  QuotaExceededDOMException,
  TimeoutDOMException,
  InvalidNodeTypeDOMException,
  DataCloneNodeTypeDOMException,
} from '../src';

describe('dom exceptions', () => {
  test('index size', () => {
    const e = new IndexSizeDOMException();
    expect(e.code).toEqual(e.INDEX_SIZE_ERR);
  });

  test('domstring size', () => {
    const e = new StringSizeDOMException();
    expect(e.code).toEqual(e.DOMSTRING_SIZE_ERR);
  });

  test('hierarchy request', () => {
    const e = new HierarchyRequestDOMException();
    expect(e.code).toEqual(e.HIERARCHY_REQUEST_ERR);
  });

  test('wrong document', () => {
    const e = new WrongDocumentDOMException();
    expect(e.code).toEqual(e.WRONG_DOCUMENT_ERR);
  });

  test('invalid character', () => {
    const e = new InvalidCharacterDOMException();
    expect(e.code).toEqual(e.INVALID_CHARACTER_ERR);
  });

  test('no data allowed', () => {
    const e = new NoDataAllowedDOMException();
    expect(e.code).toEqual(e.NO_DATA_ALLOWED_ERR);
  });

  test('no modification allowed', () => {
    const e = new NoDataModificationAllowedDOMException();
    expect(e.code).toEqual(e.NO_MODIFICATION_ALLOWED_ERR);
  });

  test('not found', () => {
    const e = new NotFoundDOMException();
    expect(e.code).toEqual(e.NOT_FOUND_ERR);
  });

  test('not supported', () => {
    const e = new NotSupportedDOMException();
    expect(e.code).toEqual(e.NOT_SUPPORTED_ERR);
  });

  test('inuse attribute', () => {
    const e = new InUseAttributeDOMException();
    expect(e.code).toEqual(e.INUSE_ATTRIBUTE_ERR);
  });

  test('invalid state', () => {
    const e = new InvalidStateDOMException();
    expect(e.code).toEqual(e.INVALID_STATE_ERR);
  });

  test('syntax', () => {
    const e = new SyntaxErrDOMException();
    expect(e.code).toEqual(e.SYNTAX_ERR);
  });

  test('invalid modification', () => {
    const e = new InvalidModificationDOMException();
    expect(e.code).toEqual(e.INVALID_MODIFICATION_ERR);
  });

  test('namespace', () => {
    const e = new NamespaceErrDOMException();
    expect(e.code).toEqual(e.NAMESPACE_ERR);
  });

  test('invalid access', () => {
    const e = new InvalidAccessDOMException();
    expect(e.code).toEqual(e.INVALID_ACCESS_ERR);
  });

  test('validation', () => {
    const e = new ValidationErrDOMException();
    expect(e.code).toEqual(e.VALIDATION_ERR);
  });

  test('type mismatch', () => {
    const e = new TypeMismatchDOMException();
    expect(e.code).toEqual(e.TYPE_MISMATCH_ERR);
  });

  test('security', () => {
    const e = new SecurityErrDOMException();
    expect(e.code).toEqual(e.SECURITY_ERR);
  });

  test('network', () => {
    const e = new NetworkErrDOMException();
    expect(e.code).toEqual(e.NETWORK_ERR);
  });

  test('abort', () => {
    const e = new AbortErrDOMException();
    expect(e.code).toEqual(e.ABORT_ERR);
  });

  test('url mismatch', () => {
    const e = new UrlMismatchDOMException();
    expect(e.code).toEqual(e.URL_MISMATCH_ERR);
  });

  test('quota exceeded', () => {
    const e = new QuotaExceededDOMException();
    expect(e.code).toEqual(e.QUOTA_EXCEEDED_ERR);
  });

  test('quota exceeded', () => {
    const e = new QuotaExceededDOMException();
    expect(e.code).toEqual(e.QUOTA_EXCEEDED_ERR);
  });

  test('timeout', () => {
    const e = new TimeoutDOMException();
    expect(e.code).toEqual(e.TIMEOUT_ERR);
  });

  test('invalid node type', () => {
    const e = new InvalidNodeTypeDOMException();
    expect(e.code).toEqual(e.INVALID_NODE_TYPE_ERR);
  });

  test('data clone', () => {
    const e = new DataCloneNodeTypeDOMException();
    expect(e.code).toEqual(e.DATA_CLONE_ERR);
  });
});
