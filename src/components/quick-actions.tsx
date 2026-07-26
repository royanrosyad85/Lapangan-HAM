import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';

export type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type QuickActionsProps = {
  title: string;
  description: string;
  actions: QuickAction[];
  className?: string;
};

export function QuickActions({ title, description, actions, className }: QuickActionsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-0">
          {actions.map((action) => (
            <Item asChild key={action.href} size="sm">
              <Link href={action.href}>
                <ItemMedia variant="icon"><action.icon aria-hidden="true" /></ItemMedia>
                <ItemContent>
                  <ItemTitle>{action.title}</ItemTitle>
                  <ItemDescription className="line-clamp-1">{action.description}</ItemDescription>
                </ItemContent>
                <ItemActions><ChevronRight aria-hidden="true" className="text-muted-foreground" /></ItemActions>
              </Link>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
