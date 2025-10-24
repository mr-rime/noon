FROM php:8.3-cli

RUN docker-php-ext-install pdo pdo_mysql mysqli

WORKDIR /var/www/html

COPY . .

EXPOSE 10000

CMD ["php", "-S", "0.0.0.0:${PORT}", "-t", "public"]
