FROM keymetrics/pm2:10-alpine

# Create a workdir
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json to install
COPY package*.json ./

# Set npm install logging to warn
ENV NPM_CONFIG_LOGLEVEL warn

# Install dependencies
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm ci --only=production \
    && apk del build-dependencies

# Copy all content of the current folder except those that are in .dockerignore
COPY . .

# Expose
EXPOSE 3000

# Run the pm2
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]