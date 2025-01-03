import { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, feedback: '', color: 'bg-gray-200', checks: undefined };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noSequential: !/123|234|345|456|567|678|789/.test(password),
    };

    if (checks.length) score += 1;
    if (checks.hasNumber) score += 1;
    if (checks.hasLower && checks.hasUpper) score += 1;
    if (checks.hasSpecial) score += 1;
    if (checks.noSequential) score += 1;

    let feedback = '';
    let color = '';

    switch (true) {
      case score <= 2:
        feedback = 'Weak - Add numbers and special characters';
        color = 'bg-red-500';
        break;
      case score <= 3:
        feedback = 'Moderate - Consider adding special characters';
        color = 'bg-yellow-500';
        break;
      case score <= 4:
        feedback = 'Strong - Good password strength';
        color = 'bg-green-500';
        break;
      default:
        feedback = 'Very Strong - Excellent password strength';
        color = 'bg-green-600';
    }

    return { score, feedback, color, checks };
  }, [password]);

  return (
    <div className="space-y-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
      {password && (
        <>
          <p className={`text-sm ${strength.color.replace('bg-', 'text-')}`}>
            {strength.feedback}
          </p>
          <ul className="text-xs space-y-1 text-gray-500">
            <li className={strength.checks?.length ? 'text-green-500' : ''}>
              • At least 8 characters
            </li>
            <li className={strength.checks?.hasNumber ? 'text-green-500' : ''}>
              • Contains numbers
            </li>
            <li className={
              (strength.checks?.hasLower && strength.checks?.hasUpper) 
              ? 'text-green-500' 
              : ''
            }>
              • Mix of uppercase & lowercase letters
            </li>
            <li className={strength.checks?.hasSpecial ? 'text-green-500' : ''}>
              • Special characters (!@#$%^&*)
            </li>
            <li className={strength.checks?.noSequential ? 'text-green-500' : ''}>
              • No sequential numbers (123, 234, etc.)
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;