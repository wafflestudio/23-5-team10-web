export const API_ERROR_CODE = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  INVALID_INPUT_VALUE: 'INVALID_INPUT_VALUE',
  ACCESS_DENIED: 'ACCESS_DENIED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  NICKNAME_ALREADY_EXISTS: 'NICKNAME_ALREADY_EXISTS',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  REFRESH_TOKEN_EXPIRED: 'REFRESH_TOKEN_EXPIRED',
  REFRESH_TOKEN_REUSE_DETECTED: 'REFRESH_TOKEN_REUSE_DETECTED',
  POST_NOT_FOUND: 'POST_NOT_FOUND',
  EMPTY_CONTENT: 'EMPTY_CONTENT',
  COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
  SELF_FOLLOW_NOT_ALLOWED: 'SELF_FOLLOW_NOT_ALLOWED',
} as const

export type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE]

type ApiErrorEntry = {
  status: number
  message: string
}

export const API_ERROR_INFO: Record<ApiErrorCode, ApiErrorEntry> = {
  [API_ERROR_CODE.INTERNAL_SERVER_ERROR]: {
    status: 500,
    message: '서버 내부 에러가 발생했습니다.',
  },
  [API_ERROR_CODE.INVALID_INPUT_VALUE]: {
    status: 400,
    message: '입력값이 올바르지 않습니다.',
  },
  [API_ERROR_CODE.ACCESS_DENIED]: {
    status: 403,
    message: '접근 권한이 없습니다.',
  },
  [API_ERROR_CODE.USER_NOT_FOUND]: {
    status: 404,
    message: '존재하지 않는 회원입니다.',
  },
  [API_ERROR_CODE.INVALID_PASSWORD]: {
    status: 401,
    message: '비밀번호가 일치하지 않습니다.',
  },
  [API_ERROR_CODE.EMAIL_ALREADY_EXISTS]: {
    status: 409,
    message: '이미 가입된 이메일입니다.',
  },
  [API_ERROR_CODE.NICKNAME_ALREADY_EXISTS]: {
    status: 409,
    message: '이미 가입된 닉네임입니다.',
  },
  [API_ERROR_CODE.INVALID_REFRESH_TOKEN]: {
    status: 401,
    message: '인증 정보가 유효하지 않습니다.',
  },
  [API_ERROR_CODE.REFRESH_TOKEN_EXPIRED]: {
    status: 401,
    message: '인증 정보가 만료되었습니다.',
  },
  [API_ERROR_CODE.REFRESH_TOKEN_REUSE_DETECTED]: {
    status: 401,
    message: '재발급 토큰이 재사용되었습니다.',
  },
  [API_ERROR_CODE.POST_NOT_FOUND]: {
    status: 404,
    message: '게시글을 찾을 수 없습니다.',
  },
  [API_ERROR_CODE.EMPTY_CONTENT]: {
    status: 400,
    message: '내용이 비어 있습니다.',
  },
  [API_ERROR_CODE.COMMENT_NOT_FOUND]: {
    status: 404,
    message: '댓글을 찾을 수 없습니다.',
  },
  [API_ERROR_CODE.SELF_FOLLOW_NOT_ALLOWED]: {
    status: 400,
    message: '자기 자신은 팔로우할 수 없습니다.',
  },
}
