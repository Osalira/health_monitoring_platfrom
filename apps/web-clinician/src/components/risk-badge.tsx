import { Badge } from '@t1d/ui';
import { riskTierVariant } from '@/lib/format';

interface RiskBadgeProps {
  tier: string | null;
  label?: string;
}

export function RiskBadge({ tier, label }: RiskBadgeProps) {
  if (!tier) return <span className="text-muted-foreground">—</span>;

  return (
    <Badge variant={riskTierVariant(tier)}>
      {label ?? tier}
    </Badge>
  );
}
