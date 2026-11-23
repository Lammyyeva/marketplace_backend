const ExcelJS = require('exceljs');
const path = require('path');

async function generateFixedExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
        { header: 'productName', key: 'productName' },
        { header: 'slug', key: 'slug' },
        { header: 'description', key: 'description' },
        { header: 'sku', key: 'sku' },
        { header: 'variantName', key: 'variantName' },
        { header: 'price', key: 'price' },
        { header: 'stock', key: 'stock' },
        { header: 'categories', key: 'categories' },
        { header: 'collections', key: 'collections' },
        { header: 'facets', key: 'facets' },
        { header: 'enabled', key: 'enabled' },
        { header: 'featuredAsset', key: 'featuredAsset' },
        { header: 'assetNames', key: 'assetNames' },
        { header: 'seoTitle', key: 'seoTitle' },
        { header: 'seoDescription', key: 'seoDescription' },
        { header: 'customField_warranty', key: 'customField_warranty' },
        { header: 'customField_brand', key: 'customField_brand' },
    ];

    const products = [
        // Using unique slugs for variants to avoid "combination already exists" error
        { productName: 'Smart Watch Series X Black', slug: 'smart-watch-x-black', description: 'Advanced fitness tracking with heart rate monitor and GPS.', sku: 'SW-100-BLK', variantName: 'Black Sport', price: 19900, stock: 50, categories: 'electronics,gadgets', collections: 'new-arrivals', facets: 'color:black,brand:tech', enabled: 'TRUE', featuredAsset: 'SW-100-BLK.jpg', assetNames: 'SW-100-BLK.jpg', seoTitle: 'Smart Watch Series X', seoDescription: 'High-end fitness watch', customField_warranty: '2 years', customField_brand: 'TechCorp' },
        { productName: 'Smart Watch Series X Silver', slug: 'smart-watch-x-silver', description: 'Advanced fitness tracking with heart rate monitor and GPS.', sku: 'SW-100-SLV', variantName: 'Silver Metal', price: 21900, stock: 25, categories: 'electronics,gadgets', collections: 'new-arrivals', facets: 'color:silver,brand:tech', enabled: 'TRUE', featuredAsset: 'SW-100-SLV.jpg', assetNames: 'SW-100-SLV.jpg', seoTitle: 'Smart Watch Series X', seoDescription: 'High-end fitness watch', customField_warranty: '2 years', customField_brand: 'TechCorp' },
        { productName: 'Retro Bluetooth Speaker', slug: 'retro-speaker', description: 'Vintage design with modern sound quality and 10-hour battery.', sku: 'SPK-VINT', variantName: 'Walnut Wood', price: 8999, stock: 40, categories: 'audio,electronics', collections: 'bestsellers', facets: 'material:wood', enabled: 'TRUE', featuredAsset: 'SPK-VINT.jpg', assetNames: 'SPK-VINT.jpg', seoTitle: 'Retro Wireless Speaker', seoDescription: 'Classic look speaker', customField_warranty: '1 year', customField_brand: 'SoundBlast' },
        { productName: '4K Gaming Monitor 27"', slug: 'gaming-monitor-27', description: '144Hz refresh rate with IPS panel for stunning visuals.', sku: 'MON-4K-27', variantName: 'Standard', price: 34900, stock: 15, categories: 'electronics,computing', collections: 'featured', facets: 'resolution:4k', enabled: 'TRUE', featuredAsset: 'MON-4K-27.jpg', assetNames: 'MON-4K-27.jpg', seoTitle: '27 inch 4K Gaming Monitor', seoDescription: 'Pro gaming monitor', customField_warranty: '3 years', customField_brand: 'Visionary' },
        { productName: 'Mechanical RGB Keyboard', slug: 'rgb-keyboard', description: 'Tactile blue switches with customizable per-key RGB lighting.', sku: 'KB-RGB-MECH', variantName: 'Blue Switches', price: 12500, stock: 60, categories: 'computing,accessories', collections: 'new-arrivals', facets: 'switch:blue', enabled: 'TRUE', featuredAsset: 'KB-RGB-MECH.jpg', assetNames: 'KB-RGB-MECH.jpg', seoTitle: 'RGB Mechanical Keyboard', seoDescription: 'Gaming mechanical keyboard', customField_warranty: '2 years', customField_brand: 'KeyMaster' },
        { productName: 'Ergo Gaming Mouse', slug: 'ergo-mouse', description: 'High-precision 16000 DPI sensor with ergonomic thumb rest.', sku: 'MS-ERGO-01', variantName: 'Pro Stealth', price: 5999, stock: 100, categories: 'computing,accessories', collections: 'bestsellers', facets: 'color:black', enabled: 'TRUE', featuredAsset: 'MS-ERGO-01.jpg', assetNames: 'MS-ERGO-01.jpg', seoTitle: 'Ergo Precision Gaming Mouse', seoDescription: 'Best ergonomic mouse', customField_warranty: '1 year', customField_brand: 'KeyMaster' },
        { productName: 'Aluminum Laptop Stand', slug: 'laptop-stand-alum', description: 'Elevates your laptop for better posture and cooling.', sku: 'STND-ALUM', variantName: 'Space Gray', price: 3500, stock: 150, categories: 'accessories,office', collections: 'featured', facets: 'material:aluminum', enabled: 'TRUE', featuredAsset: 'STND-ALUM.jpg', assetNames: 'STND-ALUM.jpg', seoTitle: 'Aluminum Laptop Stand', seoDescription: 'Portable laptop riser', customField_warranty: '5 years', customField_brand: 'DeskBase' },
        { productName: '7-in-1 USB-C Hub', slug: 'usbc-hub-7', description: 'Expand your laptop with HDMI, USB 3.0, and SD card slots.', sku: 'HUB-7IN1', variantName: 'Titan Gray', price: 4500, stock: 80, categories: 'computing,accessories', collections: 'new-arrivals', facets: 'material:metal', enabled: 'TRUE', featuredAsset: 'HUB-7IN1.jpg', assetNames: 'HUB-7IN1.jpg', seoTitle: '7-in-1 USB-C Docking Hub', seoDescription: 'Multi-port adapter', customField_warranty: '1 year', customField_brand: 'TechCorp' },
        { productName: '1TB Portable SSD', slug: 'external-ssd-1tb', description: 'Super-fast transfer speeds up to 1050MB/s. Rugged design.', sku: 'SSD-1TB-RUG', variantName: 'Rugged Blue', price: 14900, stock: 35, categories: 'computing,storage', collections: 'bestsellers', facets: 'capacity:1tb', enabled: 'TRUE', featuredAsset: 'SSD-1TB-RUG.jpg', assetNames: 'SSD-1TB-RUG.jpg', seoTitle: '1TB External Portable SSD', seoDescription: 'Fast external storage', customField_warranty: '3 years', customField_brand: 'DataSafe' },
        { productName: 'Active Noise Buds', slug: 'noise-buds-pro', description: 'Hybrid ANC with transparency mode and 30h total battery.', sku: 'BUDS-PRO-W', variantName: 'Pearl White', price: 12999, stock: 45, categories: 'audio,electronics', collections: 'featured', facets: 'color:white', enabled: 'TRUE', featuredAsset: 'BUDS-PRO-W.jpg', assetNames: 'BUDS-PRO-W.jpg', seoTitle: 'Noise Cancelling Earbuds', seoDescription: 'ANC wireless buds', customField_warranty: '1 year', customField_brand: 'SoundBlast' },
        { productName: 'Tablet Stylus Pen', slug: 'stylus-pen-v2', description: 'Pressure-sensitive stylus for drawing and note-taking.', sku: 'PEN-V2', variantName: 'Active Gray', price: 4999, stock: 120, categories: 'electronics,computing', collections: 'new-arrivals', facets: 'brand:tech', enabled: 'TRUE', featuredAsset: 'PEN-V2.jpg', assetNames: 'PEN-V2.jpg', seoTitle: 'Universal Tablet Stylus', seoDescription: 'Precision drawing pen', customField_warranty: '1 year', customField_brand: 'TechCorp' },
        { productName: 'LED Desk Lamp', slug: 'led-lamp-smart', description: 'Adjustable brightness and color temperature with USB port.', sku: 'LMP-SMART', variantName: 'Modern White', price: 2999, stock: 90, categories: 'home,office', collections: 'featured', facets: 'color:white', enabled: 'TRUE', featuredAsset: 'LMP-SMART.jpg', assetNames: 'LMP-SMART.jpg', seoTitle: 'Smart LED Desk Lamp', seoDescription: 'Eye-care desk light', customField_warranty: '2 years', customField_brand: 'DeskBase' },
        { productName: '1080p HD Web Camera', slug: 'web-cam-hd', description: 'Wide-angle lens with built-in noise-reducing microphone.', sku: 'CAM-1080P', variantName: 'Pro HD', price: 6500, stock: 55, categories: 'computing,electronics', collections: 'bestsellers', facets: 'resolution:1080p', enabled: 'TRUE', featuredAsset: 'CAM-1080P.jpg', assetNames: 'CAM-1080P.jpg', seoTitle: '1080p HD Web Camera', seoDescription: 'Clear video calling', customField_warranty: '1 year', customField_brand: 'Visionary' },
        { productName: '128GB MicroSD Card', slug: 'sd-128-v30', description: 'Class 10 U3 V30 for 4K video recording and high speed.', sku: 'SD-128-V30', variantName: 'Ultra Speed', price: 2500, stock: 200, categories: 'gadgets,storage', collections: 'new-arrivals', facets: 'capacity:128gb', enabled: 'TRUE', featuredAsset: 'SD-128-V30.jpg', assetNames: 'SD-128-V30.jpg', seoTitle: '128GB MicroSD Card', seoDescription: 'High speed memory card', customField_warranty: '10 years', customField_brand: 'DataSafe' },
        { productName: 'Ultra Thin Phone Case', slug: 'phone-case-thin', description: 'Matte finish, scratch-resistant, and supports wireless charging.', sku: 'CASE-IP15', variantName: 'Frosted Black', price: 1500, stock: 300, categories: 'gadgets,accessories', collections: 'featured', facets: 'color:black', enabled: 'TRUE', featuredAsset: 'CASE-IP15.jpg', assetNames: 'CASE-IP15.jpg', seoTitle: 'Ultra Thin Phone Case', seoDescription: 'Slim protective case', customField_warranty: '1 year', customField_brand: 'Generic' },
    ];

    worksheet.addRows(products);

    const outPath = path.join(process.cwd(), 'fixed_products_import.xlsx');
    await workbook.xlsx.writeFile(outPath);
    console.log(`Excel file created at: ${outPath}`);
}

generateFixedExcel().catch(console.error);
