FROM gsarfati/node

EXPOSE 8888

# CREDENTIALS SETUP

RUN npm install -g babel-cli

# CREDENTIAL SUPPORT
COPY credentials/deploy.github.com /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN ssh -o StrictHostKeyChecking=no git@github.com 2>/dev/null; exit 0

# TREVOR SETUP
COPY src /etc/trevor

# SHARED VOLUME
# VOLUME /var/www

CMD ["babel-node", "/etc/trevor"]
