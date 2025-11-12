
'use client';

import { useState } from 'react';
import { Button } from './ui/button';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

export function ExpandableText({ text, maxLength = 350 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return <p className="text-muted-foreground">No biography available.</p>;
  }

  const needsTruncation = text.length > maxLength;
  const displayText = isExpanded ? text : `${text.substring(0, maxLength)}${needsTruncation ? '...' : ''}`;

  return (
    <div className="text-muted-foreground space-y-2">
        {displayText.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
        ))}
      {needsTruncation && (
        <Button variant="link" onClick={() => setIsExpanded(!isExpanded)} className="p-0 text-primary hover:text-primary/80">
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </div>
  );
}
