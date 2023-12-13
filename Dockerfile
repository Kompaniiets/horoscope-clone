#
# 🧑‍💻 DEVELOPMENT BUILD (LOCAL)
#
# Base image for development
FROM node:18-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency
COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm ci

# Copy source code into app folder
COPY --chown=node:node . .

# Set Docker as a non-root user
USER node


#
# 🏡 PRODUCTION BUILD
#
FROM node:18-alpine As build

WORKDIR /usr/src/app

# Set NODE_ENV environment variable
ENV NODE_ENV production

COPY --chown=node:node package*.json ./

# In order to run `yarn build` we need access to the Nest CLI. Nest CLI is a dev dependency.
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Install only the production dependencies and clean cache to optimize image size.
RUN npm ci --only=production && npm cache clean --force

USER node


#
# 🚀 PRODUCTION SERVER
#
FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
