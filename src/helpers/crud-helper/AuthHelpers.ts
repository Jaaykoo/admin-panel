// import type { AuthModel } from '@/types/authModels';

const KEY = 'emailForPasswordReset';
const DURATION = 15 * 60 * 1000; // 15 minutes

function setResetEmail(email: string) {
  localStorage.setItem(KEY, JSON.stringify({ email, expires: Date.now() + DURATION }));
}

function getResetEmail(): string | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    return null;
  }
  try {
    const { email, expires } = JSON.parse(raw);
    if (Date.now() > expires) {
      localStorage.removeItem(KEY);
      return null;
    }
    return email;
  } catch {
    localStorage.removeItem(KEY);
    return null;
  }
}

function clearResetEmail() {
  localStorage.removeItem(KEY);
}

export {
  clearResetEmail,
  getResetEmail,
  setResetEmail,
};
