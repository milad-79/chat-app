import prisma from '../configs/prisma.config';

async function main() {
  const firstCoversition = await prisma.conversation.upsert({
    where: { endpoint: 'first_convsertion' },
    update: {},
    create: {
      title: 'First Conversition',
      endpoint: 'first_convsertion',
    },
  });

  const firstRoom = await prisma.room.upsert({
    where: { id: firstCoversition.id },
    update: {},
    create: {
      convId: firstCoversition.id,
      description: 'this is first Room',
      name: 'first room',
    },
  });

  console.log({ firstCoversition, firstRoom });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    prisma.$disconnect();
    process.exit(1);
  });
