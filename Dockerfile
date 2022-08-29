FROM node:16-alpine AS deps

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

FROM node:16-alpine AS builder

WORKDIR /usr/src/app

COPY ./ ./
COPY --from=deps /usr/src/app/node_modules ./node_modules

ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY

RUN yarn build

FROM node:16-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /usr/src/app/public ./public

RUN chown -R nextjs:nodejs /usr/src/app/.next

USER nextjs

RUN npx next telemetry disable

EXPOSE 3000

CMD ["yarn", "start"]