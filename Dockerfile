FROM almir/webhook



COPY config/hooks.json /etc/webhook/hooks.json
COPY scripts /scripts
COPY credentials/deploy.github.com /root/.ssh/id_rsa

RUN apk update && apk upgrade
RUN apk add --no-cache bash git openssh nodejs

RUN chmod 755 -R /scripts
RUN ls -la /scripts

#RUN mkdir -p /root/.ssh
#RUN chmod 700 /root/.ssh/id_rsa
#RUN mkdir -p /var/www/travis
#RUN ssh -o StrictHostKeyChecking=no git@github.com 2>/dev/null; exit 0
#RUN git clone git@github.com:GuillaumeSarfati/test-travis.git /var/www/travis

CMD ["-verbose", "-nopanic", "-hooks=/etc/webhook/hooks.json", "-hotreload"]
