import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PasswordStrengthProps {
  password: string;
  showStrength?: boolean;
  showRequirements?: boolean;
}

type Strength = 'weak' | 'medium' | 'strong';

interface Requirement {
  label: string;
  met: boolean;
}

export default function PasswordStrength({
  password,
  showStrength = true,
  showRequirements = true,
}: PasswordStrengthProps) {
  const [strength, setStrength] = useState<{
    level: Strength;
    label: string;
    color: string;
    barColor: string;
  }>({
    level: 'weak',
    label: '',
    color: '',
    barColor: '',
  });

  const [requirements, setRequirements] = useState<Requirement[]>([]);

  useEffect(() => {
    if (!password) {
      setStrength({ level: 'weak', label: '', color: '', barColor: '' });
      setRequirements([]);
      return;
    }

    // Check requirements
    const reqs: Requirement[] = [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'One lowercase letter', met: /[a-z]/.test(password) },
      { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'One number', met: /[0-9]/.test(password) },
      { label: 'One special character', met: /[^a-zA-Z0-9]/.test(password) },
    ];
    setRequirements(reqs);

    // Calculate strength score
    let score = 0;
    if (password.length >= 8) {
      score++;
    }
    if (password.length >= 12) {
      score++;
    }
    if (/[a-z]/.test(password)) {
      score++;
    }
    if (/[A-Z]/.test(password)) {
      score++;
    }
    if (/[0-9]/.test(password)) {
      score++;
    }
    if (/[^a-zA-Z0-9]/.test(password)) {
      score++;
    }

    // All requirements must be met for valid password
    const allRequirementsMet = reqs.every((req) => req.met);

    if (password.length < 8) {
      setStrength({
        level: 'weak',
        label: 'Too short (min 8 characters)',
        color: 'text-destructive',
        barColor: 'bg-destructive',
      });
    } else if (!allRequirementsMet) {
      setStrength({
        level: 'weak',
        label: 'Missing required characters',
        color: 'text-destructive',
        barColor: 'bg-destructive',
      });
    } else if (score <= 4) {
      setStrength({
        level: 'medium',
        label: 'Medium strength',
        color: 'text-yellow-600 dark:text-yellow-500',
        barColor: 'bg-yellow-500',
      });
    } else {
      setStrength({
        level: 'strong',
        label: 'Strong password',
        color: 'text-green-600 dark:text-green-500',
        barColor: 'bg-green-500',
      });
    }
  }, [password]);

  if (!password || !showStrength) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Strength bars */}
      <div className="flex gap-1 h-1">
        <div
          className={cn(
            'flex-1 rounded transition-colors',
            password.length > 0 ? strength.barColor : 'bg-muted'
          )}
        />
        <div
          className={cn(
            'flex-1 rounded transition-colors',
            strength.level !== 'weak' ? strength.barColor : 'bg-muted'
          )}
        />
        <div
          className={cn(
            'flex-1 rounded transition-colors',
            strength.level === 'strong' ? strength.barColor : 'bg-muted'
          )}
        />
      </div>

      {/* Strength label */}
      <p className={cn('text-xs font-medium transition-colors', strength.color)}>
        {strength.label}
      </p>

      {/* Requirements checklist */}
      {showRequirements && requirements.length > 0 && (
        <ul className="space-y-1 text-xs">
          {requirements.map((req, index) => (
            <li
              key={index}
              className={cn(
                'flex items-center gap-1.5 transition-colors',
                req.met ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'
              )}
            >
              {req.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {req.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
