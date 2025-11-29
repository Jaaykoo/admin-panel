'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type MarketingCardProps = {
  title: string;
  description: string;
  image: string;
  buttons: Array<{
    label: string;
    action: string;
    variant?: 'default' | 'outline';
  }>;
};

export function MarketingCard({ title, description, image, buttons }: MarketingCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Image */}
          <div className="mb-6 h-32 w-32">
            <img src={image} alt={title} className="h-full w-full object-contain" />
          </div>

          {/* Title */}
          <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>

          {/* Description */}
          <p className="mb-6 text-sm text-gray-500">{description}</p>

          {/* Buttons */}
          <div className="flex gap-3">
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || 'default'}
                onClick={() => console.log(button.action)}
              >
                {button.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

