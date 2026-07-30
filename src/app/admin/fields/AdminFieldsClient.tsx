'use client';

import Link from 'next/link';
import { Edit3, MapPin, MoreHorizontal, Plus, Power, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { useTranslation } from '@/lib/i18n';
import { DataTable } from '@/components/DataTable';
import { deleteFieldAction, setFieldStatusAction } from '@/actions/fields';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FieldItem = {
  id: number;
  name: string;
  price: number;
  address: string | null;
  status: string;
  created_at_label: string;
};

const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export function AdminFieldsClient({ fields }: { fields: FieldItem[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [feedback, setFeedback] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function runAction(action: (formData: FormData) => Promise<{ ok: boolean; message?: string; error?: string }>, fieldId: number, status?: 'active' | 'inactive') {
    const formData = new FormData();
    formData.set('fieldId', String(fieldId));
    if (status) formData.set('status', status);
    startTransition(async () => {
      const result = await action(formData);
      setFeedback(result.message ?? result.error ?? 'Aksi gagal diproses.');
      if (result.ok) router.refresh();
    });
  }

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      sortValue: (row: FieldItem) => row.id,
      render: (row: FieldItem) => <span className="font-semibold text-[var(--text-muted)]">#{row.id}</span>,
    },
    {
      key: 'name',
      label: t('admin.fieldName'),
      sortable: true,
      sortValue: (row: FieldItem) => row.name,
      render: (row: FieldItem) => (
        <div className="max-w-[280px]">
          <p className="font-bold text-[var(--text-primary)]">{row.name}</p>
          {row.address && <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{row.address}</p>}
        </div>
      ),
    },
    {
      key: 'price',
      label: t('admin.priceSlotMin'),
      sortable: true,
      sortValue: (row: FieldItem) => row.price,
      render: (row: FieldItem) => (
        <div>
          <p className="font-semibold">{money.format(row.price)}</p>
          <p className="text-xs text-[var(--text-muted)]">per slot</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: t('admin.statusField'),
      sortable: true,
      sortValue: (row: FieldItem) => row.status,
      render: (row: FieldItem) => (
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
          row.status === 'active'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
            : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300'
        }`}>
          {row.status === 'active' ? t('admin.active') : t('admin.inactive')}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: t('admin.createdDate'),
      sortable: true,
      sortValue: (row: FieldItem) => row.created_at_label,
      render: (row: FieldItem) => (
        <span className="text-[var(--text-muted)]">{row.created_at_label ?? '-'}</span>
      ),
    },
    {
      key: 'actions',
      label: t('admin.actions'),
      render: (row: FieldItem) => (
        <div className="flex gap-1.5">
          <Link
            href={`/admin/fields/${row.id}/edit`}
            className="btn inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-action-hover)]"
          >
            <Edit3 size={13} />
            {t('common.edit')}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger aria-label={`Aksi ${row.name}`} disabled={isPending} className="btn inline-flex items-center rounded-[4px] border border-[var(--border-subtle)] px-2 py-1.5 text-[var(--text-primary)] transition hover:bg-[var(--bg-action-hover)]">
              <MoreHorizontal size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1.5">
              <DropdownMenuItem onSelect={() => runAction(setFieldStatusAction, row.id, row.status === 'active' ? 'inactive' : 'active')} className="gap-2 px-3 py-2 text-sm">
                <Power />
                {row.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => {
                  if (window.confirm(`Hapus ${row.name} secara permanen?`)) runAction(deleteFieldAction, row.id);
                }}
                className="gap-2 px-3 py-2 text-sm"
              >
                <Trash2 />
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-card)] text-[var(--text-secondary)] ring-1 ring-[var(--border-subtle)]">
            <MapPin size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t('admin.manageFields')}</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {fields.length} fields in inventory
            </p>
          </div>
        </div>
        <Link
          href="/admin/fields/create"
          className="btn inline-flex items-center justify-center gap-2 rounded-[4px] bg-[var(--text-primary)] px-4 py-2.5 text-sm font-medium text-[var(--bg-card)] transition hover:bg-[var(--accent-blue-hover)]"
        >
          <Plus size={16} />
          {t('admin.addField')}
        </Link>
        </div>
        {feedback && <p role="status" className="text-sm text-[var(--text-secondary)]">{feedback}</p>}

      {/* DataTable */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
        <DataTable columns={columns} data={fields} keyExtractor={(row) => row.id} controls={false} />
      </div>
    </div>
  );
}
