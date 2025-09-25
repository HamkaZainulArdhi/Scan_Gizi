'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
  ArrowUpDown,
  Calendar,
  Download,
  Eye,
  ImageIcon,
  MoreHorizontal,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { NutritionScan } from '@/lib/types';
import { useHistoryScans } from '@/hooks/use-history-scan';
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
import { NutritionResults } from './nutrition-results';

interface HistoryTableProps {
  user: SupabaseUser;
}

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
      .map((i) => i.nama_menu)
      .join(', ');
    return { itemCount, calories, mainItems };
  };

  // ---------- Actions ----------
  const handleShareCard = async (scan: NutritionScan) => {
    try {
      const { generateShareCard } = await import('@/lib/export-utils');
      const scanWithUserName = {
        ...scan,
        user_name: user.user_metadata?.full_name || user.email,
      };
      const cardUrl = await generateShareCard(scanWithUserName);
      const link = document.createElement('a');
      link.href = cardUrl;
      link.download = `nutrition-card-${
        new Date(scan.scan_date).toISOString().split('T')[0]
      }.png`;
      link.click();
      URL.revokeObjectURL(cardUrl);
      toast.success('Nutrition card downloaded!');
    } catch {
      toast.error('Card generation failed');
    }
  };

  const handleExportAll = async () => {
    if (!filteredScans.length) return;
    setIsExporting(true);
    try {
      await exportHistoryToExcel();
      toast.success('Excel file downloaded!');
    } catch {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  // ---------- Detail View ----------
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

  // ---------- Main ----------
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {scans.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Scans</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-chart-1 mb-2">
                  {Math.round(
                    scans.reduce(
                      (t, s) =>
                        t + s.nutrition_facts.nutrition_summary.calories_kcal,
                      0,
                    ),
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Calories Tracked
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-chart-2 mb-2">
                  {scans.reduce((t, s) => t + s.menu_items.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Food Items Analyzed
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="mb-8" />

          {/* Loading / Error / Empty */}
          {isLoading && <ContentLoader />}
          {error && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button variant="outline" onClick={fetchScans}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}
          {!isLoading && !error && scans.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No scans yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by uploading your first food image.
                </p>
                <Link href="/dashboard">
                  <Button>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Your First Scan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Table */}
          {!isLoading && !error && scans.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <CardTitle>Nutrition Scan History</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by food items or date..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
                      }
                    >
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      {sortOrder === 'desc' ? 'Latest First' : 'Oldest First'}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleExportAll}
                  disabled={isExporting || !filteredScans.length}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export to Excel'}
                </Button>
              </CardHeader>

              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Food Items</TableHead>
                        <TableHead>Calories</TableHead>
                        <TableHead>Protein</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedScans.map((scan) => {
                        const { itemCount, calories, mainItems } =
                          getScanSummary(scan);
                        return (
                          <TableRow key={scan.id}>
                            <TableCell>
                              <img
                                src={scan.image_url || '/placeholder.svg'}
                                alt="Food scan"
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            </TableCell>
                            <TableCell>{formatDate(scan.scan_date)}</TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="font-medium truncate">
                                  {mainItems}
                                </div>
                                {itemCount > 2 && (
                                  <div className="text-sm text-muted-foreground">
                                    +{itemCount - 2} more
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="success" appearance="outline">
                                {Math.round(calories)} kcal
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
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    router.push(`/history/${scan.id}`)
                                  }
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleShareCard(scan)}
                                    >
                                      <ImageIcon className="w-4 h-4 mr-2" />
                                      Share Card
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => deleteScan(scan.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {filteredScans.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No scans found for "{searchQuery}"
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex justify-end gap-5 items-center mt-4">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {page} of {Math.ceil(filteredScans.length / pageSize)}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page * pageSize >= filteredScans.length}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
