import React from 'react';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { useI18n } from '@/hooks/use-i18n';

const SimulationSidebar: React.FC = () => {
  const { t } = useI18n();

  return (
    <SidebarGroup label={t('Simulation')}>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href="/simulate" passHref><SidebarMenuButton><Icons.edit className="mr-2 h-4 w-4" /> {t('Simulation')}</SidebarMenuButton></Link>
        </SidebarMenuItem>
      </SidebarMenu>
        </SidebarGroup>
  );
};

export default SimulationSidebar;