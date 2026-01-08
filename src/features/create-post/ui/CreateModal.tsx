import { Dialog, DialogContent } from '@/shared/ui/dialog'

type CreateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateModal({ open, onOpenChange }: CreateModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <div className="h-64 rounded-lg border border-dashed" />
      </DialogContent>
    </Dialog>
  )
}
