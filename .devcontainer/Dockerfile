FROM node:24-bookworm

# Configure pnpm's home and ensure it's on PATH for the node user.
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable \
  && corepack prepare pnpm@10.28.1 --activate

# Default workspace mount location for VS Code Dev Containers.
WORKDIR /workspace

# Use the non-root user provided by the official Node image to avoid
# root-owned files on bind-mounted project folders.
USER node
