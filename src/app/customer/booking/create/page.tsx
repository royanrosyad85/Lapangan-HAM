import Link from 'next/link';
import { BUNDLES } from '@/config/pricing';
import { createClient } from '@/lib/supabase/server';
import { BookingCreateForm } from './BookingCreateForm';

type FieldRow = {
  id: number;
  name: string;
  address: string | null;
};

export default async function BookingCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; start?: string; end?: string; bundle?: string }>;
}) {
  const supabase = await createClient();
  const { data: fields } = await supabase
    .from('fields')
    .select('id, name, address')
    .eq('status', 'active')
    .order('name');

  const resolvedParams = await searchParams;
  const initialDate = resolvedParams.date || '';
  const initialStart = resolvedParams.start ? Number(resolvedParams.start) : 18;
  const initialEnd = resolvedParams.end ? Number(resolvedParams.end) : 20;
  const initialAddOns =
    BUNDLES.find((bundle) => bundle.id === resolvedParams.bundle)?.items ?? [];

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      {/* Hero header */}
      <section
        className="relative overflow-hidden rounded-2xl p-6 text-white shadow-[0_18px_40px_-28px_rgba(12,10,8,0.75)] sm:p-8"
        style={{
          background: 'linear-gradient(165deg, #0c0a08 0%, #0c0a08 30%, #1d2740 60%, #3a548c 80%, #5683d2 92%, #f4f2f0 100%)',
        }}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-white/55">
          <Link href="/customer" className="transition hover:text-white">Dashboard</Link>
          <span>/</span>
          <span className="text-white font-medium">New Booking</span>
        </div>
        <div className="mt-8 max-w-2xl">
          <h1 className="text-balance text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-[40px]">
            Book Your Field
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70 sm:text-[16px]">
            Fill in booking details, make the DP transfer, and upload payment proof.
          </p>
        </div>
      </section>

      <BookingCreateForm
        fields={(fields ?? []) as FieldRow[]}
        initialDate={initialDate}
        initialStart={initialStart}
        initialEnd={initialEnd}
        initialAddOns={initialAddOns}
      />
    </div>
  );
}
