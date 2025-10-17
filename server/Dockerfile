FROM php:8.3-cli

RUN docker-php-ext-install pdo pdo_mysql mysqli

WORKDIR /var/www/html

COPY . .

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
