FROM node:18-alpine AS build
WORKDIR /usr/src/app
ARG SERVER_NAME
ENV SERVER_NAME=$SERVER_NAME
ARG SERVER_HOST
ENV SERVER_HOST=$SERVER_HOST
ARG SERVER_PORT
ENV SERVER_PORT=$SERVER_PORT
COPY package*.json /usr/src/app/
COPY src /usr/src/app/src
COPY tsconfig.json /usr/src/app/tsconfig.json
COPY templates /usr/src/app/templates

# PASSO 1: Pula o download do binário do Puppeteer no 'npm install'
# Isso resolve o travamento do build.
ENV PUPPETEER_SKIP_DOWNLOAD=true 

# PASSO 2: Instala o navegador Chromium usando o gerenciador de pacotes do sistema (APK)
# Isso garante que a aplicação (htmltwopdf) tenha o navegador para gerar PDFs.
RUN apk update && \
    apk add --no-cache \
        chromium \
        nss \
        freetype \
        harfbuzz \
        ttf-freefont \
        dumb-init

# Cria arquivos de ambiente vazios (mantendo a correção anterior)
RUN touch .env .env.development .env.production

RUN npm install
RUN npm run build

FROM node:18-alpine
ENV NODE_ENV production
WORKDIR /usr/src/node
COPY --from=build /usr/src/app/build /usr/src/node
# Como você usou node:18-alpine no build, use node:18-alpine aqui também.
# O Vercel/Render não detecta o node:lts-alpine na segunda stage.
RUN npm ci --only=production
EXPOSE 80
CMD ["npm", "start"]