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
# Copia a pasta 'templates' (necessário para a função copyTemplates())
COPY templates /usr/src/app/templates

# CORREÇÃO CRÍTICA:
# 1. Cria arquivos de ambiente vazios para satisfazer a lógica de cópia do Build.ts
#    Isso evita o erro "not found" (ENOENT) que você está vendo.
RUN touch .env
RUN touch .env.development
RUN touch .env.production

RUN npm install
RUN npm run build

FROM node:18-alpine
ENV NODE_ENV production
WORKDIR /usr/src/node
COPY --from=build /usr/src/app/build /usr/src/node
RUN npm ci --only=production
EXPOSE 80
CMD ["npm", "start"]