FROM node:21-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy your script
COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Install dependencies and customize sandbox
WORKDIR /home/temp/nextjs-app
RUN mkdir /home/user

# Create Next.js app directly in /home/user
RUN npx --yes create-next-app@15.4.6 . --yes


# Install shadcn UI and all components
RUN npx --yes shadcn@2.10.0 init --yes -b neutral --force
RUN npx --yes shadcn@2.10.0 add --all --yes

# Move the Nextjs app to the home directory and remove the nextjs-app directory
RUN mv /home/temp/nextjs-app/* /home/user
RUN rm -rf /home/temp/nextjs-app