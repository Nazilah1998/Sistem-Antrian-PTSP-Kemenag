export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<{ success: boolean; errorCodes?: string[] }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // In local development or if key not configured, bypass or allow fallback if token is 'mock-token'
  if (!secretKey) {
    console.warn('TURNSTILE_SECRET_KEY is missing. Skipping Turnstile verification in dev.');
    return { success: true };
  }

  if (!token) {
    return { success: false, errorCodes: ['missing-input-response'] };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await res.json();
    return {
      success: !!data.success,
      errorCodes: data['error-codes'],
    };
  } catch (error) {
    console.error('Cloudflare Turnstile verification error:', error);
    return { success: false, errorCodes: ['internal-error'] };
  }
}
