import { PortalSidebar } from '@/components/portal/sidebar';
import { AxlChatbot } from '@/components/portal/axl-chatbot';

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalSidebar type="resident">
      <div className="animate-fadeSlideIn">
        {children}
      </div>
      <AxlChatbot />
    </PortalSidebar>
  );
}
