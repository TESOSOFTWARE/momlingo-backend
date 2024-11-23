1. Build Local
  Stop and clear cache of container that created by docker-compose.yml
    - docker-compose down
  Run docker compose with .env
    - docker-compose --env-file .env.dev up
  Run docker compose with .env and build
    - docker-compose --env-file .env.dev up --build
  Docker compose build image
    - docker-compose --env-file .env.dev build
  # --no-cache (Option): Ex: docker-compose build --no-cache

2. Change image name and tag before push to docker hub
  - docker tag momlingo-backend_app:latest thaikvteso/momlingo-be-dev:latest
  #momlingo-backend_app is the image generated from docker-compose --env-file .env.dev build
  - docker tag mysql:latest thaikvteso/mysql:5.7
  # For first deployment only

3. Login and push image to docker hub
  Login docker hub
    - docker login
  Push app image
    - docker push thaikvteso/momlingo-be-dev:latest
  Push mysql
    - docker push thaikvteso/mysql:5.7

4. Connect to AWS Lightsail Instance by ssh
  - ssh -i path/to/your/key.pem ubuntu@your_instance_ip
    For first time on Mac: chmod 400 path/to/your/key.pem
  Ex:
  ssh -i /Users/thaikv/Works/Projects/Momlingo/Deploy/Lightsail.pem ec2-user@54.251.243.96
  ssh -i /Users/thaikv/Works/Home/Momlingo/Deploy/Lightsail.pem ec2-user@54.251.243.96

  chmod 400 /Users/thaikv/Works/Projects/Momlingo/Deploy/Lightsail.pem
  chmod 400 /Users/thaikv/Works/Home/Momlingo/Deploy/Lightsail.pem

5. Config Server
  - Install docker
  - Install docker compose
  - Install mysql then change account - pass
  - Install phpMyAdmin
  - Login to docker for pull image: docker login
  - docker pull thaikvteso/momlingo-be-dev:latest

6. Config project
  - Create application folder
  - Create .env.dev config #nano .env.dev
  - Create docker-compose.yml #nano docker-compose.yml

7. Run Server(DEPLOY)
  - docker-compose down
  - docker-compose --env-file .env.dev up
  # Docker find image from local before check on Registry.
  # So you can pull to local by:
  # docker pull thaikvteso/momlingo-be-dev:latest

8. Logs and other info
  View docker container is runing
    - docker ps
  View all docker container
    - docker ps -a
  Stop docker container
    - docker stop <container_id>
  Log docker container
    - docker logs <container_id_or_name>
  Run migration database on docker container
    - docker exec -it your-container-name yarn migration:run
    #EX: docker exec -it momlingo-be-dev-container yarn migration:run
    docker exec -it bemomlingodev-app-1 yarn migration:run
  Conect to docker id
    - docker exec -it <container_id> /bin/sh
    #Ex: docker exec -it 3b0f1190fa06 /bin/sh
  Run srcipt on package.json
    - docker exec -it your-container-name yarn run your-migration-script

  View images
    - docker images
  Remove image
    - docker rmi <image_id>

9. Backup database before deployment
  Create backup
    - mysqldump -u username -p database_name > /path/to/your/backup_file.sql
    #Ex: mysqldump -u root -p momlingo_db_dev > momlingo_db_dev_backup.sql
    # /path/to/your ==
  Backup
    - mysql -u username -p database_name < backup_file.sql
    #Ex: mysql -u username -p momlingo_db_dev < momlingo_db_dev_backup.sql

Overal Step
  - docker-compose --env-file .env.dev build
  - docker tag momlingo-backend-app:latest thaikvteso/momlingo-be-dev:latest
  - docker push thaikvteso/momlingo-be-dev:latest
  - ssh -i /Users/thaikv/Works/Home/Momlingo/Deploy/Lightsail.pem ec2-user@54.251.243.96
  - cd to project folder
  - docker pull thaikvteso/momlingo-be-dev:latest
  + mysqldump -u root -p momlingo_db_dev > momlingo_db_dev_backup.sql
  - docker-compose stop
   # docker-compose --env-file .env.dev down
  - docker-compose --env-file .env.dev up

Clear cache
  - docker-compose --env-file .env.dev build --no-cache

Create and Update Table and Run
- yarn migration:create CreateUsersTable
- yarn migration:create UpdateUserTable
- yarn migration:generate ./src/database/migrations/CreateUsersTable
- yarn migration:run

10. Remove all containers
  - docker rm -f $(docker ps -a -q)

11. Remove all images
  - docker rmi -f $(docker images -q)

12. Remove all volumes
  - docker volume rm $(docker volume ls -q)

13. Remove all networks
  - docker network rm $(docker network ls -q)

