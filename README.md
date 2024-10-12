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

#Deploy BE
Build docker image:
- docker build -t momlingo-be-dev_v1.0 .

Show images:
- docker images

Gán tag cho image theo định dạng <tên-người-dùng>/<tên-image>:<tag>
Để tạo tag cho một Docker image, bạn sử dụng lệnh docker tag. Tag giúp bạn phân biệt các phiên bản khác nhau của cùng một image
- docker tag <tên-image>:<tag-cũ> <tên-image>:<tag-mới>
- EX: docker tag momlingo-be-dev:latest thaikvteso/momlingo-be-dev:v1.0
Đẩy image
- docker push myusername/my-image:latest
- Ex: docker push thaikvteso/momlingo-be-dev:v1.0 

Xoá image trong local 
- docker rmi <tên-image>:<tag>
- docker rmi <image-ID>

Pull docker từ terminal server
- docker login
- docker pull thaikvteso/momlingo-be-dev:v1.0

I. Cài đặt mysql
Cập Nhật Package Manager
- sudo yum update -y
1. Cập Nhật Package Manager
- sudo yum update -y
2. Cài đặt MySQL Community Repository để có thể cài đặt MySQL dễ dàng hơn
- sudo yum localinstall https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm
3. Cài Đặt MySQL Server
- sudo yum install mysql-server -y
4. Khởi Động MySQL
Khởi động dịch vụ MySQL và đảm bảo nó khởi động cùng với hệ thống:
- sudo systemctl start mysqld
-  sudo systemctl enable mysqld
5. Tìm Mật Khẩu Tạm Thời
- sudo grep 'temporary password' /var/log/mysqld.log
6. Bảo Mật MySQL
- sudo mysql_secure_installation

Nhập mật khẩu tạm thời mà bạn đã tìm được.
Bạn sẽ được yêu cầu thay đổi mật khẩu, xóa người dùng ẩn danh, không cho phép root đăng nhập từ xa, và xóa database test.

II. Cài Đặt phpMyAdmin
1. Cài Đặt phpMyAdmin
- sudo yum install epel-release -y
- sudo yum install phpmyadmin -y
2. Cấu Hình phpMyAdmin
 - Mở file cấu hình của phpMyAdmin:
    - sudo nano /etc/httpd/conf.d/phpMyAdmin.conf
 - Tìm và sửa đổi các dòng sau để cho phép truy cập từ bất kỳ địa chỉ IP nào:
    - Require local => Require all granted 
 - Lưu và thoát khỏi file.   
3. Khởi Động Lại Web Server: Khởi động lại Apache để áp dụng các thay đổi:
- sudo systemctl restart httpd

III. Truy Cập phpMyAdmin: root
- http://your-instance-ip/phpmyadmin

Run image với container // --env-file .env.dev
- docker run -d --name my-image-container -p 3000:3000 my-image:<tag>
- Ex: docker run -d --name momlingo-be-dev-container -p 3000:3000 thaikvteso/momlingo-be-dev:v1.0
- EX: docker run -p 3000:3000 thaikvteso/momlingo-be-dev:v1.1

Chạy migration database
- docker exec -it your-container-name yarn migration:run
- EX: docker exec -it momlingo-be-dev-container yarn migration:run 

Chạy srcipt trong package.json
- docker exec -it your-container-name yarn run your-migration-script


Kiểm tra container
- docker logs <tên_container>

Dừng docker
- docker stop container_id

View: 54.251.16.174:3000
