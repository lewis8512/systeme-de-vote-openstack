import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Helper pour creer des dates relatives a aujourd'hui
function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  console.log('🚀 Initialisation de la base...');

  await prisma.$transaction([
    prisma.receipt.deleteMany(),
    prisma.vote.deleteMany(),
    prisma.candidate.deleteMany(),
    prisma.elector.deleteMany(),
    prisma.election.deleteMany(),
    prisma.admin.deleteMany()
  ]);

  // 🗳️ Élection EN COURS (commence il y a 2 jours, finit dans 30 jours)
  const election = await prisma.election.create({
    data: {
      title: 'Élection Présidentielle',
      startDate: daysFromNow(-2),  // Commence il y a 2 jours
      endDate: daysFromNow(30),    // Finit dans 30 jours
    },
  });

  // Autres élections (futures)
  await prisma.election.createMany({
    data: [
      {
        title: 'Élections Législatives',
        startDate: daysFromNow(45),   // Dans 45 jours
        endDate: daysFromNow(55),     // Dans 55 jours
      },
      {
        title: 'Référendum Constitutionnel',
        startDate: daysFromNow(90),
        endDate: daysFromNow(91),
      },
      {
        title: 'Élections Municipales',
        startDate: daysFromNow(120),
        endDate: daysFromNow(130),
      },
    ],
  });

  console.log(`✅ Élection EN COURS créée : ${election.title}`);

  // 🧑‍🤝‍🧑 3 candidats liés à cette élection
  const candidates = [
    { name: 'Élodie', surname: 'Moreau', party: 'Parti Écologique', imagePath: './images/nathalie.jpg' },
    { name: 'Thierry', surname: 'Girard', party: 'Union Nationale', imagePath: './images/thierry.jpg' },
    { name: 'Franck', surname: 'Leclerc', party: 'Solidarité Populaire', imagePath: './images/franck.jpg' },
    { name: 'Emmanuel', surname: 'Macron', party: 'La République En Marche', imagePath: './images/macron.png' },
  ];

  for (const c of candidates) {

    const imageBuffer = fs.readFileSync(path.resolve(__dirname, c.imagePath)); // Lit le fichier image


    await prisma.candidate.create({
      data: {
        name: c.name,
        surname: c.surname,
        party: c.party,
        electionId: election.id,
        image: imageBuffer
      },
    });

    console.log(`✅ Candidat ajouté : ${c.name} ${c.surname}`);
  }

  // 👤 3 électeurs avec tous les champs obligatoires
  const electors = [
    {
      name: 'Lewis',
      surname: 'Suire',
      birthDate: new Date('1995-06-10'),
      birthPlace: 'Paris',
      idCardNumber: '123456789',
      password: 'test1234',
      email: 'lewis.suire.pro@gmail.com',
    },
    {
      name: 'François',
      surname: 'Besnard',
      birthDate: new Date('1996-12-09'),
      birthPlace: 'Loudéac',
      idCardNumber: '987654321',
      password: 'azerty456',
      email: 'Frandu22600@hotmail.fr',
    },
    {
      name: 'Charlie',
      surname: 'Lemoine',
      birthDate: new Date('1988-03-22'),
      birthPlace: 'Marseille',
      idCardNumber: '111222333',
      password: 'vote2025',
      email: 'charlie.lemoine@example.com',
    },
    {
      name: 'Lucie',
      surname: 'Bernard',
      birthDate: new Date('1994-03-12'),
      birthPlace: 'Nice',
      idCardNumber: '100000001',
      password: 'lucie94',
      email: 'lucie.bernard@example.com',
    },
    {
      name: 'Thomas',
      surname: 'Durand',
      birthDate: new Date('1987-07-09'),
      birthPlace: 'Strasbourg',
      idCardNumber: '100000002',
      password: 'thom87',
      email: 'thomas.durand@example.com',
    },
    {
      name: 'Sophie',
      surname: 'Lemoine',
      birthDate: new Date('1991-11-27'),
      birthPlace: 'Grenoble',
      idCardNumber: '100000003',
      password: 'soph91',
      email: 'sophie.lemoine@example.com',
    },
    {
      name: 'Antoine',
      surname: 'Girard',
      birthDate: new Date('1992-01-20'),
      birthPlace: 'Toulouse',
      idCardNumber: '100000004',
      password: 'anto92',
      email: 'antoine.girard@example.com',
    },
    {
      name: 'Julie',
      surname: 'Roux',
      birthDate: new Date('1990-05-15'),
      birthPlace: 'Nantes',
      idCardNumber: '100000005',
      password: 'julie90',
      email: 'julie.roux@example.com',
    },
    {
      name: 'Hugo',
      surname: 'Morel',
      birthDate: new Date('1989-09-30'),
      birthPlace: 'Rouen',
      idCardNumber: '100000006',
      password: 'hugo89',
      email: 'hugo.morel@example.com',
    },
    {
      name: 'Emma',
      surname: 'Marchand',
      birthDate: new Date('1996-04-18'),
      birthPlace: 'Angers',
      idCardNumber: '100000007',
      password: 'emma96',
      email: 'emma.marchand@example.com',
    },
    {
      name: 'Nicolas',
      surname: 'Garnier',
      birthDate: new Date('1993-12-03'),
      birthPlace: 'Le Havre',
      idCardNumber: '100000008',
      password: 'nico93',
      email: 'nicolas.garnier@example.com',
    },
    {
      name: 'Camille',
      surname: 'Lambert',
      birthDate: new Date('1995-02-22'),
      birthPlace: 'Bordeaux',
      idCardNumber: '100000009',
      password: 'cam95',
      email: 'camille.lambert@example.com',
    },
    {
      name: 'Mathieu',
      surname: 'Noël',
      birthDate: new Date('1986-08-08'),
      birthPlace: 'Reims',
      idCardNumber: '100000010',
      password: 'math86',
      email: 'mathieu.noel@example.com',
    },
    {
      name: 'Clara',
      surname: 'Dupuis',
      birthDate: new Date('1997-06-05'),
      birthPlace: 'Besançon',
      idCardNumber: '100000011',
      password: 'clara97',
      email: 'clara.dupuis@example.com',
    },
    {
      name: 'Julien',
      surname: 'Pires',
      birthDate: new Date('1988-03-14'),
      birthPlace: 'Orléans',
      idCardNumber: '100000012',
      password: 'julien88',
      email: 'julien.pires@example.com',
    },
    {
      name: 'Léa',
      surname: 'Lopez',
      birthDate: new Date('1993-10-11'),
      birthPlace: 'Tours',
      idCardNumber: '100000013',
      password: 'lea93',
      email: 'lea.lopez@example.com',
    },
    {
      name: 'Maxime',
      surname: 'Chevalier',
      birthDate: new Date('1992-07-19'),
      birthPlace: 'Metz',
      idCardNumber: '100000014',
      password: 'max92',
      email: 'maxime.chevalier@example.com',
    },
    {
      name: 'Manon',
      surname: 'Martinez',
      birthDate: new Date('1991-09-28'),
      birthPlace: 'Avignon',
      idCardNumber: '100000015',
      password: 'manon91',
      email: 'manon.martinez@example.com',
    },
    {
      name: 'Alexandre',
      surname: 'Faure',
      birthDate: new Date('1990-02-10'),
      birthPlace: 'Toulon',
      idCardNumber: '100000016',
      password: 'alex90',
      email: 'alexandre.faure@example.com',
    },
    {
      name: 'Elisa',
      surname: 'Barbier',
      birthDate: new Date('1994-04-24'),
      birthPlace: 'Perpignan',
      idCardNumber: '100000017',
      password: 'elisa94',
      email: 'elisa.barbier@example.com',
    },
    {
      name: 'Paul',
      surname: 'Schmitt',
      birthDate: new Date('1993-01-03'),
      birthPlace: 'Limoges',
      idCardNumber: '100000018',
      password: 'paul93',
      email: 'paul.schmitt@example.com',
    },
    {
      name: 'Anaïs',
      surname: 'Benoit',
      birthDate: new Date('1996-08-15'),
      birthPlace: 'Poitiers',
      idCardNumber: '100000019',
      password: 'anais96',
      email: 'anais.benoit@example.com',
    },
    {
      name: 'Romain',
      surname: 'Guillaume',
      birthDate: new Date('1987-05-09'),
      birthPlace: 'La Rochelle',
      idCardNumber: '100000020',
      password: 'romain87',
      email: 'romain.guillaume@example.com',
    }
  ];

  for (const e of electors) {
    const hash = await argon2.hash(e.password);

    await prisma.elector.create({
      data: {
        name: e.name,
        surname: e.surname,
        birthDate: e.birthDate,
        birthPlace: e.birthPlace,
        idCardNumber: e.idCardNumber,
        password: hash,
        email: e.email,
      },
    });

    console.log(`✅ Électeur ajouté : ${e.name} ${e.surname}`);
  }

  // 🗳️ Ajout de quelques votes de test (pas pour Lewis Suire - 123456789)
  const allElectors = await prisma.elector.findMany();
  const allCandidates = await prisma.candidate.findMany({ where: { electionId: election.id } });

  // Électeurs qui vont voter (exclure Lewis Suire)
  const votersToCreate = allElectors.filter(e => e.idCardNumber !== '123456789').slice(0, 10);

  for (const voter of votersToCreate) {
    // Choisir un candidat aléatoire
    const randomCandidate = allCandidates[Math.floor(Math.random() * allCandidates.length)];

    // Créer le vote
    await prisma.vote.create({
      data: {
        electorId: voter.id,
        electionId: election.id,
      },
    });

    // Créer le récépissé avec un hash unique
    const voteHash = `DEMO-${voter.id}-${election.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    await prisma.receipt.create({
      data: {
        voteHash,
        candidateId: randomCandidate.id,
        electionId: election.id,
      },
    });

    console.log(`✅ Vote ajouté : ${voter.name} ${voter.surname} → ${randomCandidate.name} ${randomCandidate.surname}`);
  }

  const hash = await argon2.hash('admin1234');

  await prisma.admin.create({
    data: {
      email: 'hSimpsons@gouv.fra',
      password: hash,
    },
  });

  console.log(`✅ Admin créé : hSimpsons@gouv.fra`);

  console.log('🎉 Données de test insérées avec succès.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });