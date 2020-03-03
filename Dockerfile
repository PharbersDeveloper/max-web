FROM ubuntu:18.04

RUN apt-get update && apt-get install -y && \
	apt-get upgrade -y && \
	apt-get install git -y && \
	apt-get install curl wget -y && apt-get install -y && \
	apt-get install gnupg -y && \
	apt-get clean

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
	apt-get install -y nodejs

RUN npm update && \
	npm i -g n && \
	n 8.0.0

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
	echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
	apt-get update && \
	apt-get install -y yarn

ENV EMBERVERSION 3.3.0

RUN npm update && \
	npm install -g ember-cli@${EMBERVERSION}

RUN ember --version 

WORKDIR /app

LABEL max-page-web.version=3.0.4

RUN git clone -b newFrank12-14 https://github.com/PharbersDeveloper/max-web.git

WORKDIR /app/max-web

RUN yarn

RUN ember b --environment production

EXPOSE 8080

ENTRYPOINT ["ember", "s", "--live-reload=false"]