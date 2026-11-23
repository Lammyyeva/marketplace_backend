DELETE FROM banner_image WHERE device = 'web' AND EXISTS (SELECT 1 FROM banner_image bi2 WHERE bi2."bannerId" = banner_image."bannerId" AND bi2."languageCode" = banner_image."languageCode" AND bi2.device = 'Web');
DELETE FROM banner_image WHERE device = 'mobile' AND EXISTS (SELECT 1 FROM banner_image bi2 WHERE bi2."bannerId" = banner_image."bannerId" AND bi2."languageCode" = banner_image."languageCode" AND bi2.device = 'Mobile');
UPDATE banner_image SET device = 'Web' WHERE device = 'web';
UPDATE banner_image SET device = 'Mobile' WHERE device = 'mobile';
