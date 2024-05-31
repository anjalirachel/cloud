# Use the official Python image as the base image
FROM python:latest

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install any needed dependencies specified in requirements.txt
RUN pip install --no-cache-dir flask requests

# Make port 6000 available to the world outside this container
EXPOSE 6000

# Run app.py when the container launches
CMD ["python", "app1.py"]

