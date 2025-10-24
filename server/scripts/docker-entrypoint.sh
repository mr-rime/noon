#!/bin/bash
set -e

echo "🚀 Starting container..."

php -r "
\$host = getenv('DB_HOST');
\$user = getenv('DB_USER');
\$pass = getenv('DB_PASSWORD');
\$db   = getenv('DB_NAME');
\$port = getenv('DB_PORT') ?: 3306;

\$mysqli = @new mysqli(\$host, \$user, \$pass, \$db, \$port);

if (\$mysqli->connect_errno) {
    echo '❌ Database connection failed: '.\$mysqli->connect_error.PHP_EOL;
    exit(0);
}

\$result = \$mysqli->query('SHOW TABLES');
if (!\$result) {
    echo '⚠️ Could not list tables: '.\$mysqli->error.PHP_EOL;
    exit(0);
}

if (\$result->num_rows === 0) {
    echo '📦 No tables found, importing schema...'.PHP_EOL;
    \$sql = file_get_contents('/var/www/html/config/noondb.sql');
    if (!\$sql) {
        echo '❌ Could not read /var/www/html/config/noondb.sql'.PHP_EOL;
        exit(0);
    }

    if (\$mysqli->multi_query(\$sql)) {
        do {
            if (\$res = \$mysqli->store_result()) {
                \$res->free();
            }
        } while (\$mysqli->next_result());
        echo '✅ Database initialized successfully.'.PHP_EOL;
    } else {
        echo '❌ SQL import failed: '.\$mysqli->error.PHP_EOL;
    }
} else {
    echo '✅ Database already initialized.'.PHP_EOL;
}

\$mysqli->close();
"

echo "✅ Launching PHP server..."
exec php -S 0.0.0.0:${PORT:-8000} -t public
