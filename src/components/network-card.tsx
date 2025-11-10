
import Image from 'next/image';
import Link from 'next/link';
import type { NetworkConfig } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface NetworkCardProps {
  network: NetworkConfig;
}

export function NetworkCard({ network }: NetworkCardProps) {
  const networkIds = network.networkIds?.join('|');
  const providerIds = network.providerIds?.join('|');
  
  const queryParams = new URLSearchParams();
  if (networkIds) queryParams.set('with_networks', networkIds);
  if (providerIds) queryParams.set('with_watch_providers', providerIds);

  const href = `/discover?category=network_${network.name.toLowerCase().replace(/[^a-z0-9]/g, '')}&title=${encodeURIComponent(network.name)}&${queryParams.toString()}`;
  
  return (
    <Link href={href} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 border border-border/80 bg-white flex items-center justify-center aspect-video">
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
    </Link>
  );
}
