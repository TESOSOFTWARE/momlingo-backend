1. Main service
   http://localhost:3000/ - http://<your_public_ip>:3000/
2. Database dashboard
   http://localhost:8080/ - http://<your_public_ip>:8080/
3. Create migration:
   yarn migration:create CreatePostTable
4. Auto format code with elint
   yarn lint
5. Swagger API
   http://localhost:3000/api - http://<your_public_ip>:3000/api

Note: Need create Database before run project with docker
Node: v22.9.0
yarn: 1.22.19
