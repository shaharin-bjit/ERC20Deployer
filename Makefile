# Variables
IMAGE_NAME = erc20deployer_fe
CONTAINER_NAME = erc20-deployer-container
PORT = 5000

# Build the Docker image
build: 
		docker build -t $(IMAGE_NAME) .

# Run the Docker container
run:
		docker run -d -p $(PORT):5000 --name $(CONTAINER_NAME) $(IMAGE_NAME)

# Stop and remove the container
stop:
		docker stop $(CONTAINER_NAME) && docker rm $(CONTAINER_NAME)

# Rebuild and restart the container
restart: stop build run
