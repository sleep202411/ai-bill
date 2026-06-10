const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': '邮箱或密码错误',
  'Email not confirmed': '邮箱尚未验证，请先查收验证邮件',
  'User already registered': '该邮箱已注册，请直接登录',
  'Email rate limit exceeded': '邮件发送过于频繁，请稍后再试',
  'Password should be at least 6 characters': '密码至少需要 6 位',
  'Signup requires a valid password': '请输入有效密码',
  'Unable to validate email address: invalid format': '邮箱格式不正确',
  'Signups not allowed for this instance': '当前不允许注册',
  'For security purposes, you can only request this once every 60 seconds':
    '出于安全考虑，请 60 秒后再试',
};

export function translateAuthError(message: string): string {
  return AUTH_ERROR_MESSAGES[message] ?? message;
}
