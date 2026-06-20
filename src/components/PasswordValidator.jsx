import React from 'react';
import { Check, X } from 'lucide-react';

export const isPasswordValid = (password) => {
  if (!password) return false;
  const minLength = password.length >= 10;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/]/.test(password);
  return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

export default function PasswordValidator({ password }) {
  const minLength = password.length >= 10;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/]/.test(password);

  const rules = [
    { label: 'At least 10 characters', met: minLength },
    { label: 'At least one uppercase letter (A-Z)', met: hasUpperCase },
    { label: 'At least one lowercase letter (a-z)', met: hasLowerCase },
    { label: 'At least one number (0-9)', met: hasNumber },
    { label: 'At least one special character', met: hasSpecialChar },
  ];

  return (
    <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
        Password Requirements:
      </p>
      <ul className="space-y-1.5">
        {rules.map((rule, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm">
            {rule.met ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <X className="w-4 h-4 text-rose-500" />
            )}
            <span className={rule.met ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-slate-600 dark:text-slate-400'}>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
