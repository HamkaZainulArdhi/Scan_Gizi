import type { NutritionScan } from '../types/types';

export function createShareCardElement(scan: NutritionScan): HTMLDivElement {
  const { nutrition_summary } = scan.nutrition_facts;
  const allItems = scan.menu_items.map((i) => i.nama_menu).join(', ');
  const formattedDate = new Date(scan.scan_date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const sppgName = scan.profile?.sppg?.nama || '';
  const user = sppgName ? `${sppgName}` : '';

  // === CARD WRAPPER ===
  const card = document.createElement('div');
  card.style.cssText = `
    position: relative;
    width: 1080px;
    height: 1350px;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #c8ecd8 0%, #a8dcc0 100%);
    color: #1a202c;
  `;

  // Dekorasi background
  const bgDecor1 = document.createElement('div');
  bgDecor1.style.cssText = `
    position: absolute;
    width: 280px;
    height: 380px;
    top: -80px;
    left: -80px;
    background: linear-gradient(135deg, #34956f, #2d8661);
    border-radius: 50%;
    z-index: 0;
  `;
  card.appendChild(bgDecor1);

  const bgDecor2 = document.createElement('div');
  bgDecor2.style.cssText = `
    position: absolute;
    width: 200px;
    height: 450px;
    top: -50px;
    left: 120px;
    background: linear-gradient(135deg, #34956f, #2d8661);
    z-index: 0;
  `;
  card.appendChild(bgDecor2);

  const bgDecor3 = document.createElement('div');
  bgDecor3.style.cssText = `
    position: absolute;
    width: 420px;
    height: 500px;
    bottom: -100px;
    right: -120px;
    background: linear-gradient(135deg, #34956f, #2d8661);
    clip-path: polygon(0% 0%, 100% 20%, 100% 100%, 30% 100%);
    z-index: 0;
  `;
  card.appendChild(bgDecor3);

  // === CONTENT ===
  const contentContainer = document.createElement('div');
  contentContainer.style.cssText = `
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    padding: 60px 50px 50px 50px;
    display: flex;
    flex-direction: column;
  `;

  // === FOOD IMAGE ===
  const mealTraySection = document.createElement('div');
  mealTraySection.style.cssText = `
    background: #ffffff;
    border-radius: 35px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
    margin-bottom: 35px;
    flex-shrink: 0;
  `;
  const trayImageWrapper = document.createElement('div');
  trayImageWrapper.style.cssText = `
    width: 100%;
    padding: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
  `;
  if (scan.image_url) {
    const foodImage = document.createElement('img');
    foodImage.src = scan.image_url;
    foodImage.alt = 'Food Photo';
    foodImage.style.cssText = `
      width: 100%;
      max-height: 480px;
      object-fit: contain;
      border-radius: 20px;
    `;
    trayImageWrapper.appendChild(foodImage);
  }
  mealTraySection.appendChild(trayImageWrapper);
  contentContainer.appendChild(mealTraySection);

  // === INFO CARD ===
  const infoCard = document.createElement('div');
  infoCard.style.cssText = `
    background: rgba(255, 255, 255, 0.85);
    border-radius: 35px;
    padding: 55px 50px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    flex: 1;
    display: flex;
    flex-direction: column;
  `;

  const title = document.createElement('h1');
  title.textContent = 'NILAI GIZI MBG';
  title.style.cssText = `
    text-align: center;
    font-size: 64px;
    font-weight: 800;
    margin-bottom: 50px;
  `;
  infoCard.appendChild(title);

  // === NUTRITION GRID ===
  const grid = document.createElement('div');
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 35px 60px;
    margin-bottom: 50px;
  `;

  const makeItem = (val: string, unit: string, label: string) => {
    const div = document.createElement('div');
    div.style.textAlign = 'center';
    div.innerHTML = `
      <div style="line-height:1;margin-bottom:8px;">
        <span style="font-size:72px;font-weight:800;">${val}</span>
        <span style="font-size:32px;color:#4a5568;">${unit}</span>
      </div>
      <div style="font-size:28px;color:#6b7280;">${label}</div>
    `;
    return div;
  };

  grid.appendChild(
    makeItem(nutrition_summary.calories_kcal.toString(), 'kcal', 'Kalori'),
  );
  grid.appendChild(makeItem(nutrition_summary.fat_g.toString(), 'g', 'Lemak'));
  grid.appendChild(
    makeItem(nutrition_summary.protein_g.toString(), 'g', 'Protein'),
  );
  grid.appendChild(
    makeItem(nutrition_summary.carbs_g.toString(), 'g', 'Karbo'),
  );
  infoCard.appendChild(grid);

  // === MENU INFO ===
  const menu = document.createElement('div');
  menu.innerHTML = `
    <h2 style="font-size:34px;font-weight:700;text-align:center;margin-bottom:20px;">
      Menu MBG hari ini – ${formattedDate}
    </h2>
    <p style="font-size:26px;color:#4a5568;text-align:center;">${allItems}</p>
  `;
  infoCard.appendChild(menu);

  // === FOOTER ===
  const footer = document.createElement('div');
  footer.style.cssText = `
    text-align: center;
    border-top: 1.5px solid rgba(0, 0, 0, 0.08);
    padding-top: 30px;
  `;
  footer.innerHTML = `
    <div style="font-size:28px;font-weight:700;">${user}</div>
    <div style="font-size:22px;color:#6b7280;">Powered by ©GiziKita AI-Scanner</div>
  `;
  infoCard.appendChild(footer);

  contentContainer.appendChild(infoCard);
  card.appendChild(contentContainer);

  return card;
}
