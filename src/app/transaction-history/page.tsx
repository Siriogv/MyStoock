"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useI18n } from "@/hooks/use-i18n";
import { SidebarLayout } from "@/components/sidebar-layout";

export default function TransactionHistoryPage() {
  const router = useRouter();
  const { t } = useI18n();

  const goBackToDashboard = () => {
    router.push('/');
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t("Transaction History")}</h1>
        <Button variant="secondary" onClick={goBackToDashboard}>{t("Back to Dashboard")}</Button>
        {/* TODO: Implement transaction history display here */}
      </div>
    </SidebarLayout>
  );
}
