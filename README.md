1. Run project with docker, follow by scripts in package.json
   yarn docker:dev
2. Main service
   http://localhost:3000/
3. Database dashboard
   http://localhost:8080/
4. Create migration: 
   yarn migration:create CreatePostTable
5. Auto format code with elint
   yarn lint

Note: Need create Database before run project with docker

Node: v22.9.0
yarn: 1.22.19
