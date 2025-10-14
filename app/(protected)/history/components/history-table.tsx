'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
  ArrowUpDown,
  Eye,
  ImageIcon,
  MoreHorizontal,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { NutritionScan } from '@/types/types';
import { useHistoryScans } from '@/hooks/use-history-scan';
import { useProfile } from '@/providers/profile-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ContentLoader } from '@/components/common/content-loader';
import { NutritionResults } from '../../analisis/components/nutrition-results';
import Nodata from './no-data';
import Stats from './stats';

interface HistoryTableProps {
  user: SupabaseUser;
}

// Constants

export function HistoryTable({ user }: HistoryTableProps) {
  const {
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
    fetchScans,
    deleteScan,
    exportHistoryToExcel,
  } = useHistoryScans(user);

  const [selectedScan] = useState<NutritionScan | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();
  const { profile } = useProfile();

  // Utils
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getScanSummary = (scan: NutritionScan) => ({
    itemCount: scan.menu_items.length,
    calories: scan.nutrition_facts.nutrition_summary.calories_kcal,
    allItems: scan.menu_items.map((i) => i.nama_menu).join(', '),
  });

  // Actions
  const handleShareCard = async (scan: NutritionScan) => {
    if (!profile) {
      toast.error('Profil belum dimuat, coba lagi nanti');
      return;
    }

    try {
      const { generateShareCard } = await import('@/lib/export-utils');
      const scanWithUserName = {
        ...scan,
        profile: profile
          ? {
              ...profile,
              sppg: profile.sppg === null ? undefined : profile.sppg,
            }
          : undefined,
      };
      const cardUrl = await generateShareCard(scanWithUserName);
      const link = document.createElement('a');
      link.href = cardUrl;
      link.download = `nutrition-card-${new Date(scan.scan_date).toISOString().split('T')[0]}.png`;
      link.click();
      URL.revokeObjectURL(cardUrl);
      toast.success('Gambar kartu diunduh!');
    } catch {
      toast.error('Gagal mengunduh gambar kartu');
    }
  };

  const handleExportAll = async () => {
    if (!filteredScans.length) return;
    setIsExporting(true);
    try {
      await exportHistoryToExcel();
      toast.success('File Excel berhasil diunduh!');
    } catch {
      toast.error('Gagal mengekspor data ke Excel');
    } finally {
      setIsExporting(false);
    }
  };

  // Components
  const ActionButtons = ({ scan }: { scan: NutritionScan }) => (
    <div className="flex items-center justify-end space-x-1 lg:space-x-2">
      <Button
        variant="foreground"
        size="sm"
        onClick={() => router.push(`/history/${scan.id}`)}
      >
        <Eye className="w-4 h-4 text-amber-600 hover:opacity-60" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleShareCard(scan)}>
            <ImageIcon className="w-4 h-4 mr-2" />
            Design
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => deleteScan(scan.id)}
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const ScanImage = ({ src }: { src?: string }) => (
    <img
      src={src || '/placeholder.svg'}
      alt="Food scan"
      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
    />
  );

  const ScanBadges = ({
    calories,
    protein,
    itemCount,
  }: {
    calories: number;
    protein: number;
    itemCount: number;
  }) => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success" appearance="outline" className="text-xs">
        {Math.round(calories)} kcal
      </Badge>
      <Badge variant="outline" className="text-xs">
        {Math.round(protein)}g protein
      </Badge>
      <Badge variant="outline" className="text-xs">
        {itemCount} item
      </Badge>
    </div>
  );

  // Main render
  if (selectedScan) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <NutritionResults scan={selectedScan} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background grid grid-cols-1 lg:grid-cols-3 gap-y-5 lg:gap-7.5">
      <main className="container mx-auto px-4 col-span-2 lg:col-span-3">
        <div className="max-w-7xl mx-auto">
          <Stats scans={scans} />
          <Separator className="mb-8" />
          {isLoading && <ContentLoader />}
          {error && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button variant="outline" onClick={fetchScans}>
                  Coba Lagi
                </Button>
              </CardContent>
            </Card>
          )}
          {!isLoading && !error && scans.length === 0 && <Nodata />}
          {/* Main Content */}
          {!isLoading && !error && scans.length > 0 && (
            <Card>
              <CardHeader>
                <div className="w-full flex flex-col gap-4 py-5">
                  <CardTitle>Riwayat Scan Menu</CardTitle>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="relative flex-1 sm:max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Cari menu ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="ps-9 w-71 h-8"
                      />
                    </div>
                    <div className="flex gap-2 sm:justify-end items-end ">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
                        }
                        className="flex-1 sm:flex-none h-8 "
                      >
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">
                          {sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}
                        </span>
                        <span className="sm:hidden">Sort</span>
                      </Button>
                      <Badge
                        onClick={handleExportAll}
                        disabled={isExporting || !filteredScans.length}
                        variant="success"
                        appearance="outline"
                        className="cursor-pointer hover:opacity-80 transition flex-1 sm:flex-none h-8"
                      >
                        <img
                          src="/media/file-types/excel.svg"
                          alt="Excel"
                          className="w-4 h-4"
                        />
                        <span className="hidden sm:inline">
                          {isExporting ? 'Exporting...' : 'Export ke Excel'}
                        </span>
                        <span className="sm:hidden">Export</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Desktop Table */}
                <div className="hidden lg:block rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Foto</TableHead>
                        <TableHead>Tanggal Scan</TableHead>
                        <TableHead>Menu</TableHead>
                        <TableHead>Kalori</TableHead>
                        <TableHead>Protein</TableHead>
                        <TableHead>item Menu</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedScans.map((scan) => {
                        const { itemCount, calories, allItems } =
                          getScanSummary(scan);
                        return (
                          <TableRow key={scan.id}>
                            <TableCell>
                              <ScanImage src={scan.image_url} />
                            </TableCell>
                            <TableCell>{formatDate(scan.scan_date)}</TableCell>
                            <TableCell>
                              <div className="max-w-sm whitespace-pre-line break-words font-medium">
                                {allItems}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="success"
                                appearance="outline"
                                size="md"
                              >
                                {Math.round(calories)}
                                {'\u202F'}kcal
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {Math.round(
                                scan.nutrition_facts.nutrition_summary
                                  .protein_g,
                              )}
                              g
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{itemCount}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <ActionButtons scan={scan} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {paginatedScans.map((scan) => {
                    const { itemCount, calories, allItems } =
                      getScanSummary(scan);
                    return (
                      <Card key={scan.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <ScanImage src={scan.image_url} />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(scan.scan_date)}
                                </span>
                                <ActionButtons scan={scan} />
                              </div>
                              <p className="font-medium text-sm mb-3 line-clamp-2">
                                {allItems}
                              </p>
                              <ScanBadges
                                calories={calories}
                                protein={
                                  scan.nutrition_facts.nutrition_summary
                                    .protein_g
                                }
                                itemCount={itemCount}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {filteredScans.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Tidak ada hasil pencarian untuk "{searchQuery}"
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => setSearchQuery('')}
                    >
                      Reset Pencarian
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                  <span className="text-sm text-muted-foreground">
                    Halaman {page} dari{' '}
                    {Math.ceil(filteredScans.length / pageSize)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      disabled={page * pageSize >= filteredScans.length}
                      onClick={() => setPage(page + 1)}
                    >
                      Berikutnya
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
