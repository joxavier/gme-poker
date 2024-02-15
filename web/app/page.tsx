import DashboardFeature from '@/components/dashboard/dashboard-feature';
import JoinGame from "@/components/portal/join-game";
import Table from '@/components/portal/table';
import { getTableDetails } from './actions';

export default async function Page() {
  let table = await getTableDetails();

  return (
    <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
      <DashboardFeature />
      <div className="portal flex flex-col items-center justify-center p-10 space-y-2">
        {table && <Table {...table} />}
        <JoinGame />
      </div>
    </div>
  )
}
