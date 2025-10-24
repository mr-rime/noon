FROM php:8.3-cli

RUN docker-php-ext-install pdo pdo_mysql mysqli

WORKDIR /var/www/html

COPY . .

RUN curl -sS https://getcomposer.org/installer | php && \
    php composer.phar install --no-dev --optimize-autoloader && \
    rm composer.phar

EXPOSE 10000

CMD ["php", "-S", "0.0.0.0:${PORT}", "-t", "public"]
