#Variables
RESOURCE_GROUP_NAME="AzureFunctionsContainers"
LOCATION="northeurope"
STORAGE_ACCOUNT="funcindockerstore"
PREMIUM_PLAN_NAME="myPremiumPlan2"
FUNCTION_APP_NAME="lighthousedocker"
RUNTIME="node"
DOCKER_IMAGE="0gis0/lighthouseonazurefunctions:1.0"

#Azure Login
az login

#Create resource group
az group create -n $RESOURCE_GROUP_NAME -l $LOCATION

#Create a storage account
az storage account create --name $STORAGE_ACCOUNT --location $LOCATION --resource-group $RESOURCE_GROUP_NAME --sku Standard_LRS

#Create a Premium Azure Function Plan
az functionapp plan create --resource-group $RESOURCE_GROUP_NAME --name $PREMIUM_PLAN_NAME --location $LOCATION --number-of-workers 1 --sku EP1 --is-linux

#Create an Azure Function App
az functionapp create --name $FUNCTION_APP_NAME --storage-account $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP_NAME --plan $PREMIUM_PLAN_NAME --runtime $RUNTIME --deployment-container-image-name $DOCKER_IMAGE --functions-version 2

#Get Azure Storage connection string
STORAGE_CONNECTION_STRING=$(az storage account show-connection-string --resource-group $RESOURCE_GROUP_NAME --name $STORAGE_ACCOUNT --query connectionString --output tsv)

#Add the connection string to AzureWebJobsStorage
az functionapp config appsettings set --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP_NAME --settings AzureWebJobsStorage=$STORAGE_CONNECTION_STRING

az functionapp delete --name $FUNCTION_APP_NAME -g $RESOURCE_GROUP_NAME