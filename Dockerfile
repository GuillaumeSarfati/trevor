FROM debian

EXPOSE 8888

# CREDENTIALS SETUP
RUN apt-get update
RUN apt-get install curl gnupg --yes

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update
RUN apt-get install nodejs git --yes
RUN npm install -g babel-cli

# CREDENTIAL SUPPORT
COPY credentials/deploy.github.com /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN ssh -o StrictHostKeyChecking=no git@github.com 2>/dev/null; exit 0

# TREVOR SETUP
COPY src /etc/trevor
RUN npm install

# SHARED VOLUME
# VOLUME /var/www

CMD ["babel-node", "/etc/trevor"]
