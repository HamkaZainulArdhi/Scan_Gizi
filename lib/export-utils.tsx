import domtoimage from 'dom-to-image';
import type { NutritionScan } from './types';

export async function exportHistoryToExcel(scans: NutritionScan[]) {
  if (scans.length === 0) return;

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

  scans.forEach((scan) => {
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
  worksheet.columns.forEach((column) => (column.width = 15));

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
}

export async function generateShareCard(scan: NutritionScan): Promise<string> {
  try {
    // Tunggu semua font selesai dimuat
    await document.fonts.ready;

    // Buat wrapper untuk memastikan div ada di viewport
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.opacity = '0';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.zIndex = '-9999';

    // Buat card element
    const cardElement = document.createElement('div');
    cardElement.style.cssText = `
      width: 600px;
      padding: 32px;
      background: linear-gradient(135deg, #15803d 0%, #22c55e 100%);
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border-radius: 16px;
    `;

    // Force background dan color
    cardElement.style.setProperty(
      'background',
      'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
      'important',
    );
    cardElement.style.setProperty('background-color', '#22c55e', 'important');
    cardElement.style.setProperty('color', '#fff', 'important');

    const { nutrition_summary } = scan.nutrition_facts;
    const allItems = scan.menu_items.map((item) => item.nama_menu).join(', ');

    cardElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 8px 0;">Nutrition Scan</h1>
        <p style="font-size: 16px; opacity: 0.9; margin: 0;">AI-Powered Food Analysis</p>
      </div>
      <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
          <div>
            <div style="font-size: 32px; font-weight: bold; margin-bottom: 4px;">${nutrition_summary.calories_kcal}</div>
            <div style="font-size: 14px; opacity: 0.8;">Calories</div>
          </div>
          <div>
            <div style="font-size: 32px; font-weight: bold; margin-bottom: 4px;">${nutrition_summary.protein_g}g</div>
            <div style="font-size: 14px; opacity: 0.8;">Protein</div>
          </div>
          <div>
            <div style="font-size: 32px; font-weight: bold; margin-bottom: 4px;">${nutrition_summary.carbs_g}g</div>
            <div style="font-size: 14px; opacity: 0.8;">Carbs</div>
          </div>
        </div>
      </div>
      <div style="text-align: center;">
        <p style="font-size: 16px; margin: 0 0 8px 0; opacity: 0.9;">Menu MBG Hari ini: <br /> ${new Date(scan.scan_date).toLocaleDateString()}</p>
        <p style="font-size: 18px; font-weight: 600; margin: 0;">${allItems}</p>
      </div>
      <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
  <p style="font-size: 14px; margin: 0; opacity: 0.7;">SPPG ${scan.user_name || 'User'} </p>
      </div>
    `;

    wrapper.appendChild(cardElement);
    document.body.appendChild(wrapper);

    // Generate image menggunakan dom-to-image
    const dataUrl = await domtoimage.toPng(cardElement, {
      width: 600,
      height: cardElement.offsetHeight,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    });

    // Hapus wrapper setelah selesai
    document.body.removeChild(wrapper);

    return dataUrl;
  } catch (error) {
    console.error('Share card generation failed:', error);
    throw new Error('Failed to generate share card');
  }
}

// Share via Web Share API or fallback
export async function shareNutritionScan(scan: NutritionScan) {
  const shareData = {
    title: 'My Nutrition Analysis',
    text: `I analyzed my meal and found ${scan.nutrition_facts.nutrition_summary.calories_kcal} calories! Check out the detailed breakdown.`,
    url: window.location.href,
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  } else {
    // Fallback: copy to clipboard
    try {
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      await navigator.clipboard.writeText(shareText);
      return 'clipboard';
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      return false;
    }
  }
}
