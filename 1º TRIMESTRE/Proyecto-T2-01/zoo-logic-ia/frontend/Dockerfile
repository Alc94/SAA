# ---------- Etapa de compilación (Angular + Tailwind) ----------
FROM node:20-alpine AS build
WORKDIR /app
ENV NG_CLI_ANALYTICS=false
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

# ---------- Etapa de ejecución (nginx) ----------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/zoo-logic/browser /usr/share/nginx/html
EXPOSE 80
