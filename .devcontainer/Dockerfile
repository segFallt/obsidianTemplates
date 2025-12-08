# Use a more recent and stable base image
FROM mcr.microsoft.com/vscode/devcontainers/base:0-bullseye

# Enable new "BUILDKIT" mode for Docker CLI
ENV DOCKER_BUILDKIT=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    gnupg2 \
    software-properties-common \
    wget \
    unzip \
    sudo \
    iptables \
    ipset \
    iproute2 \
    dnsutils \
    && rm -rf /var/lib/apt/lists/*


# Ensure proper ownership and permissions for vscode user
# RUN chown -R vscode:vscode /home/vscode


# Switch back to vscode user
USER vscode
WORKDIR /workspace

# Set proper shell and add a proper command to keep container running
SHELL ["/bin/bash", "-c"]

# Keep container running (this is crucial for dev containers)
CMD ["sleep", "infinity"]