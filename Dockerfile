FROM node:20.18.1
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY src/ ./src/
RUN npm run build
RUN echo "Building the application"
RUN ls -la dist/
RUN npm ci
ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start:dev"]