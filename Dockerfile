# from alpine:3.20.3
FROM alpine:3.20.3

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install node dependencies (node, npm, yarn, git, python3, yt-dlp, ffmpeg)
RUN apk add --no-cache nodejs npm yarn git python3 yt-dlp ffmpeg

# clone the repository
COPY ./BE /usr/src/app/BE
COPY ./FE /usr/src/app/FE
# RUN git clone https://github.com/Clyde0909/WebYtDlp.git

# Make python venv in BE directory and install python dependencies
RUN cd BE && python3.12 -m venv venv && . venv/bin/activate && pip install -r requirements.txt && cd ..

# Install node dependencies
RUN cd FE && yarn install && yarn build && cd ..

# Expose port 20080
EXPOSE 20080