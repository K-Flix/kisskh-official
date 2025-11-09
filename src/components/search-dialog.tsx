'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SearchInput } from './search-input';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-0 p-0 top-0 translate-y-0 sm:top-[50%] sm:translate-y-[-50%] h-screen sm:h-auto">
        <div className="p-4">
            <SearchInput onSearch={() => onOpenChange(false)} isDialog={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
