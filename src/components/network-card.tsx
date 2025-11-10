
import Image from 'next/image';
import type { NetworkConfig } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface NetworkCardProps {
  network: NetworkConfig;
  onNetworkSelect: (network: NetworkConfig) => void;
  isActive?: boolean;
}

export function NetworkCard({ network, onNetworkSelect, isActive }: NetworkCardProps) {
  return (
    <Card 
        className={cn(
            "overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 border-2 bg-white flex items-center justify-center aspect-video cursor-pointer",
            isActive ? "border-primary" : "border-border/80"
        )}
        onClick={() => onNetworkSelect(network)}
    >
        <CardContent className="p-4 relative w-full h-full flex items-center justify-center">
            <div className="relative w-3/4 h-3/4">
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

    