
"use client"

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from 'lucide-react';

const MAX_DASHBOARDS = 10;

interface SaveDashboardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  existingLayoutCount: number;
}

export function SaveDashboardDialog({ isOpen, onClose, onSave, existingLayoutCount }: SaveDashboardDialogProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };
  
  const canSave = existingLayoutCount < MAX_DASHBOARDS;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Dashboard Layout</DialogTitle>
          <DialogDescription>
            Enter a name for your current dashboard layout to save it for future use.
          </DialogDescription>
        </DialogHeader>
        {canSave ? (
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Name
                    </Label>
                    <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., My Oncology View"
                    />
                </div>
            </div>
        ) : (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Cannot Save</AlertTitle>
                <AlertDescription>
                    You have reached the maximum of {MAX_DASHBOARDS} saved dashboards. Please remove one to save a new layout.
                </AlertDescription>
            </Alert>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim() || !canSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
