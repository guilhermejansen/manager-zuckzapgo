#!/bin/bash
# ==============================================================================
# Docker Build Script
# Manager ZuckZapGo - Next.js 16 Application
# ==============================================================================
#
# This script provides convenient commands for building Docker images
# with support for multi-architecture builds.
#
# Usage:
#   ./scripts/docker-build.sh [options]
#
# Options:
#   --local           Build for local platform only (faster)
#   --multi-arch      Build for multiple architectures (amd64, arm64)
#   --push            Push image to registry after build
#   --tag TAG         Custom tag (default: latest)
#   --no-cache        Build without using cache
#   --help            Show this help message
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default configuration
IMAGE_NAME="manager-zuckzapgo"
TAG="latest"
BUILD_TYPE="local"
PUSH=false
NO_CACHE=""

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Show usage
usage() {
    cat << EOF
${BLUE}Docker Build Script for Manager ZuckZapGo${NC}

Usage: $0 [options]

Options:
  --local           Build for local platform only (faster, default)
  --multi-arch      Build for multiple architectures (amd64, arm64)
  --push            Push image to registry after build
  --tag TAG         Custom tag (default: latest)
  --no-cache        Build without using cache
  --help            Show this help message

Examples:
  # Local build (fastest)
  $0 --local

  # Multi-architecture build
  $0 --multi-arch

  # Build and push with custom tag
  $0 --multi-arch --push --tag v1.0.0

  # Build without cache
  $0 --local --no-cache

EOF
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --local)
            BUILD_TYPE="local"
            shift
            ;;
        --multi-arch)
            BUILD_TYPE="multi-arch"
            shift
            ;;
        --push)
            PUSH=true
            shift
            ;;
        --tag)
            TAG="$2"
            shift 2
            ;;
        --no-cache)
            NO_CACHE="--no-cache"
            shift
            ;;
        --help)
            usage
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            ;;
    esac
done

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if buildx is available for multi-arch builds
if [ "$BUILD_TYPE" = "multi-arch" ]; then
    if ! docker buildx version &> /dev/null; then
        log_error "Docker buildx is not available. Please install/enable buildx for multi-architecture builds."
        exit 1
    fi
fi

# Main build logic
main() {
    log_info "Starting Docker build process..."
    log_info "Image: ${IMAGE_NAME}:${TAG}"
    log_info "Build type: ${BUILD_TYPE}"

    # Navigate to project root
    cd "$(dirname "$0")/.."
    log_info "Working directory: $(pwd)"

    # Check if required files exist
    if [ ! -f "Dockerfile" ]; then
        log_error "Dockerfile not found in current directory"
        exit 1
    fi

    if [ ! -f "package.json" ]; then
        log_error "package.json not found in current directory"
        exit 1
    fi

    # Build based on type
    if [ "$BUILD_TYPE" = "local" ]; then
        build_local
    elif [ "$BUILD_TYPE" = "multi-arch" ]; then
        build_multi_arch
    fi

    log_info "Build completed successfully! 🎉"

    # Show image size
    if [ "$BUILD_TYPE" = "local" ]; then
        IMAGE_SIZE=$(docker images "${IMAGE_NAME}:${TAG}" --format "{{.Size}}")
        log_info "Image size: ${IMAGE_SIZE}"
    fi

    # Show next steps
    show_next_steps
}

# Build for local platform only
build_local() {
    log_step "Building for local platform..."

    docker build \
        $NO_CACHE \
        -t "${IMAGE_NAME}:${TAG}" \
        -f Dockerfile \
        .

    if [ "$PUSH" = true ]; then
        log_warn "Push is only supported for multi-arch builds"
    fi
}

# Build for multiple architectures
build_multi_arch() {
    log_step "Building for multiple architectures (linux/amd64, linux/arm64)..."

    # Create/use buildx builder
    if ! docker buildx inspect manager-builder &> /dev/null; then
        log_step "Creating buildx builder 'manager-builder'..."
        docker buildx create --name manager-builder --use
    else
        docker buildx use manager-builder
    fi

    # Determine build action
    if [ "$PUSH" = true ]; then
        ACTION="--push"
        log_warn "Image will be pushed to registry"
    else
        ACTION="--load"
        log_warn "Multi-arch build will only load for current platform"
    fi

    # Build
    docker buildx build \
        $NO_CACHE \
        --platform linux/amd64,linux/arm64 \
        -t "${IMAGE_NAME}:${TAG}" \
        $ACTION \
        -f Dockerfile \
        .
}

# Show next steps
show_next_steps() {
    echo ""
    log_info "Next steps:"
    echo ""
    echo "  1. Run with Docker Compose:"
    echo "     ${BLUE}docker-compose -f docker-compose.production.yml up -d${NC}"
    echo ""
    echo "  2. Run standalone:"
    echo "     ${BLUE}docker run -d -p 3000:3000 --env-file .env.production ${IMAGE_NAME}:${TAG}${NC}"
    echo ""
    echo "  3. View logs:"
    echo "     ${BLUE}docker logs -f manager-app${NC}"
    echo ""
    echo "  4. Check health:"
    echo "     ${BLUE}docker ps${NC}"
    echo ""
}

# Run main function
main
