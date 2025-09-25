// hooks/useHistoryScans.ts
'use client';

import { useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { NutritionScan } from '@/lib/types';

type SortOrder = 'asc' | 'desc';

export function useHistoryScans(user: SupabaseUser) {
  const [scans, setScans] = useState<NutritionScan[]>([]);
  const [filteredScans, setFilteredScans] = useState<NutritionScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // tambahan
  const [isExporting, setIsExporting] = useState(false);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [selectedScan, setSelectedScan] = useState<NutritionScan | null>(null);

  useEffect(() => {
    fetchScans();
  }, []);

  useEffect(() => {
    let data = scans.filter((scan) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        scan.menu_items.some((i) =>
          i.nama_menu.toLowerCase().includes(searchLower),
        ) ||
        new Date(scan.scan_date)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower)
      );
    });

    data = data.sort((a, b) =>
      sortOrder === 'desc'
        ? new Date(b.scan_date).getTime() - new Date(a.scan_date).getTime()
        : new Date(a.scan_date).getTime() - new Date(b.scan_date).getTime(),
    );

    setFilteredScans(data);
  }, [scans, searchQuery, sortOrder]);

  const fetchScans = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('nutrition_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      setScans(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scans');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteScan = async (scanId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('nutrition_scans')
        .delete()
        .eq('id', scanId)
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);
      fetchScans();
    } catch (err) {
      console.error('Delete failed:', err);
      throw err;
    }
  };

  const shareCard = async (scan: NutritionScan) => {
    const { generateShareCard } = await import('@/lib/export-utils');
    try {
      const cardUrl = await generateShareCard(scan);
      const link = document.createElement('a');
      link.href = cardUrl;
      link.download = `nutrition-card-${
        new Date(scan.scan_date).toISOString().split('T')[0]
      }.png`;
      link.click();
      URL.revokeObjectURL(cardUrl);

      setActionStatus('Nutrition card downloaded!');
      setTimeout(() => setActionStatus(null), 3000);
    } catch {
      setActionStatus('Card generation failed');
      setTimeout(() => setActionStatus(null), 3000);
    }
  };

  const exportHistoryToExcel = async () => {
    if (filteredScans.length === 0) return;
    setIsExporting(true);
    try {
      const ExcelJS = await import('exceljs');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Nutrition History');

      worksheet.addRow([
        'Date',
        'Food Items',
        'Calories',
        'Protein',
        'Fat',
        'Carbs',
        'Sodium',
        'Fiber',
      ]);

      filteredScans.forEach((scan) => {
        worksheet.addRow([
          new Date(scan.scan_date).toLocaleString(),
          scan.menu_items.map((item) => item.nama_menu).join(', '),
          scan.nutrition_facts.nutrition_summary.calories_kcal,
          scan.nutrition_facts.nutrition_summary.protein_g,
          scan.nutrition_facts.nutrition_summary.fat_g,
          scan.nutrition_facts.nutrition_summary.carbs_g,
          scan.nutrition_facts.nutrition_summary.sodium_mg,
          scan.nutrition_facts.nutrition_summary.fiber_g,
        ]);
      });

      worksheet.getRow(1).font = { bold: true };
      worksheet.columns.forEach((col) => (col.width = 15));

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nutrition-history-${
        new Date().toISOString().split('T')[0]
      }.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      setActionStatus('Excel file downloaded!');
    } catch {
      setActionStatus('Export failed');
    } finally {
      setTimeout(() => setActionStatus(null), 3000);
      setIsExporting(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getScanSummary = (scan: NutritionScan) => {
    const itemCount = scan.menu_items.length;
    const calories = scan.nutrition_facts.nutrition_summary.calories_kcal;
    const mainItems = scan.menu_items
      .slice(0, 2)
      .map((item) => item.nama_menu)
      .join(', ');
    return { itemCount, calories, mainItems };
  };

  const paginatedScans = filteredScans.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const totalPages = Math.ceil(filteredScans.length / pageSize);

  return {
    scans,
    filteredScans,
    paginatedScans,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    pageSize,
    totalPages,
    fetchScans,
    deleteScan,
    shareCard,
    exportHistoryToExcel,
    formatDate,
    getScanSummary,
    isExporting,
    actionStatus,
    selectedScan,
    setSelectedScan,
  };
}
