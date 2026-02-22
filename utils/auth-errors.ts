export function mapAuthError(rawMessage: string): string {
  const lower = rawMessage.toLowerCase();

  if (lower.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Your email is not verified yet. Please check your inbox.';
  }

  if (lower.includes('user already registered')) {
    return 'An account with this email already exists. Try logging in.';
  }
  if (lower.includes('password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  if (
    lower.includes('unable to validate email') ||
    lower.includes('invalid format')
  ) {
    return 'Please enter a valid email address.';
  }

  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (lower.includes('email rate limit')) {
    return 'Too many emails sent. Please wait before trying again.';
  }

  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Connection error. Please check your internet and try again.';
  }
  if (lower.includes('server') || lower.includes('500')) {
    return 'Something went wrong on our end. Please try again later.';
  }

  return rawMessage;
}
