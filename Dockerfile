FROM ubuntu:18.04

RUN apt-get update && apt-get install -y && \
	apt-get upgrade -y && \
	apt-get install git -y && \
	apt-get install curl wget -y && apt-get install -y && \
	apt-get install gnupg -y && \
	apt-get clean

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
	apt-get install -y nodejs

ENV EMBERVERSION 3.3.0

RUN npm update && \
	npm install -g ember-cli@${EMBERVERSION}

WORKDIR /app

LABEL max-page-web.version=3.0.4

RUN git clone -b new  https://github.com/PharbersDeveloper/max-web.git

WORKDIR /app/max-web

RUN rm -rf node_modules && \
	npm cache clear --force && \
	npm install 

RUN ember b --environment production

EXPOSE 8080

ENTRYPOINT ["ember", "s", "--live-reload=false"]