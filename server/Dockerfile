FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libjpeg-dev libfreetype6-dev && \
    docker-php-ext-install pdo pdo_mysql mysqli && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY . .
RUN curl -sS https://getcomposer.org/installer | php && \
    php composer.phar install --no-dev --optimize-autoloader && \
    rm composer.phar


EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
