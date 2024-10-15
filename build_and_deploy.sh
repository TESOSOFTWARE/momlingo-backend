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
  ssh -i /Users/thaikv/Works/Projects/Momlingo/Deploy/Lightsail.pem ec2-user@52.221.248.26
  ssh -i /Users/thaikv/Works/Home/Momlingo/Deploy/Lightsail.pem ec2-user@54.169.31.129

  chmod 400 /Users/thaikv/Works/Projects/Momlingo/Deploy/Lightsail.pem
  chmod 400 /Users/thaikv/Works/Home/Momlingo/Deploy/Lightsail.pem

5. Config Server
  - Install docker
  - Install docker compose
  - Install mysql then change account - pass
  - Install phpMyAdmin
  - Login to docker for pull image: docker login

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
  Run srcipt on package.json
    - docker exec -it your-container-name yarn run your-migration-script

  View images
    - docker images
  Remove image
    - docker rmi <image_id>
