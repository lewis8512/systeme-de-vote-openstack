# NestJs REST API

Technologies used:
- NestJs
- Prisma (ORM)
- PostgreSQL
- Docker

Pour utiliser :

```bash
yarn
```

Installer la base de données PostgreSQL avec Docker :
```bash
docker compose up -d
```
```bash
psql -h localhost -p 5434 -U postgres -d nest -f prisma_dump.sql
```

Il faut ensuite démarrer le container : ATTENTION CA SUPPRIME LE DUMP
```bash
yarn db:dev:restart
```

```bash
npx prisma generate

npx prisma studio
``

Lancer le serveur :
```bash
 yarn start:dev
```


Commandes utiles pour le développement :

Pour créer directement le dossier avec le module, le controller et le service :
```bash
npx nest g module <module_name>
npx nest g controller <module_name>
npx nest g service <module_name>
```
