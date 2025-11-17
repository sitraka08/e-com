/*
  Warnings:

  - Added the required column `sellerId` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add the column as nullable first
ALTER TABLE `order_items` ADD COLUMN `sellerId` INTEGER NULL;

-- Step 2: Populate sellerId from the products table
UPDATE `order_items` oi
INNER JOIN `products` p ON oi.productId = p.id
SET oi.sellerId = p.sellerId
WHERE p.sellerId IS NOT NULL;

-- Step 3: Make the column NOT NULL
ALTER TABLE `order_items` MODIFY COLUMN `sellerId` INTEGER NOT NULL;

-- Step 4: Create index
CREATE INDEX `order_items_sellerId_idx` ON `order_items`(`sellerId`);

-- Step 5: Add foreign key constraint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `sellers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
