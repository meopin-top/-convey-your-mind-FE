FROM node:18-alpine

#  https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

# sudo 없이 실행 가능하도록
RUN adduser --system --uid 1001 nextjs && addgroup --system --gid 1001 nodejs
RUN chown nextjs:nodejs /app
COPY --chown=nextjs:nodejs . .
USER nextjs

RUN \
  if [ -f yarn.lock ]; then YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install && yarn build; \
  else echo "Lockfile not found." && exit 1; \
  fi

EXPOSE 3000

CMD ["yarn", "start"]
