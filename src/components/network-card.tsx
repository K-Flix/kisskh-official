
import Image from 'next/image';
import type { NetworkConfig } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface NetworkCardProps {
  network: NetworkConfig;
  onClick: () => void;
  isActive?: boolean;
  hasActiveFilter?: boolean;
}

export function NetworkCard({ network, onClick, isActive, hasActiveFilter }: NetworkCardProps) {
  return (
    <Card 
        className={cn(
            "overflow-hidden transition-all duration-300 flex items-center justify-center aspect-video cursor-pointer group",
            isActive 
              ? "bg-white scale-105 shadow-lg shadow-primary/30" 
              : "bg-secondary hover:bg-muted"
        )}
        onClick={onClick}
    >
        <CardContent className="p-4 relative w-full h-full flex items-center justify-center">
            <div className={cn(
                "relative w-3/4 h-3/4 transition-all duration-300",
                !isActive && hasActiveFilter && "opacity-60 group-hover:opacity-100",
                !isActive && "grayscale group-hover:grayscale-0"
              )}
            >
                <Image
                src={network.logo_path}
                alt={`${network.name} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
            </div>
        </CardContent>
    </Card>
  );
}
