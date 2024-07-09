
# Use the official Python image as the base image
FROM python:latest

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install any needed dependencies specified in requirements.txt
RUN pip install --no-cache-dir flask

# Make port 7000 available to the world outside this container
EXPOSE 7000

# Run app.py when the container launches
CMD ["python", "app2.py"]
