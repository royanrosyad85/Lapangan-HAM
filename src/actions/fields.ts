'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

type FieldActionState = {
  ok: boolean;
  message?: string;
  error?: string;
};

type FieldPayload = {
  name: string;
  price: number;
  address: string | null;
  status: 'active' | 'inactive';
};

const VALID_FIELD_STATUSES = new Set(['active', 'inactive']);

export async function createFieldAction(formData: FormData): Promise<FieldActionState> {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin.ok) return { ok: false, error: admin.error };

  const parsed = parseFieldPayload(formData);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  const { error } = await supabase.from('fields').insert(parsed.payload);
  if (error) return { ok: false, error: 'Lapangan gagal ditambahkan. Coba lagi.' };

  revalidatePath('/admin');
  revalidatePath('/admin/fields');
  revalidatePath('/customer/booking/create');

  return { ok: true, message: 'Lapangan berhasil ditambahkan.' };
}

export async function updateFieldAction(formData: FormData): Promise<FieldActionState> {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin.ok) return { ok: false, error: admin.error };

  const fieldId = parsePositiveId(formData.get('fieldId'));
  if (!fieldId) return { ok: false, error: 'Lapangan tidak valid.' };

  const parsed = parseFieldPayload(formData);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  const { error } = await supabase.from('fields').update(parsed.payload).eq('id', fieldId);
  if (error) return { ok: false, error: 'Lapangan gagal diperbarui. Coba lagi.' };

  revalidatePath('/admin');
  revalidatePath('/admin/fields');
  revalidatePath('/customer/booking/create');

  return { ok: true, message: 'Lapangan berhasil diperbarui.' };
}

export async function deleteFieldAction(formData: FormData): Promise<FieldActionState> {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin.ok) return { ok: false, error: admin.error };

  const fieldId = parsePositiveId(formData.get('fieldId'));
  if (!fieldId) return { ok: false, error: 'Lapangan tidak valid.' };

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id')
    .eq('field_id', fieldId)
    .maybeSingle();

  if (bookingError) return { ok: false, error: 'Data booking lapangan gagal diperiksa. Coba lagi.' };
  if (booking) return { ok: false, error: 'Lapangan memiliki riwayat booking dan tidak dapat dihapus. Nonaktifkan lapangan ini sebagai gantinya.' };

  const { error } = await supabase.from('fields').delete().eq('id', fieldId);
  if (error) return { ok: false, error: 'Lapangan gagal dihapus. Coba lagi.' };

  revalidatePath('/admin');
  revalidatePath('/admin/fields');
  revalidatePath('/customer/booking/create');

  return { ok: true, message: 'Lapangan berhasil dihapus.' };
}

export async function setFieldStatusAction(formData: FormData): Promise<FieldActionState> {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin.ok) return { ok: false, error: admin.error };

  const fieldId = parsePositiveId(formData.get('fieldId'));
  const status = String(formData.get('status') ?? '');
  if (!fieldId || !VALID_FIELD_STATUSES.has(status)) return { ok: false, error: 'Lapangan tidak valid.' };

  const { error } = await supabase.from('fields').update({ status }).eq('id', fieldId);
  if (error) return { ok: false, error: 'Status lapangan gagal diperbarui. Coba lagi.' };

  revalidatePath('/admin');
  revalidatePath('/admin/fields');
  revalidatePath('/customer/booking/create');

  return { ok: true, message: status === 'active' ? 'Lapangan berhasil diaktifkan.' : 'Lapangan berhasil dinonaktifkan.' };
}

function parseFieldPayload(formData: FormData):
  | { ok: true; payload: FieldPayload }
  | { ok: false; error: string } {
  const name = String(formData.get('name') ?? '').trim();
  const rawPrice = String(formData.get('price') ?? '').trim();
  const price = Number(rawPrice);
  const address = String(formData.get('address') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim();

  if (!name) return { ok: false, error: 'Nama lapangan wajib diisi.' };
  if (!rawPrice) return { ok: false, error: 'Harga lapangan wajib diisi.' };
  if (!Number.isFinite(price)) return { ok: false, error: 'Harga lapangan tidak valid.' };
  if (price < 0) return { ok: false, error: 'Harga lapangan tidak boleh negatif.' };
  if (!VALID_FIELD_STATUSES.has(status)) return { ok: false, error: 'Status lapangan tidak valid.' };

  return {
    ok: true,
    payload: {
      name,
      price,
      address: address || null,
      status: status as FieldPayload['status'],
    },
  };
}

function parsePositiveId(value: FormDataEntryValue | null) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, error: 'Silakan login sebagai admin.' };

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (error || profile?.role !== 'admin') {
    return { ok: false as const, error: 'Akses admin diperlukan.' };
  }

  return { ok: true as const, userId: user.id };
}
