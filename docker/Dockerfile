## Ref : https://hub.docker.com/r/opencomp/wkhtmltopdf/
FROM opencomp/wkhtmltopdf:0.12.5-alpine3.11 AS wkhtmltopdf

FROM php:7.4.10-fpm-alpine3.11

ARG ENVIRONMENT

# make sure you can use HTTPS
RUN apk --update add ca-certificates oniguruma-dev zlib-dev libzip-dev libpng-dev icu-dev libxslt-dev openssl-dev curl-dev libxml2-dev && \
docker-php-ext-install pdo_mysql mysqli gd exif intl xsl soap zip opcache && \
mv $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini


ENV php_conf /usr/local/etc/php/php-fpm.conf
ENV fpm_conf /usr/local/etc/php-fpm.d/www.conf
ENV php_vars /usr/local/etc/php/conf.d/docker-vars.ini

ENV NGINX_VERSION 1.18.0
ENV NJS_VERSION   0.4.0
ENV PKG_RELEASE   1

RUN set -x \
    # create nginx user/group first, to be consistent throughout docker variants
    && addgroup -g 101 -S nginx \
    && adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx \
    && apkArch="$(cat /etc/apk/arch)" \
    && nginxPackages=" \
        nginx=${NGINX_VERSION}-r${PKG_RELEASE} \
        nginx-module-xslt=${NGINX_VERSION}-r${PKG_RELEASE} \
        nginx-module-geoip=${NGINX_VERSION}-r${PKG_RELEASE} \
        nginx-module-image-filter=${NGINX_VERSION}-r${PKG_RELEASE} \
        nginx-module-njs=${NGINX_VERSION}.${NJS_VERSION}-r${PKG_RELEASE} \
    " \
    && case "$apkArch" in \
        x86_64) \
            # arches officially built by upstream
            set -x \
            && KEY_SHA512="e7fa8303923d9b95db37a77ad46c68fd4755ff935d0a534d26eba83de193c76166c68bfe7f65471bf8881004ef4aa6df3e34689c305662750c0172fca5d8552a *stdin" \
            && apk add --no-cache --virtual .cert-deps \
                openssl \
            && wget -O /tmp/nginx_signing.rsa.pub https://nginx.org/keys/nginx_signing.rsa.pub \
            && if [ "$(openssl rsa -pubin -in /tmp/nginx_signing.rsa.pub -text -noout | openssl sha512 -r)" = "$KEY_SHA512" ]; then \
                echo "key verification succeeded!"; \
                mv /tmp/nginx_signing.rsa.pub /etc/apk/keys/; \
            else \
                echo "key verification failed!"; \
                exit 1; \
            fi \
            && apk del .cert-deps \
            && apk add -X "https://nginx.org/packages/alpine/v$(egrep -o '^[0-9]+\.[0-9]+' /etc/alpine-release)/main" --no-cache $nginxPackages \
            ;; \
        *) \
            # we're on an architecture upstream doesn't officially build for
            # let's build binaries from the published packaging sources
            set -x \
            && tempDir="$(mktemp -d)" \
            && chown nobody:nobody $tempDir \
            && apk add --no-cache --virtual .build-deps \
                gcc \
                libc-dev \
                make \
                openssl-dev \
                pcre-dev \
                zlib-dev \
                linux-headers \
                libxslt-dev \
                gd-dev \
                geoip-dev \
                perl-dev \
                libedit-dev \
                mercurial \
                bash \
                alpine-sdk \
                findutils \
            && su nobody -s /bin/sh -c " \
                export HOME=${tempDir} \
                && cd ${tempDir} \
                && hg clone https://hg.nginx.org/pkg-oss \
                && cd pkg-oss \
                && hg up -r 429 \
                && cd alpine \
                && make all \
                && apk index -o ${tempDir}/packages/alpine/${apkArch}/APKINDEX.tar.gz ${tempDir}/packages/alpine/${apkArch}/*.apk \
                && abuild-sign -k ${tempDir}/.abuild/abuild-key.rsa ${tempDir}/packages/alpine/${apkArch}/APKINDEX.tar.gz \
                " \
            && cp ${tempDir}/.abuild/abuild-key.rsa.pub /etc/apk/keys/ \
            && apk del .build-deps \
            && apk add -X ${tempDir}/packages/alpine/ --no-cache $nginxPackages \
            ;; \
    esac \
    # if we have leftovers from building, let's purge them (including extra, unnecessary build deps)
    && if [ -n "$tempDir" ]; then rm -rf "$tempDir"; fi \
    && if [ -n "/etc/apk/keys/abuild-key.rsa.pub" ]; then rm -f /etc/apk/keys/abuild-key.rsa.pub; fi \
    && if [ -n "/etc/apk/keys/nginx_signing.rsa.pub" ]; then rm -f /etc/apk/keys/nginx_signing.rsa.pub; fi \
    # Bring in gettext so we can get `envsubst`, then throw
    # the rest away. To do this, we need to install `gettext`
    # then move `envsubst` out of the way so `gettext` can
    # be deleted completely, then move `envsubst` back.
    && apk add --no-cache --virtual .gettext gettext \
    && mv /usr/bin/envsubst /tmp/ \
    \
    && runDeps="$( \
        scanelf --needed --nobanner /tmp/envsubst \
            | awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' \
            | sort -u \
            | xargs -r apk info --installed \
            | sort -u \
    )" \
    && apk add --no-cache $runDeps \
    && apk del .gettext \
    && mv /tmp/envsubst /usr/local/bin/ \
    # Bring in tzdata so users could set the timezones through the environment
    # variables
    && apk add --no-cache tzdata \
    # forward request and error logs to docker log collector
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log


    RUN echo @testing http://nl.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories && \
    echo /etc/apk/respositories && \
    apk update && apk upgrade &&\
    apk add --no-cache \
    bash \
    openssh-client \
    wget \
    supervisor \
    curl \
    libcurl \
    git \
    #    python \
    #    python-dev \
    #    py-pip \
    augeas-dev \
    libressl-dev \
    ca-certificates \
    dialog \
    autoconf \
    make \
    gcc \
    musl-dev \
    linux-headers \
    libmcrypt-dev \
    libpng-dev \
    icu-dev \
    libpq \
    libxslt-dev \
    libffi-dev \
    freetype-dev \
    sqlite-dev \
    openldap-dev \
    yarn \
    nodejs \
    libjpeg-turbo-dev && \
    mkdir -p /etc/nginx && \
    mkdir -p /var/www/app && \
    mkdir -p /run/nginx && \
    mkdir -p /var/log/supervisor && \
    EXPECTED_COMPOSER_SIGNATURE=$(wget -q -O - https://composer.github.io/installer.sig) && \
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php -r "if (hash_file('SHA384', 'composer-setup.php') === '${EXPECTED_COMPOSER_SIGNATURE}') { echo 'Composer.phar Installer verified'; } else { echo 'Composer.phar Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" && \
    php composer-setup.php --install-dir=/usr/bin --filename=composer && \
    php -r "unlink('composer-setup.php');"  && \
    #    pip install -U pip && \
    #    pip install -U certbot && \
    #    mkdir -p /etc/letsencrypt/webrootauth && \
    apk del gcc musl-dev linux-headers libffi-dev augeas-dev make autoconf
    #    apk del .sys-deps
    #    ln -s /usr/bin/php7 /usr/bin/php

    ADD conf/supervisord.conf /etc/supervisord.conf

    # Copy our nginx config
    RUN rm -Rf /etc/nginx/nginx.conf
    ADD conf/nginx.conf /etc/nginx/nginx.conf

    # nginx site conf
    RUN mkdir -p /etc/nginx/sites-available/ && \
    mkdir -p /etc/nginx/sites-enabled/ && \
    rm -Rf /var/www/* && \
    mkdir /var/www/html/
    ADD conf/nginx-site.conf /etc/nginx/sites-available/default.conf
    RUN ln -s /etc/nginx/sites-available/default.conf /etc/nginx/sites-enabled/default.conf

    # tweak php-fpm config
    # WARNING : limit memory on production env
    RUN echo "cgi.fix_pathinfo=0" > ${php_vars} &&\
    echo "upload_max_filesize = 100M"  >> ${php_vars} &&\
    echo "post_max_size = 100M"  >> ${php_vars} &&\
    echo "variables_order = \"EGPCS\""  >> ${php_vars} && \
    echo "memory_limit = 4096M"  >> ${php_vars} && \
    echo "max_execution_time = 1800"  >> ${php_vars} && \
    echo "date.timezone = Europe/Paris"  >> ${php_vars} && \
    sed -i \
    -e "s/;catch_workers_output\s*=\s*yes/catch_workers_output = yes/g" \
    -e "s/pm.max_children = 5/pm.max_children = 4/g" \
    -e "s/pm.start_servers = 2/pm.start_servers = 3/g" \
    -e "s/pm.min_spare_servers = 1/pm.min_spare_servers = 2/g" \
    -e "s/pm.max_spare_servers = 3/pm.max_spare_servers = 4/g" \
    -e "s/;pm.max_requests = 500/pm.max_requests = 200/g" \
    -e "s/user = www-data/user = root/g" \
    -e "s/group = www-data/group = root/g" \
    -e "s/;listen.mode = 0660/listen.mode = 0666/g" \
    -e "s/;listen.owner = www-data/listen.owner = root/g" \
    -e "s/;listen.group = www-data/listen.group = root/g" \
    -e "s/listen = 127.0.0.1:9000/listen = \/var\/run\/php-fpm.sock/g" \
    -e "s/^;clear_env = no$/clear_env = no/" \
    ${fpm_conf}
    #    ln -s /etc/php7/php.ini /etc/php7/conf.d/php.ini && \
    #    find /etc/php7/conf.d/ -name "*.ini" -exec sed -i -re 's/^(\s*)#(.*)/\1;\2/g' {} \;


	## Add Symfony pre-requisites - wkhtml configs to generate policy
    RUN apk update && apk upgrade &&\
    apk add --no-cache \
    make \
    g++ \
    rsync \
    libx11 libxrender fontconfig font-util ttf-freefont

    ## Copy binary file to the first image built into this second image
    COPY --from=wkhtmltopdf /bin/wkhtmltopdf /bin/wkhtmltopdf

# Only for test
RUN if [ "$ENVIRONMENT" = "test" ] ; then \
 	# Add pcov for Coverage
 	apk add autoconf pcre2-dev && \
    pecl install pcov && \
    docker-php-ext-enable pcov ; \
 fi

    # Add Scripts
    ADD scripts/start.sh /start.sh
    RUN chmod 755 /start.sh
    ADD scripts/check-connection.sh /check-connection.sh
    RUN chmod 755 /check-connection.sh



    EXPOSE 80

    WORKDIR "/var/www/html"
    CMD ["/start.sh"]
