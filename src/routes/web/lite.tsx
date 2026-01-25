import { createFileRoute } from '@tanstack/react-router'
import LiteDownloadView from '@/components/auth/LiteDownloadView'
import { useSmartBack } from '@/hooks/useSmartBack'

export const Route = createFileRoute('/web/lite')({
  component: LitePage,
})

function LitePage() {
  const handleBack = useSmartBack()

  return <LiteDownloadView onBack={handleBack} />
}
