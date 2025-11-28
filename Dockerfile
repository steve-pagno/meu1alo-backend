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

# --- INÍCIO DAS CORREÇÕES ---

# 1. Copia o arquivo .env.development. 
#    Ele DEVE existir no seu repositório local.
COPY .env.development /usr/src/app/.env.development 

# 2. Copia o arquivo .env.production (CRIE UM ARQUIVO VAZIO se não existir no seu repositório local).
#    O script de build (EnvConfig) procura por ele, e se não existir, a cópia falha.
COPY .env.production /usr/src/app/.env.production

# 3. Copia a pasta 'templates' (necessária para o Build.copyTemplates())
COPY templates /usr/src/app/templates

# --- FIM DAS CORREÇÕES ---

RUN npm install
RUN npm run build

FROM node:18-alpine
ENV NODE_ENV production
WORKDIR /usr/src/node
COPY --from=build /usr/src/app/build /usr/src/node
RUN npm ci --only=production
EXPOSE 80
CMD ["npm", "start"]