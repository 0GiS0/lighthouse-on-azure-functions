# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:3.0-appservice
FROM mcr.microsoft.com/azure-functions/node:3.0

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    CHROMIUM_PATH=/usr/bin/chromium

COPY . /home/site/wwwroot

RUN apt-get update && apt-get -y install chromium && \
    cd /home/site/wwwroot && \
    npm install