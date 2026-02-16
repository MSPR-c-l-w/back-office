import { BackOfficeLayout } from '@/components/layout/BackOfficeLayout';
import { DashboardView } from '@/components/DashboardView';

export default function DashboardPage({ num, num2 }: { num: string, num2: string}) {
  return (
    <BackOfficeLayout pageTitle="Dashboard de Pilotage">
      {/* <DashboardView /> */}
      <div className='text-2xl font-bold text-black'>Hello {num} {num2}</div>
    </BackOfficeLayout>
  );
}


export async function getServerSideProps() {

  const num = "ts"
  const num2 = "100000"

  return {
    props: {
      num,
      num2
    }
  }
}
