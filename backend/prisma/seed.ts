import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.productAttribute.deleteMany();
  await prisma.variantValue.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('Seeding Categories...');
  const categoriesData = [
    { name: 'Soft Toys', slug: 'soft-toys' },
    { name: 'Cars & Vehicles', slug: 'cars-vehicles' },
    { name: 'Building Blocks', slug: 'building-blocks' },
    { name: 'Dolls & Playsets', slug: 'dolls-playsets' },
    { name: 'Baby Toys', slug: 'baby-toys' },
    { name: 'Board Games', slug: 'board-games' },
    { name: 'Arts & Crafts', slug: 'arts-crafts' },
    { name: 'Outdoor Toys', slug: 'outdoor-toys' },
    { name: 'Educational Toys', slug: 'educational-toys' },
    { name: 'Gift Sets', slug: 'gift-sets' },
  ];

  const categoryRecords = [];
  for (const cat of categoriesData) {
    const record = await prisma.category.create({ data: cat });
    categoryRecords.push(record);
  }

  console.log('Seeding Products...');
  
  // Find specific categories to assign products
  const softToys = categoryRecords.find(c => c.slug === 'soft-toys');
  const vehicles = categoryRecords.find(c => c.slug === 'cars-vehicles');
  const blocks = categoryRecords.find(c => c.slug === 'building-blocks');

  const productsData = [
    {
      name: 'Giant Fluffy Teddy Bear',
      slug: 'giant-fluffy-teddy-bear',
      description: 'A massive, super soft teddy bear perfect for big hugs.',
      basePrice: 999.00,
      salePrice: 699.00,
      categoryId: softToys!.id,
      isFeatured: true,
    },
    {
      name: 'Speedster RC Car',
      slug: 'speedster-rc-car',
      description: 'High speed remote control car with drifting capabilities.',
      basePrice: 1799.00,
      salePrice: 1299.00,
      categoryId: vehicles!.id,
      isFeatured: true,
    },
    {
      name: 'Mega Creator Blocks Set',
      slug: 'mega-creator-blocks',
      description: '500 piece building blocks set for endless creativity.',
      basePrice: 1299.00,
      salePrice: 899.00,
      categoryId: blocks!.id,
      isFeatured: true,
    }
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
