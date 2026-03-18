import { PortalSidebar } from '@/components/portal/sidebar';
import { AxlChatbot } from '@/components/portal/axl-chatbot';

export default function OfficialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalSidebar type="official">
      <div className="animate-fadeSlideIn">
        {children}
      </div>
      <AxlChatbot />
    </PortalSidebar>
  );
}
