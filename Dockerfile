# Dockerfile
FROM node:22

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Sao chép package.json và yarn.lock
COPY package.json yarn.lock ./

# Cài đặt các phụ thuộc
RUN yarn install --frozen-lockfile

# Sao chép mã nguồn
COPY . .

# Chạy nodemon
CMD ["npx", "nodemon", "src/main.ts"]

# Biên dịch ứng dụng
RUN yarn build

# Mở cổng cho ứng dụng
EXPOSE 3000

# Chạy ứng dụng
CMD ["yarn", "start:dev"]
