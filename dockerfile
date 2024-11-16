# Usamos una imagen base de Nginx para servir archivos estáticos
FROM nginx:alpine

# Copiamos los archivos de la aplicación desde la carpeta src
COPY src/ /usr/share/nginx/html

# Exponemos el puerto 80 para que la app sea accesible
EXPOSE 80

# Comando por defecto para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
