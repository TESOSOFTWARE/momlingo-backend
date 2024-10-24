# Dockerfile
FROM node:22

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Sao chép package.json và yarn.lock
COPY package.json yarn.lock ./

# Cài đặt các phụ thuộc
RUN yarn install --frozen-lockfile

RUN yarn global add nodemon

# Sao chép mã nguồn
COPY . .

# Biên dịch ứng dụng
RUN yarn build

# Mở cổng cho ứng dụng
EXPOSE 3000

# Chạy nodemon để theo dõi thay đổi trong mã nguồn
CMD ["npx", "nodemon", "--watch", ".", "src/main.ts"]
